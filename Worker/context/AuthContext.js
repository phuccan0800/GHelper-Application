import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const isWorker = await AsyncStorage.getItem('isWorker');
                if (isWorker && token) {
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
