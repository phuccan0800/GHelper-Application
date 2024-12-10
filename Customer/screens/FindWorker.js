import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Dimensions, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import ApiCall from '../api/ApiCall';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useWorkingContext } from '../context/WorkingContext';

const FindWorker = ({ navigation }) => {
    const mapRef = useRef(null);
    const [workerLocation, setWorkerLocation] = useState({});
    const [workers, setWorkers] = useState([]);
    const searchInterval = 5000; // 5 giây

    const { workerState } = useWorkingContext();
    const bookingId = workerState.bookingId;
    const location = workerState.location || { lat: 0, long: 0 };
    useEffect(() => {
        const findWorker = async () => {
            try {
                const response = await ApiCall.findAndAssignWorker({ bookingId });
                if (response.status === 200 && response.data.worker) {
                    console.log('Found worker:', response.data.worker);
                    setWorkers([response.data.worker]);
                } else {
                    console.warn('No worker found. Returning to previous screen.');
                    navigation.goBack();
                }
            } catch (error) {
                console.error('Error finding worker:', error);
                navigation.goBack(); // Trả về màn hình trước khi gặp lỗi
            }
        };

        if (!workerState.isSearching && workerState.worker) {
            setWorkers([workerState.worker]);
        } else if (!workerState.worker) {
            findWorker();
        }
    }, [workerState]);

    useEffect(() => {
        let isTracking = true;

        const fetchWorkerLocation = async () => {
            while (isTracking && workers.length > 0) {
                try {
                    const response = await ApiCall.getWorkerLocation(workers[0]?.id);
                    if (response) {
                        setWorkerLocation(response);
                    }
                    workers[0].status = response.status;
                    if (response.status === 'available') {
                        console.log('Worker has completed the job.');
                        workers[0].status = 'completed';
                        break;
                    }

                    await new Promise((resolve) => setTimeout(resolve, searchInterval));
                } catch (error) {
                    console.error('Error fetching worker location:', error.message);
                }
            }
        };

        if (workers.length > 0) {
            fetchWorkerLocation();
        }

        return () => {
            isTracking = false;
        };
    }, [workers]);

    useEffect(() => {
        if (workerLocation?.lat && workerLocation?.long && mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude: workerLocation.lat,
                    longitude: workerLocation.long,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                },
                1000 // 1 giây
            );
        }
    }, [workerLocation]);


    const getStatusColor = (status) => {
        switch (status) {
            case 'going':
                return '#4CAF50';
            case 'arrived':
                return '#2196F3';
            case 'working':
                return '#FF9800';
            case 'available':
                return '#9C27B0';
            default:
                return '#666';
        }
    };

    const renderWorkerFound = () => (
        <View style={styles.workerFoundContainer}>
            <View style={styles.workerCard}>
                <View style={styles.workerHeader}>
                    <Image
                        source={{ uri: `http://115.146.126.73:5000${workers[0].avtImg}` }}
                        style={styles.workerAvatar}
                    />
                    <View style={styles.workerInfo}>
                        <Text style={styles.workerName}>{workers[0].name}</Text>
                        <View style={styles.ratingContainer}>
                            <FontAwesome5 name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{workers[0].rating}</Text>
                        </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(workers[0].status) }]}>
                        <Text style={styles.statusText}>{workers[0].status || 'Pending'}</Text>
                    </View>
                </View>

                <View style={styles.workerDetails}>
                    <View style={styles.detailItem}>
                        <MaterialIcons name="phone" size={20} color="#666" />
                        <Text style={styles.detailText}>{workers[0].phone}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialIcons name="location-on" size={20} color="#666" />
                        <Text style={styles.detailText}>{workers[0].region}</Text>
                    </View>
                </View>

                <View style={styles.actionButtons}>
                    {/* Nút mở Google Maps */}
                    <TouchableOpacity
                        style={styles.findButton}
                        onPress={() => {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${workerLocation.lat},${workerLocation.long}`;
                            Linking.openURL(url).catch(() => Alert.alert('Error', 'Cannot open Google Maps'));
                        }}
                    >
                        <MaterialIcons name="location-searching" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Find</Text>
                    </TouchableOpacity>

                    {/* Nút gọi điện */}
                    <TouchableOpacity
                        style={styles.callButton}
                        onPress={() => {
                            const phoneNumber = `tel:${workers[0].phone}`;
                            Linking.openURL(phoneNumber).catch(() => Alert.alert('Error', 'Cannot make the call'));
                        }}
                    >
                        <MaterialIcons name="phone" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Call</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                ref={mapRef}
                initialRegion={{
                    latitude: workerLocation.lat,
                    longitude: workerLocation.long,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: location.lat,
                        longitude: location.long,
                    }}
                    title="Vị trí của bạn"
                >
                    <View style={styles.markerContainer}>
                        <View style={styles.markerDot} />
                    </View>
                </Marker>

                {workerLocation && workerLocation.lat && workerLocation.long && (
                    <Marker
                        coordinate={{
                            latitude: workerLocation.lat,
                            longitude: workerLocation.long,
                        }}
                        title="Worker"
                    >
                        <View style={styles.workerMarker}>
                            <MaterialIcons name="handyman" size={15} color="#fff" />
                        </View>
                    </Marker>
                )}
            </MapView>
            {workers.length > 0 && renderWorkerFound()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    map: {
        flex: 1,
    },

    workerFoundContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    workerCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
    },
    workerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    workerAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    workerInfo: {
        flex: 1,
    },
    workerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#666',
    },
    workerDetails: {
        marginBottom: 15,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    detailText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#666',
    },
    contactButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    markerContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(33, 150, 243, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2196F3',
    },
    workerMarker: {
        backgroundColor: '#4CAF50',
        padding: 5,
        borderRadius: 20,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 'auto',
    },
    statusText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },

    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    findButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    buttonText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 10,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 25,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },


});

export default FindWorker;
