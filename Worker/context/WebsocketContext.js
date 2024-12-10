import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import WebSocketService from '../services/WebSocketService';
import ApiCall from '../Api/api';

const WebsocketContext = createContext();

export const WebsocketProvider = ({ children }) => {
    const [isOnline, setIsOnline] = useState(false);
    const [location, setLocation] = useState(null);
    const [notification, setNotification] = useState(null);
    const locationWatcherRef = useRef(null);
    const addNotification = async (details) => {
        try {
            const workerStatus = (await ApiCall.getWorkerStatus()).data;
            if (workerStatus.status === 'available') {
                setNotification(details);
            } else {
                console.log('Worker is busy, ignoring new job request');
            }
        } catch (error) {
            console.error('Error in addNotification:', error);
        }
    };

    const clearNotification = () => {
        setNotification(null);
    };

    const toggleOnlineStatus = () => {
        setIsOnline((prev) => {
            WebSocketService.toggleOnlineStatus();
            return !prev;
        });
    };

    useEffect(() => {
        if (isOnline) {
            WebSocketService.connect(
                () => { },
                (data) => {
                    if (data.type === 'JOB_REQUEST' && data.jobDetails) {
                        console.log('Job details received:', data.jobDetails);
                        addNotification(data.jobDetails);
                    } else {
                        console.error('Invalid WebSocket data:', data);
                    }
                },
                (error) => console.error('WebSocket error:', error),
                () => setIsOnline(false)
            );
        } else {
            WebSocketService.close();
        }
    }, [isOnline]);


    useEffect(() => {
        const requestLocationPermission = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                locationWatcherRef.current = await Location.watchPositionAsync(
                    { accuracy: Location.Accuracy.Highest, distanceInterval: 1 },
                    (newLocation) => {
                        setLocation(newLocation);
                        if (isOnline) {
                            WebSocketService.sendLocation(newLocation.coords.latitude, newLocation.coords.longitude);
                        }
                    }
                );
            } else {
                console.error('Location permission denied');
            }
        };

        requestLocationPermission();

        return () => {
            if (locationWatcherRef.current) {
                locationWatcherRef.current.remove();
                locationWatcherRef.current = null;
            }
        };
    }, [isOnline]);

    return (
        <WebsocketContext.Provider value={{ isOnline, toggleOnlineStatus, location, notification, addNotification, clearNotification }}>
            {children}
        </WebsocketContext.Provider>
    );
};

export const useWebsocket = () => useContext(WebsocketContext);
