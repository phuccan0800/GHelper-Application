import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWebsocket } from '../context/WebsocketContext';
import WebSocketService from '../services/WebSocketService';
import { navigate } from '../context/NavigationRefContext';
import LottieView from 'lottie-react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const JobNotification = () => {
    const { notification, clearNotification } = useWebsocket();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
        }
    }, [notification]);

    if (!notification || !isVisible) return null;

    const handleAccept = async () => {
        try {
            console.log('Job accepted:', notification);
            await WebSocketService.acceptJob(notification.bookingId);
            await AsyncStorage.setItem(
                'workerStatus',
                JSON.stringify({ status: 'working', bookingId: notification.bookingId })
            );
            setIsVisible(false);
            clearNotification();
            navigate('WorkingScreen', { bookingId: notification.bookingId });
        } catch (error) {
            console.error('Error accepting job:', error);
        }
    };

    const handleDecline = async () => {
        try {
            console.log('Job declined:', notification);
            await WebSocketService.declineJob(notification.bookingId);
            setIsVisible(false);
            clearNotification();
        } catch (error) {
            console.error('Error declining job:', error);
        }
    };

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={isVisible}
            onRequestClose={() => setIsVisible(false)}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <LottieView
                        source={require('../assets/new-job.json')}
                        autoPlay
                        loop={false}
                        style={styles.animation}
                    />
                    <Text style={styles.title}>New Job Request!</Text>
                    <View style={styles.detailsContainer}>
                        <FontAwesome5 name="map-marker-alt" size={16} color="#4CAF50" />
                        <Text style={styles.details}>{notification.address}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        <FontAwesome5 name="money-bill-wave" size={16} color="#FFC107" />
                        <Text style={styles.details}>
                            Earnings: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(notification.earnings)}
                        </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
                            <Text style={styles.buttonText}>Decline</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Nền tối nhẹ
    },
    modal: {
        backgroundColor: '#fff', // Màu nền modal
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 10, // Đổ bóng
    },
    animation: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
        textAlign: 'center',
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    details: {
        fontSize: 16,
        color: '#555',
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
        width: '100%',
        justifyContent: 'space-between',
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    declineButton: {
        backgroundColor: '#F44336',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default JobNotification;
