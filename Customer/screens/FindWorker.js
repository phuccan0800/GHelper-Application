import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import LottieView from 'lottie-react-native';
import ApiCall from '../api/ApiCall';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useWorkingContext } from '../context/WorkingContext';


const { width, height } = Dimensions.get('window');

const FindWorker = ({ navigation }) => {
    const [searching, setSearching] = useState(true);
    const mapRef = useRef(null);
    const [workerLocation, setWorkerLocation] = useState({});
    const [workers, setWorkers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const searchInterval = 5000; // 5 giây

    const { workerState } = useWorkingContext();
    const bookingId = workerState.bookingId;
    const location = workerState.location;
    useEffect(() => {
        if (!workerState.isSearching && workerState.worker) {
            console.log('Worker found:', workerState.worker); // Debug thêm
            setWorkers([workerState.worker]);
            setSearching(false);
        } else if (!workerState.worker) {
            console.warn('Worker is null. Returning to previous screen.');
            navigation.goBack(); // Trả về nếu không có thông tin worker
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
        if (workerLocation?.lat && workerLocation?.long) {
            mapRef.current?.animateToRegion({
                latitude: workerLocation.lat,
                longitude: workerLocation.long,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000); // Chuyển mượt trong 1 giây
        }

    }, [workerLocation]);


    const handleContinueSearch = () => {
        setShowModal(false);
        setSearching(true); // Tiếp tục tìm kiếm
    };

    const handleCancelBooking = async () => {
        setShowModal(false);
        await ApiCall.refundTransaction(bookingId);
        navigation.goBack(); // Quay lại màn hình trước
    };

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

    const renderSearchingState = () => (
        <View style={styles.searchingContainer}>
            <LottieView
                source={require('../assets/loading.json')}
                autoPlay
                loop
                style={styles.loadingAnimation}
            />
            <Text style={styles.searchingText}>Searching for nearby workers...</Text>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(true)}
            >
                <Text style={styles.cancelButtonText}>Cancel Search</Text>
            </TouchableOpacity>
        </View>
    );

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

                <TouchableOpacity style={styles.contactButton}>
                    <Text style={styles.contactButtonText}>Contact Worker</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                ref={mapRef}
                initialRegion={{
                    latitude: location.lat,
                    longitude: location.long,
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

            <View style={styles.contentContainer}>
                {searching ? renderSearchingState() : workers ? renderWorkerFound() : (
                    <View style={styles.noWorkerContainer}>
                        <Text style={styles.noWorkerText}>No Workers Found</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => setSearching(true)}
                        >
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <Modal transparent={true} visible={showModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirmation</Text>
                        <Text style={styles.modalText}>
                            Do you want to continue searching or cancel the booking?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.continueButton]}
                                onPress={handleContinueSearch} // Tiếp tục tìm kiếm
                            >
                                <Text style={styles.modalButtonText}>Continue</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={handleCancelBooking} // Hủy đặt job
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
    contentContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
    searchingContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    searchingText: {
        fontSize: 16,
        color: '#333',
        marginVertical: 10,
    },
    loadingAnimation: {
        width: 100,
        height: 100,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: width * 0.8,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    continueButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: '#F44336',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    noWorkerContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
    },
    noWorkerText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
});

export default FindWorker;
