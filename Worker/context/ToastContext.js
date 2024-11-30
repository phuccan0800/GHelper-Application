// ToastContext.js
import React, { createContext, useContext, useState } from 'react';
import ToastContainer, { showToast as showToastFn } from '../components/ToastContainer';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = ({ message, type }) => {
        showToastFn({ message, type });
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
};
