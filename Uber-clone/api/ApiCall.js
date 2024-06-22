import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://192.168.0.33:3000/api",
});

const login = async (params) => {
    try {
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

const ApiCall = {
    login,
    checkEmailResetPassword
};

export default ApiCall;