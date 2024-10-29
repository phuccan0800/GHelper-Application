// LocationContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import WebSocketService from '../services/WebSocketService';
import { isLogin } from 'react-native';
import { AuthContext } from './AuthContext';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [isOnline, setIsOnline] = useState(false);
    const [location, setLocation] = useState(null);
    const webSocketRef = useRef(null);
    const locationWatcherRef = useRef(null);

    const toggleOnlineStatus = async () => {
        setIsOnline((prevStatus) => !prevStatus);
    };

    useEffect(() => {
        const manageWebSocket = async () => {
            if (isOnline && !webSocketRef.current) {
                // Kết nối WebSocket khi online
                webSocketRef.current = new WebSocketService();
                await webSocketRef.current.connect(
                    null,
                    null,
                    (error) => {
                        Alert.alert('Lỗi kết nối', 'Mất kết nối đến máy chủ. Vui lòng thử lại.');
                        setIsOnline(false);
                    },
                    () => {
                        setIsOnline(false);
                        webSocketRef.current = null; // Đặt lại ref sau khi ngắt kết nối
                    }
                );
            } else if (!isOnline && webSocketRef.current) {
                // Đóng kết nối WebSocket khi offline
                webSocketRef.current.close();
                webSocketRef.current = null;
            }
        };

        manageWebSocket();

        return () => {
            if (webSocketRef.current) {
                webSocketRef.current.close();
                webSocketRef.current = null;
            }
        };
    }, [isOnline]);

    useEffect(() => {
        const requestLocationPermission = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            // Bắt đầu theo dõi vị trí
            locationWatcherRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest,
                    distanceInterval: 1,
                },
                (newLocation) => {
                    console.log('New location:', newLocation.coords.latitude, newLocation.coords.longitude);
                    setLocation(newLocation);

                    // Gửi vị trí qua WebSocket nếu đang online
                    if (isOnline && webSocketRef.current) {
                        webSocketRef.current.sendLocation(newLocation.coords.latitude, newLocation.coords.longitude);
                    }
                }
            );
        };

        requestLocationPermission();



        // Dọn dẹp khi component bị hủy
        return () => {
            if (locationWatcherRef.current) {
                locationWatcherRef.current.remove();
                locationWatcherRef.current = null; // Đặt lại ref sau khi ngừng theo dõi
            }
        };
    }, [isOnline]);

    return (
        <LocationContext.Provider value={{ location, isOnline, toggleOnlineStatus }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
