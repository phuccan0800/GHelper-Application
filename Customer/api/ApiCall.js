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
        console.log("Error: ", error.response.status, error.response.data)
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
        return { status: response.status, message: response.data.message };
    }
    catch (error) {
        console.log(error)
        console.log(error.response.data)
        return { status: error.response.status, message: error.response.data.message };
    };
}

const getMe = async () => {
    try {
        const response = await axiosClient.get(`/@me`);
        return response
    }
    catch (error) {
        console.log(error.response.data)
        return { status: error.response.status, message: error.response.data.message };
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
        const response = await axiosClientFileStorage.post(`/upload`, formData);
        const confirm = await axiosClient.post(`/changeAvatar`, { link: response.data.link });
        console.log("Response Api Call: " + JSON.stringify(confirm.data))
        return { status: 200, message: 'Upload Avatar Successfully !' };
    }
    catch (error) {
        console.log("Response Api Call: " + JSON.stringify(error.response.data))
        return { status: error.response.status, message: error.response.data.message };
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
        console.log(response.data)
        return response.data;
    }
    catch (error) {
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

const addPaymentMethod = async (params) => {
    try {
        console.log('API Request Params:', JSON.stringify(params, null, 2));
        const requestData = {
            type: 'Stripe',
            stripePaymentMethodId: params.paymentMethodId,
            cardType: params.cardType,
            last4Digits: params.last4Digits,
            expiryMonth: params.expiryMonth,
            expiryYear: params.expiryYear,
            cardholderName: params.cardholderName,
            isDefault: params.isDefault || false
        };
        console.log('Sending to backend:', JSON.stringify(requestData, null, 2));

        const response = await axiosClient.post(`/addPaymentMethod`, requestData);
        console.log('API Response:', JSON.stringify(response.data, null, 2));
        return response;
    } catch (error) {
        console.error('API Error:', error);
        if (error.response) {
            console.error('Error Response:', JSON.stringify(error.response.data, null, 2));
            console.error('Error Status:', error.response.status);
            return {
                status: error.response.status,
                message: error.response.data.message || 'Failed to add payment method'
            };
        }
        return {
            status: 500,
            message: error.message || 'Internal server error'
        };
    }
};

const getPaymentMethodById = async (id) => {
    try {
        const response = await axiosClient.get(`/paymentMethods/${id}`);
        return response.data;
    }
    catch (error) {
        console.error(error.response.data)
        return { status: error.response.status, message: error.response.data.message };
    };
}

const setIsDefault = async (id) => {
    try {
        const response = await axiosClient.put(`/setIsDefault/${id}`);
        return response;
    }
    catch (error) {
        return { status: error.response.status, message: error.response.data.message };
    };
}

const deletePaymentMethod = async (id) => {
    try {
        const response = await axiosClient.delete(`/paymentMethods/${id}`);
        return response;
    }
    catch (error) {
        console.error(error.response.data)
        return { status: error.response.status, message: error.response.data.message };
    };
}

const createTransaction = async (params) => {
    try {
        const response = await axiosClient.post(`/createTransaction`, params);
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data.message };
    };
}

const refundTransaction = async (transactionId) => {
    try {
        const response = await axiosClient.post(`/refundTransaction`, { transactionId });
        return response;
    }
    catch (error) {
        return { status: error.response.status, message: error.response.data.message };
    };
}

const findAndAssignWorker = async (params) => {
    try {
        const response = await axiosClient.post(`/findAndAssignWorker`, params, { timeout: 1000 });
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data.message };
    };
}

const getTransactions = async () => {
    try {
        const response = await axiosClient.get(`/transactions`);
        return response;
    }
    catch (error) {
        return { status: error.response.status, message: error.response.data.message };
    };
}

const getWorkerLocation = async (workerId) => {
    try {
        const response = await axiosClient.get(`/location`, {
            params: { workerId },
        });
        return response.data;
    }
    catch (error) {
        return error.response.data;
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
    getDefaultPaymentMethod,
    addPaymentMethod,
    getPaymentMethodById,
    setIsDefault,
    deletePaymentMethod,
    createTransaction,
    refundTransaction,
    findAndAssignWorker,
    getTransactions,
    getWorkerLocation
};

export default ApiCall;