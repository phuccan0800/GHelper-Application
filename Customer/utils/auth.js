import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiCall from '../api/ApiCall';

export const checkToken = async () => {
    try {
        const userData = await ApiCall.getMe();
        AsyncStorage.setItem('userData', JSON.stringify(userData));
        const token = await AsyncStorage.getItem('userToken');
        console.log(token);
        return token;
    } catch (e) {
        console.error('Failed to fetch the token from storage', e);
        return null;
    }
};
