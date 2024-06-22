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
        console.error("Error while logging in:", error);
        throw error;
    };
};

const ApiCall = {
    login,
};

export default ApiCall;