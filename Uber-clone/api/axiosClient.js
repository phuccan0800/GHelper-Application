import axios from "axios";
import * as Device from 'expo-device';
import Constants from 'expo-constants';

const axiosClient = axios.create({
    baseURL: "http://192.168.10.3:3000/api",
});



axiosClient.interceptors.request.use(
    async (config) => {
        const deviceInfo = getDeviceInfo();
        const userAgent = `${deviceInfo.deviceModel}, ${deviceInfo.osName} ${deviceInfo.osVersion}, ${Constants.manifest.name}/${Constants.manifest.version}`;

        config.headers['User-Agent'] = userAgent;
        config.headers['Device-Model'] = deviceInfo.deviceModel;
        config.headers['OS-Name'] = deviceInfo.osName;
        config.headers['OS-Version'] = deviceInfo.osVersion;

        console.log("Request interceptor", config.headers);
        return config;
    },
    (error) => {
        console.log("Error in request interceptor", error);
        return Promise.reject(error);
    }
);

export default axiosClient;
