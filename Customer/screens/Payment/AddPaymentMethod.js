import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Platform, ScrollView, Image, StyleSheet, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles_main from '../styles';
import cardType from 'credit-card-type';
import { useToast } from '../../context/ToastContext';
import ApiCall from '../../api/ApiCall';

const getCardImage = (type) => {
    switch (type) {
        case 'Visa':
            return require('../../assets/visa.png');
        case 'Mastercard':
            return require('../../assets/mastercard.png');
        default:
            return null;
    }
};

const AddPaymentMethod = ({ navigation }) => {
    const showToast = useToast();
    const [cardNumber, setCardNumber] = useState('');
    const [cardTypeName, setCardTypeName] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const handleAddCard = async () => {
        Keyboard.dismiss();
        if (!cardNumber || !cardHolderName || !expiryDate) {
            showToast('All fields are required');
            return;
        }
        data = {
            cardNumber: cardNumber.replace(/\s/g, ''),
            expiryMonth: parseInt(expiryDate.split('/')[0]),
            expiryYear: parseInt(expiryDate.split('/')[1]),
            cardholderName: cardHolderName,
        }
        response = await ApiCall.addPaymentMethod(data);
        if (response.status === 201) {
            await showToast({ message: response.data.message, type: 'success' });
            navigation.goBack();
        } else {
            console.log(response.message);
            await showToast({ message: response.message, type: 'error' });
        }

    };

    const detectCardType = (number) => {
        const types = cardType(number.replace(/\s/g, ''));
        if (types.length > 0) {
            setCardTypeName(types[0].niceType);
        } else {
            setCardTypeName('');
        }
    };

    const upCaseName = (text) => {
        setCardHolderName(text.toUpperCase());
    };

    const formatCardNumber = (text) => {
        const cleaned = text.replace(/\D/g, '');
        const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(formatted);
        detectCardType(cleaned);
    };

    const formatExpiryDate = (text) => {
        let cleaned = text.replace(/\D/g, '');

        if (cleaned.length >= 2) {
            cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }

        if (cleaned.length > 5) cleaned = cleaned.slice(0, 5);
        setExpiryDate(cleaned);
    };

    const validateExpiryDate = () => {
        const [month, year] = expiryDate.split('/');
        if (month && year) {
            const currentDate = new Date();
            const inputDate = new Date(`20${year}`, month - 1);
            return inputDate >= currentDate;
        }
        return true;
    };

    return (
        <SafeAreaView style={[styles_main.safeArea, { marginHorizontal: 10 }]}>
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
                <Text style={styles_main.headerTitle}>Add Payment Method</Text>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { marginTop: 50 }]}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={styles.cardInputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Card Number"
                            value={cardNumber}
                            onChangeText={formatCardNumber}
                            keyboardType="number-pad"
                            maxLength={19}
                        />
                        <Image
                            source={cardTypeName ? getCardImage(cardTypeName) : null}
                            style={styles.cardImage}
                        />
                    </View>
                    <View style={styles.cardInputContainer}>
                        <TextInput
                            style={styles.input}
                            value={cardHolderName}
                            placeholder="Cardholder Name"
                            autoCapitalize="characters"
                            onChangeText={upCaseName}
                            keyboardType='default'
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChangeText={formatExpiryDate}
                            onBlur={() => {
                                if (!validateExpiryDate()) {
                                    alert("Expiry date is invalid.");
                                    setExpiryDate('');
                                }
                            }}
                            keyboardType="number-pad"
                            maxLength={5}
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="CVV"
                            secureTextEntry
                            keyboardType="number-pad"
                            maxLength={3}
                        />
                    </View>

                    <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
                        <Text style={styles.addButtonText}>Add Card</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f1f3f6',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '600',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    cardInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    input: {
        flex: 1,
        fontSize: 18,
        paddingVertical: 10,
        paddingHorizontal: 15,
        color: '#333',
    },
    cardImage: {
        width: 40,
        height: 25,
        marginLeft: 10,
        resizeMode: 'contain',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    halfInput: {
        width: '30%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    addButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default AddPaymentMethod;
