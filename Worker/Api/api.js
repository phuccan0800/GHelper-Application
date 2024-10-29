import axios from "axios";
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backendUrl = "http://192.168.1.36:3000/api";

const axiosClient = axios.create({
    baseURL: backendUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': `${Device.modelName} ${Device.osName} ${Device.osVersion}`,
    }
});

const axiosClient2 = axios.create({
    baseURL: "http://192.168.1.36:5000/files",
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'User-Agent': `${Device.modelName} ${Device.osName} ${Device.osVersion}`,
    }
})

axiosClient.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        config.headers['Authorization'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a request interceptor for the second axios instance
axiosClient2.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        config.headers['Authorization'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


const apiCheckWorkerRegistration = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
            throw new Error('No token found');
        }
        axiosClient.defaults.headers.common['Authorization'] = token;
        const response = await axiosClient.get('/checkWorkerRegistration');

        return response;
    } catch (error) {
        console.error('Error checking worker registration:', error.response.data);
        throw error;
    }
};

const userLogin = async (email, password) => {
    try {
        const response = await axiosClient.post(`/login`, { email, password });
        console.log(response);
        axiosClient.defaults.headers.common['Authorization'] = response.data.token;
        const user = (await axiosClient.get(`/@me`)).data;
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));

        console.log(user);
        return response;
    }
    catch (error) {
        console.log(error)
        return { status: error.response.status, message: error.response.data.message };
    };
};

const getUserData = async () => {
    try {
        const response = await axiosClient.get(`/@me`);
        return response;
    } catch (error) {
        console.log(error);
        throw error.response;
    }
}

const loginWorker = async (email, password) => {
    try {

        const response = await axiosClient.post(`/login`, { email, password });
        console.log(response);
        axiosClient.defaults.headers.common['Authorization'] = response.data.token;
        return response;
    } catch (error) {
        console.log(error.response.data)
        return { status: error.response.status, message: error.response.data.message };
    }
};

const workerRegister = async (data) => {
    console.log(data);
    axiosClient.defaults.headers.common['Authorization'] = await AsyncStorage.getItem('userToken');
    const response = await axiosClient.post(`/registerWorker`, data);
    return response;
};

const callSetOnline = async (isOnline) => {
    axiosClient.defaults.headers.common['Authorization'] = await AsyncStorage.getItem('userToken');
    const response = await axiosClient.post(`/update-status`, { isOnline });
    return response;
};

// ... (existing code)

const ApiCall = {
    userLogin,
    apiCheckWorkerRegistration,
    loginWorker,
    workerRegister,
    getUserData,
    callSetOnline
};

export default ApiCall;