import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native';
import ApiCall from '../api/ApiCall'; // Adjust the import path as necessary
import { Ionicons } from '@expo/vector-icons';
import style_main from './styles';

const RenJobConfirm = ({ navigation, route }) => {
    const { job, location, options, totalPrice } = route.params;
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    useEffect(() => {
        async function fetchPaymentMethods() {
            const response = await ApiCall.getAllPaymentMethods();
            setPaymentMethods(response);
        }
        fetchPaymentMethods();
    }, []);

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
    };

    const handleProceedToPayment = () => {
        if (selectedPaymentMethod) {
            navigation.navigate('Payment', { selectedPaymentMethod });
        } else {
            alert('Please select a payment method');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#007BFF" />
                </TouchableOpacity>
                <Text style={styles.title}>{route.params.job.title}</Text>
                <View></View>
            </View>
            <View style={styles.card}>
                <View style={styles.section}>
                    <Text style={styles.label}>Job:</Text>
                    <Text style={styles.value}>{job.title}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Location:</Text>
                    <Text style={styles.value}>{`${location.lat}, ${location.long}`}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Options:</Text>
                    <Text style={styles.value}>{JSON.stringify(options)}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Total Price:</Text>
                    <Text style={styles.value}>{totalPrice.toLocaleString()} VNĐ</Text>
                </View>
            </View>
            <Text style={[styles.label, { marginHorizontal: 10 }]}>Select Payment Method:</Text>
            <FlatList
                data={paymentMethods}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.paymentMethodsContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.paymentMethod,
                            selectedPaymentMethod?.id === item.id && styles.selectedPaymentMethod,
                        ]}
                        onPress={() => handlePaymentMethodSelect(item)}
                    >
                        <Text style={styles.paymentMethodText}>
                            {item.cardType.toUpperCase()} • {item.last4Digits}
                            {item.isDefault && <Text style={styles.defaultText}>   Default</Text>}
                        </Text>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity style={styles.button} onPress={handleProceedToPayment}>
                <Text style={styles.buttonText}>Proceed to Payment</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    ...style_main,
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#F8F8F8',
    },
    topBar: {
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 15,
        color: '#007BFF',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 10,
        marginBottom: 15,
        elevation: 2,
    },
    section: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444444',
    },
    value: {
        fontSize: 16,
        color: '#666666',
    },
    paymentMethodsContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    paymentMethod: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    selectedPaymentMethod: {
        borderColor: '#007BFF',
        backgroundColor: '#E7F1FF',
    },
    paymentMethodText: {
        fontSize: 16,
        color: '#333333',
    },
    defaultText: {
        color: 'gray',
        fontStyle: 'italic',
        fontWeight: '600',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 10,
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RenJobConfirm;
