// ToastContainer.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

let toastId = 0;
let setToasts; // To access setToasts from outside the component

const ToastContainer = () => {
    const [toasts, updateToasts] = useState([]);
    setToasts = updateToasts; // Save setToasts for external use

    useEffect(() => {
        const interval = setInterval(() => {
            if (toasts.length > 0) {
                removeToast(toasts[0].id);
            }
        }, 4000);
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
        // Fade in the toast
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start(() =>
            setTimeout(() => {
                // Fade out the toast after 4 seconds
                Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(onClose);
            }, 3500)
        );
    }, []);

    // Define styles and icons for different types of toasts
    const toastStyles = {
        success: { backgroundColor: '#4CAF50', icon: 'check-circle' },
        info: { backgroundColor: '#2196F3', icon: 'info' },
        warning: { backgroundColor: '#FF9800', icon: 'warning' },
        error: { backgroundColor: '#F44336', icon: 'error' },
    };

    const { backgroundColor, icon } = toastStyles[type] || toastStyles.info;

    return (
        <Animated.View style={[styles.toast, { backgroundColor, opacity: fadeAnim }]}>
            <Icon name={icon} size={24} color="#fff" style={styles.icon} />
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

// Function to show Toast from outside
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
        left: '5%',
        right: '5%',
        zIndex: 1000,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    icon: {
        marginRight: 10,
    },
    message: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ToastContainer;
