import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import ChooseLocation from '../components/ChooseLocation';
import CleanOption from '../components/JobOptions/CleanOption';
import RepairVehicleOption from '../components/JobOptions/RepairVehicleOption';
import ApiCall from '../api/ApiCall';
import { useToast } from '../context/ToastContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';

const RentJob = ({ navigation, route }) => {
    const showToast = useToast();
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

    const handleProceedToPayment = () => {
        if (selectedPaymentMethod) {
            navigation.navigate('SelectPaymentMethod', {
                onSelect: handlePaymentMethodSelect,
                selectedPaymentMethod
            });
        } else {
            alert('Please select a payment method');
        }
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

    const handleContinue = async () => {
        navigation.navigate('RentJobConfirm', { job: route.params.job, location, options, totalPrice });
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
                                    {selectedPaymentMethod.cardType.toUpperCase()} • {selectedPaymentMethod.last4Digits}
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
        backgroundColor: 'white',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },

    row: {
        marginVertical: 10,
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#007BFF',
        alignItems: 'center',
        marginHorizontal: 10,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RentJob;
