import axios from "axios";
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';


const backendUrl = "http://192.168.1.36:3000/api";
// const backendUrl = "http://10.25.199.184:3000/api";
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

const login = async (params) => {
    try {
        const response = await axiosClient.post(`/login`, params);
        axiosClient.defaults.headers.common['Authorization'] = response.data.token;
        const user = (await axiosClient.get(`/@me`)).data;
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        return response;
    }
    catch (error) {
        console.error(error.response.data.message)
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
        console.log("Error: ", error.response.status, error.response.data)
        return { status: error.response.status, message: error.response.data.message };
    };
}

const confirmResetPassword = async (params) => {
    try {
        const response = await axiosClient.post(`/reset`, params);
        return response.data;
    }
    catch (error) {
        console.log(error.response.status, error.response.data)
        return { status: error.response.status, message: error.response.data.message };
    };
}

const register = async (params) => {
    try {
        console.log("data request register: " + JSON.stringify(params))
        const response = await axiosClient.post(`/register`, params);
        return response.data;
    }
    catch (error) {
        console.log(error.response.data)
        return { status: error.response.status, message: error.response.data.message };
    };
}

const getMe = async () => {
    try {
        const response = await axiosClient.get(`/@me`);
        return response.data;
    }
    catch (error) {
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('userData');
        return error.response.data;
    };
}

const logout = async () => {
    try {
        if (!axiosClient.defaults.headers.common['Authorization']) {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            return { status: 200, message: 'Already Logout !' };
        }
        const response = await axiosClient.get(`/logout`);
        await AsyncStorage.removeItem('userToken');
        return response;
    }
    catch (error) {
        console.log(error.response.data)
        return error.response.data;
    };
}
const editProfile = async (params) => {
    try {
        const response = await axiosClient.post(`/editProfile`, params);
        return response.data;
    }
    catch (error) {
        console.log(error.response.data)
        return error.response.data;
    };
}
const uploadNewAvatar = async (formData) => {
    try {
        const response = await axios.post(`${backendUrl}/changeAvatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'User-Agent': `${Device.modelName} ${Device.osName} ${Device.osVersion}`,
                'Authorization': await AsyncStorage.getItem('userToken')
            }
        });
        return response.data;
    }
    catch (error) {
        console.log("Response Api Call: " + JSON.stringify(error.response.data))
        return error.response.data;
    };
}

const getAllJobs = async () => {
    try {
        const response = await axiosClient.get(`/jobs`);
        return response.data;
    }
    catch (error) {
        console.log(error.response.data)
        return error.response.data;
    };
}

const checkJobPrice = async (JobId, params) => {
    try {
        const response = await axiosClient.post(`/checkJobPrice`, { id: JobId, options: params });
        return response;
    }
    catch (error) {
        console.error(error.response.data)
        return { status: error.response.status, message: error.response.data.message };
    };
}

const getAllPaymentMethods = async () => {
    try {
        const response = await axiosClient.get(`/allPaymentMethods`);
        return response.data;
    }
    catch (error) {
        console.error(error.response.data)
        return { status: error.response.status, message: error.response.data.message };
    };
}

const getDefaultPaymentMethod = async () => {
    try {
        const response = await axiosClient.get(`/defaultPaymentMethod`);
        return response.data;
    }
    catch (error) {
        return { status: error.response.status, message: error.response.data.message };
    };
}

const ApiCall = {
    login,
    checkEmailResetPassword,
    confirmResetPassword,
    register,
    logout,
    uploadNewAvatar,
    getMe,
    editProfile,
    getAllJobs,
    checkJobPrice,
    getAllPaymentMethods,
    getDefaultPaymentMethod
};

export default ApiCall;