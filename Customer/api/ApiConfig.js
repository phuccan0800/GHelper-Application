import axios from "axios";
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';


const backendUrl = "https://ghelper.ttphuc.com/api";
const axiosClient = axios.create({
    baseURL: backendUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': `${Device.modelName} ${Device.osName} ${Device.osVersion}`,
    }
});

const axiosClientFileStorage = axios.create({
    baseURL: "http://115.146.126.73:5000/files",
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
axiosClientFileStorage.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        config.headers['Authorization'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export { axiosClient, axiosClientFileStorage };