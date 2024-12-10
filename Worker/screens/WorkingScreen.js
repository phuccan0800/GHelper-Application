import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebSocketService from '../services/WebSocketService';
import { useWebsocket } from '../context/WebsocketContext'; // Import useWebsocket
import { navigate } from '../context/NavigationRefContext'

const WorkingScreen = ({ route, navigation }) => {
    const [bookingId, setBookingId] = useState(null);
    const { isOnline, toggleOnlineStatus } = useWebsocket();
    useEffect(() => {
        const getBookingId = async () => {
            const workerStatus = await AsyncStorage.getItem('workerStatus');
            setBookingId(JSON.parse(workerStatus).bookingId);
        };
        getBookingId();
    }, []);
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => true
        );

        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
        });

        return () => {
            backHandler.remove();
            unsubscribe();
        };
    }, [navigation]);

    useEffect(() => {
        // Kiểm tra trạng thái worker
        const checkStatus = async () => {
            const workerStatus = await AsyncStorage.getItem('workerStatus');
            if (!workerStatus) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeScreen' }],
                });
            }
        };

        // Bật WebSocket nếu offline
        const ensureOnline = () => {
            if (!isOnline) {
                console.log('WebSocket is offline. Setting online...');
                toggleOnlineStatus();
            } else {
                console.log('WebSocket is online.');
            }
        };

        // Chỉ gọi nếu trạng thái thay đổi
        if (!isOnline) {
            ensureOnline();
        }

        checkStatus();
    }, [isOnline, toggleOnlineStatus, navigation]);


    const handleComplete = async () => {
        try {
            console.log('Job completed:', bookingId);
            await WebSocketService.completeJob(bookingId);
            await AsyncStorage.setItem('workerStatus', JSON.stringify({ status: 'available', bookingId: null }));
            navigate('HomeScreen');
        } catch (error) {
            console.error('Error completing job:', error);
        }
    };

    if (!bookingId) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Error: Missing booking information</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Working on Booking ID: {bookingId}</Text>
            <Button title="Complete Job" onPress={handleComplete} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    error: {
        fontSize: 18,
        color: 'red',
    },
});

export default WorkingScreen;
