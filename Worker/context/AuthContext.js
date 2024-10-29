import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiCall from '../Api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const isWorker = await AsyncStorage.getItem('isWorker');
                let check;
                try {
                    check = await ApiCall.getUserData();
                    await AsyncStorage.setItem('userData', JSON.stringify(check.data));
                    console.log("User data: ", check.data);

                } catch (e) {
                    check = false;
                }
                if (isWorker && token && check) {
                    setIsLoggedIn(true);
                } else {
                    await AsyncStorage.removeItem('userToken');
                    await AsyncStorage.removeItem('isWorker');
                    setIsLoggedIn(false);
                }
            } catch (e) {
                console.log(e);
            }
        };
        checkLoginStatus();
    }, []);


    return (
        <AuthContext.Provider value={{ isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};
