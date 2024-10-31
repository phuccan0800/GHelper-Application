import React, { useState } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiCall from '../../api/ApiCall';
import styles from '../styles';
import { translate } from '../../translator/translator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from '../../context/ToastContext';

const RegisterScreen = () => {
    const showToast = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [region, setRegion] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handlePrevious = () => {
        if (step === 1) {
            return navigation.navigate('LoginScreen');
        }
        if (step === 2) {
            setStep(1);
        }
        if (step === 3) {
            setStep(2);
        }
    };

    const handleNext = async () => {
        if (step === 1) {
            if (name === '') {
                return showToast({ message: 'Name is required', type: 'error' });
            }
            setStep(2);
        }
        if (step === 2) {
            setStep(3);
        }
        if (step === 3) {
            handleRegister();
        }
    };

    const handleRegister = () => {
        setLoading(true);
        if (!name || !email || !region || !password) {
            setLoading(false);
            return showToast({ message: translate('Error.all_fields_required'), type: 'error' });
        }
        ApiCall.register({
            name: name,
            email: email,
            region: region,
            password: password,
        }).then((response) => {
            setLoading(false);
            if (response.status !== 201) {
                return showToast({ message: response.message, type: 'error' });
            }
            else navigation.navigate('LoginScreen');
        });
        showToast({ message: translate('Register.success_message'), type: 'success' });
        navigation.navigate('LoginScreen');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { marginTop: 50 }]}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    {
                        step === 1 && (
                            <View style={styles.inputContainer}>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: 'normal',
                                    marginBottom: 20

                                }}>Enter your name: </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Truong Tan Phuc"

                                    value={name}
                                    onChangeText={setName}
                                />



                            </View>
                        )
                    }
                    {
                        step === 2 && (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                        )
                    }
                    {
                        step === 3 && (
                            <View style={styles.inputContainer}>
                                <Text>{translate('Register.cityQuestion')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Region"
                                    value={region}
                                    onChangeText={setRegion}
                                />
                            </View>
                        )
                    }
                    <View style={styles.buttonSpacing}></View>
                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={handleNext}>
                        <Text style={styles.textButtonPrimary}>Next {step}/3</Text>
                    </TouchableOpacity>
                    {
                        step !== 1 && (
                            <View>
                                <TouchableOpacity
                                    style={styles.buttonTetriary}
                                    onPress={handlePrevious}>
                                    <Text>Back</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                    <View style={styles.buttonSpacing}></View>
                    <Button
                        title="Back to Login"
                        style={styles.buttonTetriary} onPress={() => navigation.navigate('LoginScreen')}>
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
};


export default RegisterScreen;