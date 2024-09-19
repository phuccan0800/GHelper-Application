import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const checkToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        return token !== null;
    } catch (error) {
        console.error('Error checking token:', error);
        return false;
    }
};

export const checkIsWorker = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
            return false;
        }

        const response = await axios.get('/checkWorkerRegistration', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.message === 'Worker found';
    } catch (error) {
        console.error('Error checking worker status:', error);
        return false;
    }
};
