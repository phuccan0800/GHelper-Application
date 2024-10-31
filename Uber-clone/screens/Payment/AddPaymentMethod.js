import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

const AddPaymentMethod = ({ navigation }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleAddPaymentMethod = () => {
        // Add your payment method logic here
        console.log('Card Number:', cardNumber);
        console.log('Expiry Date:', expiryDate);
        console.log('CVV:', cvv);
        // Navigate back or to another screen
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.safeArea, { marginHorizontal: 10, }]}>
            <View style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'center',
                height: 50,
            }}>
                <TouchableOpacity
                    onPress={navigation.canGoBack() ? navigation.goBack : () => navigation.reset({
                        index: 0,
                        routes: [{ name: 'BottomNavigator' }],
                    })}
                    style={{ position: 'absolute', left: 0 }}
                >
                    <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Payment Method</Text>
            </View>
            <Text style={{
                ...styles.normalText,
                marginHorizontal: 20,
                marginTop: 20,
                marginBottom: 10,
            }}>Card Number</Text>
            <TextInput
                style={{
                    marginHorizontal: 20,
                    padding: 10,
                    borderColor: 'gray',
                    borderWidth: 1,
                    borderRadius: 5,
                }}
                placeholder="Card Number"
                value={cardNumber}
                onChangeText={setCardNumber}
            />
        </SafeAreaView>
    );
};


export default AddPaymentMethod;