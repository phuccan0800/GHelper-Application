// ToastContainer.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

let toastId = 0;
let setToasts; // Để truy cập setToasts từ bên ngoài

const ToastContainer = () => {
    const [toasts, updateToasts] = useState([]);
    setToasts = updateToasts; // Lưu setToasts để sử dụng bên ngoài

    useEffect(() => {
        const interval = setInterval(() => {
            if (toasts.length > 0) {
                removeToast(toasts[0].id);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [toasts]);

    const removeToast = (id) => {
        updateToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <View style={styles.container}>
            {toasts.map(({ id, message, type }) => (
                <Toast key={id} message={message} type={type} onClose={() => removeToast(id)} />
            ))}
        </View>
    );
};

const Toast = ({ message, type, onClose }) => {
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() =>
            setTimeout(() => {
                Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(onClose);
            }, 2000)
        );
    }, []);

    const toastStyles = {
        success: { backgroundColor: '#4CAF50', icon: '✔️' },
        info: { backgroundColor: '#2196F3', icon: 'ℹ️' },
        warning: { backgroundColor: '#FF9800', icon: '⚠️' },
        error: { backgroundColor: '#F44336', icon: '❌' },
    };

    const { backgroundColor, icon } = toastStyles[type] || toastStyles.info;

    return (
        <Animated.View style={[styles.toast, { backgroundColor, opacity: fadeAnim }]}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

// Hàm showToast để hiển thị Toast từ bên ngoài
export const showToast = ({ message, type }) => {
    toastId += 1;
    if (setToasts) {
        setToasts((prev) => [...prev, { id: toastId, message, type }]);
    }
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 80,
        left: '10%',
        right: '10%',
        zIndex: 1000,
        opacity: '0.9',

    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        padding: 10,
        marginVertical: 5
    },
    icon: {
        fontSize: 20,
        marginRight: 8,
        color: '#fff',
    },
    message: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
});

export default ToastContainer;
