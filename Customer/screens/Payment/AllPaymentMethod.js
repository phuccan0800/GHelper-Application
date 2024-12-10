import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import styles from '../styles'
import Feather from '@expo/vector-icons/Feather';
import ApiCall from '../../api/ApiCall';
import Ionicons from '@expo/vector-icons/Ionicons';



const AllPaymentMethod = ({ navigation }) => {
    const [paymentMethods, setPaymentMethods] = React.useState([]);
    useFocusEffect(
        useCallback(() => {
            async function fetchPaymentMethods() {

                const response = await ApiCall.getAllPaymentMethods();
                if (response.status !== 200 && response.message === "User or Stripe customer not found") {
                    Alert.alert('Warning', 'Please add a payment method to continue');
                    navigation.navigate('AddPaymentMethod');
                    return;
                }

                setPaymentMethods(response);

            }
            fetchPaymentMethods();
        }, [])
    )

    return (
        <SafeAreaView style={[styles.safeArea, { marginHorizontal: 20, }]}>
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
                <Text style={{ fontSize: 20, fontStyle: 'normal', fontWeight: '500' }}>All Payment Methods</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{
                    fontSize: 14,
                    color: 'gray',
                    fontWeight: '600',
                }}>Payment Methods</Text>
                {paymentMethods.length > 0 ? paymentMethods.map((method, index) => (
                    <TouchableOpacity onPress={() => { navigation.navigate('PaymentMethodInformation', method.id) }} key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: '#CCCCCC' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="card" size={24} color="blue" />
                            <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                                <Text style={styles.normalText}>
                                    {method.brand.toUpperCase()} • {method.last4}
                                    {method.isDefault === true && <Text style={{ color: 'gray', fontStyle: 'italic', fontWeight: '600', fontSize: 14 }}>   Default</Text>}
                                </Text>
                            </View>
                        </View>
                        <Feather name="chevron-right" size={24} color="black" />
                    </TouchableOpacity>
                )) : <Text style={{ marginVertical: 20, textAlign: 'center', fontStyle: 'italic', }}>No Payment Method Found</Text>}
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{
                    fontSize: 14,
                    color: 'gray',
                    fontWeight: '600',
                }}>Add Payment Method</Text>
                <TouchableOpacity style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, }} onPress={() => navigation.navigate('AddPaymentMethod')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="card" size={24} color="blue" />
                        <View style={{ marginLeft: 20, flexDirection: 'column' }}>
                            <Text style={styles.normalText}> Cards</Text>

                        </View>
                    </View>

                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default AllPaymentMethod