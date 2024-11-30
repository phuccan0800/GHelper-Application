import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiCall from '../Api/api';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                let check;
                try {
                    check = await ApiCall.getWorkerData();
                    await AsyncStorage.setItem('userData', JSON.stringify(check.data));
                    console.log("User data: ", check.data);

                } catch (e) {
                    check = false;
                }
                console.log(token, check.data);
                if (token && check.data) {
                    setIsLoggedIn(true);
                } else {
                    await AsyncStorage.removeItem('userToken');
                    setIsLoggedIn(false);
                }
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        checkLoginStatus();
    }, []);


    return (
        <AuthContext.Provider value={{ isLoggedIn, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
