import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        console.log(token);
        return token;
    } catch (e) {
        console.error('Failed to fetch the token from storage', e);
        return null;
    }
};
