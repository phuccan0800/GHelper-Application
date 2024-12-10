import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import ChooseLocation from '../components/ChooseLocation';
import CleanOption from '../components/JobOptions/CleanOption';
import RepairVehicleOption from '../components/JobOptions/RepairVehicleOption';
import ApiCall from '../api/ApiCall';
import { useWorkingContext } from '../context/WorkingContext';
import { useToast } from '../context/ToastContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';

const RentJob = ({ navigation, route }) => {
    const showToast = useToast();
    const { startSearching } = useWorkingContext();
    const [location, setLocation] = useState(route.params.location);
    const [options, setOptions] = useState({});
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);


    const fetchPaymentMethods = async () => {
        const response = await ApiCall.getAllPaymentMethods();
        response.forEach((method) => {
            if (method.isDefault) {
                setSelectedPaymentMethod(method);
            }
        });
    };

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
        navigation.goBack();
    };

    const handleLocationSelect = (loc) => {
        setLocation(loc);
        fetchPaymentMethods();
    };

    const handleOptionChange = async (newOptions) => {
        setOptions(prevOptions => ({ ...prevOptions, ...newOptions }));
        const response = await ApiCall.checkJobPrice(route.params.job.id, newOptions);
        if (response.status === 200) {
            console.log(response.data);
            setTotalPrice(response.data.realPrice);
        } else {
            console.log(response.status);
            showToast({ message: response.message, type: 'error' });
        }
    };

    const handleContinue = () => {
        Alert.alert(
            'Confirm Booking',
            `Are you sure you want to confirm this booking for ${totalPrice.toLocaleString()} VNĐ?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            const response = await ApiCall.createTransaction({
                                amount: totalPrice, // Chuyển sang cents
                                paymentMethodId: selectedPaymentMethod.id,
                                jobId: route.params.job.id,
                                options: options,
                                address: "Vi tri booking",
                                location: {
                                    lat: location.lat,
                                    long: location.long,
                                },
                            });

                            if (response.status === 201) {
                                showToast({ message: 'Payment successful!', type: 'success' });
                                startSearching(response.data.booking_id, location);
                                navigation.navigate('Activity');
                            } else {
                                showToast({ message: response.message || 'Payment failed!', type: 'error' });
                            }
                        } catch (error) {
                            console.error('Payment error:', error);
                            showToast({ message: 'An error occurred during payment!', type: 'error' });
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>{route.params.job.title}</Text>
                <View></View>
            </View>
            <ScrollView>
                {!location ? (
                    <ChooseLocation onLocationSelect={handleLocationSelect} navigation={navigation} />
                ) : (
                    <View>
                        <View style={styles.row}>
                            <Text style={styles.normalText}>Your location:</Text>
                            <TouchableOpacity onPress={() => setLocation(null)}>
                                <Text>
                                    <FontAwesome5 name="map-marked-alt" size={18} color="black" />
                                    {` ${location.lat}, ${location.long}`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {route.params.job.id === 'cleaning' ? (
                            <CleanOption onOptionChange={handleOptionChange} defaultOption={route.params.job.options} />
                        ) : route.params.job.id === 'vehicleRepair' ? (
                            <RepairVehicleOption onOptionChange={handleOptionChange} defaultOption={route.params.job.options} />
                        ) : (
                            <Text>Default Information</Text>
                        )}
                    </View>
                )}
            </ScrollView>
            {location && (
                <View style={{
                    elevation: 1,
                    borderTopColor: 'white',
                    borderTopWidth: 3,
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    borderTopStartRadius: 2,
                    borderTopEndRadius: 2,
                    marginBottom: 20,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                        marginHorizontal: 10,
                        alignItems: 'center',
                    }}>
                        <Text style={{ fontSize: 18, marginVertical: 10 }}>Payment Method</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SelectPaymentMethod', { onSelect: handlePaymentMethodSelect })}>
                            {selectedPaymentMethod ? (
                                <Text style={{
                                    color: 'black',
                                    marginVertical: 10,
                                    fontSize: 18,
                                }}>
                                    {selectedPaymentMethod.brand.toUpperCase()} • {selectedPaymentMethod.last4}
                                    <AntDesign name="right" size={14} color="black" />
                                </Text>
                            ) : (
                                <Text style={{ color: 'blue', marginVertical: 10 }}>Add</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleContinue}>
                        <Text style={styles.buttonText}>Confirm - {totalPrice.toLocaleString()} VNĐ</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#f9f9f9', // Nền sáng nhẹ, thân thiện
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
    },
    row: {
        marginVertical: 10,
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#28a745',
        alignItems: 'center',
        marginHorizontal: 15,
        borderRadius: 8,
        padding: 15,
        marginVertical: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    paymentSection: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    paymentText: {
        fontSize: 16,
        color: '#555',
    },
    locationContainer: {
        backgroundColor: '#fff',
        padding: 15,
        marginHorizontal: 15,
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        marginVertical: 10,
    },
    normalText: {
        fontSize: 16,
        color: '#333',
    },
    iconText: {
        fontSize: 16,
        color: '#007BFF',
        marginLeft: 10,
    },
    scrollContainer: {
        marginBottom: 20,
    },
});


export default RentJob;
