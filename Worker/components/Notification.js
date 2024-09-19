import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Notification = ({ type, message }) => {
    const getNotificationStyle = () => {
        switch (type) {
            case 'success':
                return styles.success;
            case 'error':
                return styles.error;
            default:
                return styles.info;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'checkmark-circle';
            case 'error':
                return 'alert-circle';
            default:
                return 'information-circle';
        }
    };

    return (
        <View style={[styles.container, getNotificationStyle()]}>
            <Icon name={getIcon()} size={24} color="white" style={styles.icon} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    success: {
        backgroundColor: '#4CAF50',
    },
    error: {
        backgroundColor: '#F44336',
    },
    info: {
        backgroundColor: '#2196F3',
    },
    icon: {
        marginRight: 10,
    },
    message: {
        color: 'white',
        fontSize: 16,
    },
});

export default Notification;
