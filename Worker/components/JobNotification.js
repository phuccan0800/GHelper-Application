import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
            setIsVisible(true); // Hiển thị modal khi nhận được thông báo
        }
    }, [notification]);

    if (!notification || !isVisible) return null; // Không hiển thị nếu không có thông báo hoặc modal đã ẩn

    const handleAccept = async () => {
        try {
            console.log('Job accepted:', notification);
            await WebSocketService.acceptJob(notification.bookingId);
            await AsyncStorage.setItem(
                'workerStatus',
                JSON.stringify({ status: 'working', bookingId: notification.bookingId })
            );
            setIsVisible(false); // Ẩn modal trước khi chuyển hướng
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
            setIsVisible(false); // Ẩn modal khi từ chối job
            clearNotification();
        } catch (error) {
            console.error('Error declining job:', error);
        }
    };

    console.log('notification:', notification);

    return (
        <View style={styles.container}>
            <View style={styles.modal}>
                <LottieView
                    source={require('../assets/new-job.json')} // Đường dẫn tới tệp Lottie JSON
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Đặt modal ở giữa theo chiều dọc
        alignItems: 'center', // Căn giữa theo chiều ngang
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ xung quanh modal
    },
    modal: {
        backgroundColor: 'transparent', // Làm nền trong suốt
        padding: 20,
        alignItems: 'center',
    },
    animation: {
        width: 150,
        height: 150,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff', // Chuyển chữ sang màu trắng để nổi bật trên nền tối
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
        color: '#fff', // Chuyển chữ sang màu trắng để nổi bật trên nền tối
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
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    declineButton: {
        backgroundColor: '#F44336',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
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
