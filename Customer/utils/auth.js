import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiCall from '../api/ApiCall';

export const checkToken = async () => {
    try {
        const response = await ApiCall.getMe();
        if (response.status === 200) {
            await AsyncStorage.setItem('userData', JSON.stringify(response.data));
            return true;
        } else {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            return false;
        }

    } catch (e) {
        console.error('Failed to fetch the token from storage', e);
        return null;
    }
};
