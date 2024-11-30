import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkToken } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const userToken = await checkToken();
            console.log(userToken);
            setIsLoggedIn(!!userToken);
            setLoading(false);
        };
        verifyToken();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
