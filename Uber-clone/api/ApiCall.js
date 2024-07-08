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

const login = async (params) => {
    try {
        console.log(backendUrl, Device.modelName);
        const response = await axiosClient.post(`/login`, params);
        await AsyncStorage.setItem('userToken', response.data.token);
        axiosClient.defaults.headers.common['Authorization'] = await AsyncStorage.getItem('userToken');
        return response;
    }
    catch (error) {
        console.log({ status: error.response.status, message: error.response.data.message })
        return { status: error.response.status, message: error.response.data.message };
    };
};

const checkEmailResetPassword = async (email) => {
    try {
        const response = await axiosClient.post(`/forgotPassword`, {
            email: email
        });
        return response;
    }
    catch (error) {
        console.log(error.response.data)
        return error.response.data;
    };
}

const confirmResetPassword = async (params) => {
    try {
        const response = await axiosClient.post(`/reset`, params);
        return response;
    }
    catch (error) {
        console.log(error.response.status, error.response.data)
        return { status: error.response.status, message: error.response.data.message };
    };
}

const register = async (params) => {
    try {
        const response = await axiosClient.post(`/register`, params);
        return response;
    }
    catch (error) {
        console.log(error.response.data)
        return { status: error.response.status, message: error.response.data.message };
    };
}

const logout = async () => {
    try {

        const response = await axiosClient.get(`/logout`);
        await AsyncStorage.removeItem('userToken');
        console.log(response.data);
        return response;
    }
    catch (error) {
        console.log(error.response.data)
        return error.response.data;
    };
}

const ApiCall = {
    login,
    checkEmailResetPassword,
    confirmResetPassword,
    register,
    logout
};

export default ApiCall;