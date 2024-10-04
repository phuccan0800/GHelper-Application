import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();
import { checkToken } from '../utils/auth';

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            const userToken = await checkToken();
            console.log(userToken);
            setIsLoggedIn(!!userToken);
        };
        verifyToken();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};
