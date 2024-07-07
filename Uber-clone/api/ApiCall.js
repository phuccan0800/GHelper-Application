import axios from "axios";
import * as Device from 'expo-device';


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

const ApiCall = {
    login,
    checkEmailResetPassword,
    confirmResetPassword
};

export default ApiCall;