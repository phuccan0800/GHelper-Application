import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            return true;
        }
        return false;
    } catch (e) {
        console.error('Failed to fetch the token from storage', e);
        return false;
    }
};
