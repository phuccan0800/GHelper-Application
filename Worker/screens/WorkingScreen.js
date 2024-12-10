import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, ActivityIndicator, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebSocketService from '../services/WebSocketService';
import { useWebsocket } from '../context/WebsocketContext';
import { navigate } from '../context/NavigationRefContext';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import ApiCall from '../Api/api';
import SwipeButton from 'rn-swipe-button';


const WorkingScreen = ({ route, navigation }) => {
    const [bookingId, setBookingId] = useState(null);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isOnline, toggleOnlineStatus } = useWebsocket();

    useEffect(() => {
        const checkStatus = async () => {
            const workerStatus = await AsyncStorage.getItem('workerStatus');
            if (!workerStatus) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeScreen' }],
                });
            }
        };

        const ensureOnline = () => {
            if (!isOnline) {
                console.log('WebSocket is offline. Setting online...');
                toggleOnlineStatus();
            } else {
                console.log('WebSocket is online.');
            }
        };

        if (!isOnline) {
            ensureOnline();
        }

        checkStatus();
    }, [isOnline, toggleOnlineStatus, navigation]);

    useEffect(() => {
        const getBookingId = async () => {
            const workerStatus = await AsyncStorage.getItem('workerStatus');
            const parsedStatus = JSON.parse(workerStatus);
            setBookingId(parsedStatus?.bookingId);
            fetchBookingInfo(parsedStatus?.bookingId);
        };

        getBookingId();

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
        });

        return () => {
            backHandler.remove();
            unsubscribe();
        };
    }, [navigation]);

    const fetchBookingInfo = async (id) => {
        try {
            const response = await ApiCall.getBookingById(id);

            if (response.status === 200) {
                setBooking(response.data.booking);
            } else {
                console.error('Error fetching booking:', response.data);
            }
        } catch (error) {
            console.error('Error fetching booking:', error);
        } finally {
            setLoading(false);
        }
    };

    const openGoogleMaps = () => {
        const { lat, long } = booking.location;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;
        Linking.openURL(url).catch(() => Alert.alert('Error', 'Cannot open Google Maps'));
    };

    const callCustomer = () => {
        const phoneNumber = `tel:${booking.user_id.phone}`;
        Linking.openURL(phoneNumber).catch(() => Alert.alert('Error', 'Cannot make the call'));
    };

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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading Booking Information...</Text>
            </View>
        );
    }

    if (!booking) {
        return (
            <LinearGradient colors={['#e66465', '#9198e5']} style={styles.gradient}>
                <View style={styles.container}>
                    <Text style={styles.error}>Error: Missing booking information</Text>
                </View>
            </LinearGradient>
        );
    }

    return (

        <SafeAreaView style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: booking.location.lat,
                    longitude: booking.location.long,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}>
                <Marker
                    coordinate={{
                        latitude: booking.location.lat,
                        longitude: booking.location.long,
                    }}
                    title="Destination"
                    description={booking.address}
                />
            </MapView>
            <View style={styles.infoContainer}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Customer Information</Text>
                    <Text style={styles.cardText}>Name: {booking.user_id.name}</Text>
                    <Text style={styles.cardText}>Phone: {booking.user_id.phone}</Text>
                    <Text style={styles.cardText}>Earnings: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.transactionId.workerEarnings)}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
                        <MaterialIcons name="directions" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Open Google Maps</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.callButton} onPress={callCustomer}>
                        <FontAwesome name="phone" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Call Customer</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => {
                        Alert.alert(
                            "Booking Details",
                            `Job Type: ${booking.job_id}
Cleaning Type: ${booking.options.cleaningType}
Supplies Needed: ${booking.options.suppliesNeeded ? "Yes" : "No"}
Number of Workers: ${booking.options.numberOfWorkers}
Number of Rooms: ${booking.options.numberOfRooms}
Total Price: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.options.price)}
Earnings: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.transactionId.workerEarnings)}`,
                            [{ text: "OK" }]
                        );
                    }}>
                    <Text style={styles.detailsButtonText}>View Booking Details</Text>
                </TouchableOpacity>

                <SwipeButton
                    width="90%"
                    height={60}
                    thumbIconBackgroundColor="#4CAF50"
                    thumbIconBorderColor="#388E3C"
                    thumbIconStyles={{
                        borderRadius: 30,
                        borderWidth: 2,
                        borderColor: "#ffffff",
                    }}
                    railBackgroundColor="#e0e0e0"
                    railFillBackgroundColor="#4CAF50"
                    railFillBorderColor="#388E3C"
                    railStyles={{
                        borderRadius: 30,
                        borderWidth: 2,
                        borderColor: "#cccccc",
                    }}
                    title="Swipe to Complete Job"
                    titleStyles={{
                        fontSize: 16,
                        color: "#555",
                        fontWeight: "bold",
                    }}
                    titleColor="#555"
                    thumbIconComponent={() => (
                        <MaterialIcons name="done" size={28} color="#ffffff" />
                    )}
                    shouldResetAfterSuccess={true} // Nút quay lại vị trí ban đầu sau khi thành công
                    disabled={false} // Đảm bảo nút không bị vô hiệu hóa
                    onSwipeSuccess={handleComplete} // Kích hoạt khi trượt thành công
                />

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    infoContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    card: {
        width: '90%',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    mapButton: {
        flexDirection: 'row',
        backgroundColor: '#0072ff',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    callButton: {
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
    completeButton: {
        backgroundColor: '#F44336',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    completeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    error: {
        fontSize: 18,
        color: 'red',
    },
    detailsButton: {
        marginTop: 15,
        backgroundColor: "#0072ff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
    },
    detailsButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

});

export default WorkingScreen;