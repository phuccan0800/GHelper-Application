import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    Platform,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardForm, useStripe } from '@stripe/stripe-react-native';
import styles_main from '../styles';
import { useToast } from '../../context/ToastContext';
import ApiCall from '../../api/ApiCall';

const AddPaymentMethod = ({ navigation }) => {
    const showToast = useToast();
    const { createPaymentMethod } = useStripe();
    const [cardHolderName, setCardHolderName] = useState('');
    const [isCardComplete, setIsCardComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState(null);

    const handlePaymentPress = async () => {
        try {
            if (!cardDetails?.complete || !cardHolderName.trim()) {
                showToast({ message: 'Please complete all fields', type: 'error' });
                return;
            }

            setLoading(true);

            // Create payment method with Stripe
            const { paymentMethod, error } = await createPaymentMethod({
                paymentMethodType: 'Card',
                billingDetails: {
                    name: cardHolderName.trim(),
                },
            });

            if (error) {
                console.error('Stripe error:', error);
                Alert.alert('Error', error.message);
                setLoading(false);
                return;
            }

            if (paymentMethod) {
                console.log('Payment method created:', JSON.stringify(paymentMethod, null, 2));

                // Extract card details from the payment method
                const card = paymentMethod.Card || {};

                // Prepare the data according to your backend model
                const paymentData = {
                    paymentMethodId: paymentMethod.id,
                    cardType: (card.brand || 'unknown').toLowerCase(),
                    last4Digits: card.last4 || '',
                    expiryMonth: parseInt(card.expMonth) || 0,
                    expiryYear: parseInt(card.expYear) || 0,
                    cardholderName: cardHolderName.trim(),
                    isDefault: false
                };

                console.log('Sending to backend:', JSON.stringify(paymentData, null, 2));

                try {
                    // Send to backend
                    const response = await ApiCall.addPaymentMethod(paymentData);
                    console.log('Backend response:', JSON.stringify(response, null, 2));

                    if (response.status === 201) {
                        showToast({ message: 'Card added successfully', type: 'success' });
                        navigation.goBack();
                    } else {
                        const errorMessage = response.message || 'Failed to add card';
                        console.error('Backend error:', errorMessage);
                        showToast({ message: errorMessage, type: 'error' });
                    }
                } catch (apiError) {
                    console.error('API Error:', apiError);
                    if (apiError.response) {
                        console.error('API Error Response:', JSON.stringify(apiError.response.data, null, 2));
                        console.error('API Error Status:', apiError.response.status);
                    }

                    Alert.alert(
                        'Error',
                        apiError.response?.data?.message || 'Failed to save card information'
                    );
                }
            }
        } catch (error) {
            console.error('Add card error:', error);
            Alert.alert('Error', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={navigation.canGoBack() ? navigation.goBack : () => navigation.reset({
                        index: 0,
                        routes: [{ name: 'BottomNavigator' }],
                    })}
                    style={styles.backButton}
                >
                    <MaterialIcons name="keyboard-arrow-left" size={30} color="#663399" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Payment Method</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Card Holder Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter cardholder name"
                                placeholderTextColor="#A0A0A0"
                                value={cardHolderName}
                                onChangeText={(text) => setCardHolderName(text.toUpperCase())}
                                autoCapitalize="characters"
                                editable={!loading}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Card Information</Text>
                        <View style={styles.cardFormContainer}>
                            <CardForm
                                onFormComplete={(details) => {
                                    console.log('Card details:', details);
                                    setCardDetails(details);
                                    setIsCardComplete(details.complete);
                                }}
                                cardStyle={styles.cardFormStyle}
                                style={styles.cardForm}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.addButton,
                            (!isCardComplete || !cardHolderName || loading) && styles.addButtonDisabled
                        ]}
                        onPress={handlePaymentPress}
                        disabled={!isCardComplete || !cardHolderName || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.addButtonText}>
                                {isCardComplete && cardHolderName ? 'Add Card' : 'Complete Card Details'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.securityNoteContainer}>
                        <MaterialIcons name="security" size={20} color="#666" />
                        <Text style={styles.securityNoteText}>
                            Your payment information is securely encrypted
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        paddingHorizontal: 16,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#663399',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#663399',
        marginBottom: 8,
        paddingLeft: 4,
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    input: {
        fontSize: 16,
        color: '#000000',
        height: 48,
        width: '100%',
    },
    cardFormContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    cardForm: {
        height: 200,
    },
    cardFormStyle: {
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        placeholderColor: '#A0A0A0',
        borderRadius: 12,
        borderWidth: 0,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#663399',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
        shadowColor: '#663399',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    addButtonDisabled: {
        backgroundColor: '#A0A0A0',
        shadowOpacity: 0,
        elevation: 0,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    securityNoteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    securityNoteText: {
        marginLeft: 8,
        color: '#666666',
        fontSize: 14,
    },
});

export default AddPaymentMethod;