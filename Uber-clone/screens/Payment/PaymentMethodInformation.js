import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useToast } from '../../context/ToastContext';
import { useRoute } from '@react-navigation/native';
import styles from '../styles';
import Feather from '@expo/vector-icons/Feather';
import ApiCall from '../../api/ApiCall';

const PaymentMethodInformation = ({ navigation }) => {
    const route = useRoute();
    const showToast = useToast();
    const paymentMethodId = route.params;

    const [paymentMethod, setPaymentMethod] = useState(null);
    useFocusEffect(
        useCallback(() => {
            async function fetchPaymentMethod() {
                const response = await ApiCall.getPaymentMethodById(paymentMethodId);
                setPaymentMethod(response);
            }
            fetchPaymentMethod();
        }, [paymentMethodId])
    );
    if (!paymentMethod) {
        return (
            <SafeAreaView style={[styles.safeArea, { marginHorizontal: 20 }]}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { marginHorizontal: 20 }]}>
            <View style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'center',
                height: 50,
            }}>
                <TouchableOpacity
                    onPress={navigation.canGoBack() ? navigation.goBack : () => navigation.canGoBack()}
                    style={{ position: 'absolute', left: 0 }}
                >
                    <Feather name="x" size={25} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontStyle: 'normal', fontWeight: '500' }}>Payment Method Information</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{
                    fontSize: 14,
                    color: 'gray',
                    fontWeight: '600',
                }}>Card Type - <Text style={styles.normalText}>{paymentMethod.cardType}</Text></Text>

            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{
                    fontSize: 14,
                    color: 'gray',
                    fontWeight: '600',
                }}>Card Number - **** **** **** <Text style={styles.normalText}>{paymentMethod.last4Digits}</Text></Text>

            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{
                    fontSize: 14,
                    color: 'gray',
                    fontWeight: '600',
                }}>Set as Default</Text>
                <Switch
                    value={paymentMethod.isDefault}
                    onChange={async () => {
                        const response = await ApiCall.setIsDefault(paymentMethodId);
                        if (response && response.status === 200) {
                            paymentMethod.isDefault = true;
                            showToast({ type: 'success', message: response.data.message });
                            navigation.goBack();

                        } else {
                            showToast({ type: 'error', message: 'Failed to update default payment method' });
                        }
                    }
                    }
                />
            </View>
            <View style={{ marginTop: 20 }}>
                {paymentMethod.isDefault === true ?
                    <Text style={{ color: 'gray', alignContent: 'center', alignSelf: 'center', fontStyle: 'italic', fontWeight: '600', fontSize: 14 }}>This is your default payment method</Text>
                    :
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'red',
                            padding: 10,
                            borderRadius: 5,
                            alignItems: 'center',
                        }}
                        onPress={async () => {
                            const response = await ApiCall.deletePaymentMethod(paymentMethodId);
                            if (response && response.status === 200) {
                                showToast({ type: 'success', message: response.data.message });
                                navigation.goBack();
                            } else {
                                showToast({ type: 'error', message: 'Failed to delete payment method' });
                            }
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: '600' }}>Delete Payment Method</Text>
                    </TouchableOpacity>}
            </View>
        </SafeAreaView>
    );
}

export default PaymentMethodInformation;