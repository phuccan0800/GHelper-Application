import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '../../context/ToastContext';
import { StatusBar } from 'expo-status-bar';
import { OtpInput } from 'react-native-otp-entry';
import { translate } from '../../translator/translator';
import ApiCall from '../../api/ApiCall';

const ForgotPasswordScreen = () => {
    const showToast = useToast();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [tokenResetPassword, setTokenResetPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const navigation = useNavigation();

    const handleNext = async () => {
        setLoading(true);
        try {
            const response = await ApiCall.checkEmailResetPassword(email);
            setLoading(false);
            if (response.status !== 200) {
                return showToast({ message: response.message, type: 'error' });
            }
            setTokenResetPassword(response.data.token);
            setStep(2);
        } catch (error) {
            setLoading(false);
            showToast({ message: error.message, type: 'error' });
        }
    };

    const handleVerifyCode = () => {
        if (!code) {
            return showToast({ message: translate('ForgotPasswordScreen.code_required'), type: 'error' });
        }
        setStep(3);
    };

    const handleResetPassword = async () => {
        setLoading(true);
        if (!newPassword) {
            setLoading(false);
            showToast({ message: translate('ForgotPasswordScreen.password_required'), type: 'error' });
        }
        if (newPassword.length < 6 || newPassword.length > 20) {
            setLoading(false);
            showToast({ message: translate('ForgotPasswordScreen.password_length'), type: 'error' });
        }

        try {
            const response = await ApiCall.confirmResetPassword({
                code: code,
                token: tokenResetPassword,
                password: newPassword,
            });
            setLoading(false);
            if (response.status !== 200) {
                return showToast({ message: response.message, type: 'error' });
                setStep(2);
            }
            showToast({ message: response.data.message, type: 'success' });
            navigation.navigate('LoginScreen');
        } catch (error) {
            setLoading(false);
            showToast({ message: error.message, type: 'error' });
        }
    };

    const getBackLoginButton = () => (
        <TouchableOpacity
            style={styles.buttonTertiary}
            onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.textButtonTertiary}>
                {translate('ForgotPasswordScreen.back_to_login')}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    {step === 1 && (
                        <View style={styles.inputContainer}>
                            <Text style={styles.title}>What is your email?</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={translate('ForgotPasswordScreen.email')}
                                onChangeText={setEmail}
                                value={email}
                                keyboardType="email-address"
                            />
                            <TouchableOpacity
                                style={styles.buttonPrimary}
                                onPress={handleNext}>
                                <Text style={styles.textButtonPrimary}>{translate('ForgotPasswordScreen.next')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {step === 2 && (
                        <View style={styles.inputContainer}>
                            <StatusBar hidden />
                            <Image
                                source={{ uri: 'https://static.vecteezy.com/system/resources/previews/014/905/312/non_2x/verification-code-has-been-send-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg' }}
                                resizeMode="contain"
                                style={styles.verificationImageCentered}
                            />
                            <Text style={styles.verificationTitle}>{translate("ForgotPasswordScreen.title_enter_email_verification_code")}</Text>
                            <Text style={styles.verificationSubtitle}>{translate("ForgotPasswordScreen.title2_enter_email_verification_code")}</Text>
                            <View style={styles.otpContainer}>
                                <OtpInput
                                    numberOfDigits={6}
                                    value={code}
                                    onTextChange={setCode}
                                    focusColor='primary'
                                    forcusStickBlinkingDuration={400}
                                    theme={{
                                        pinCodeContainerStyle: {
                                            backgroundColor: 'transparent',
                                            width: 58,
                                            height: 58,
                                            borderRadius: 12,
                                        },
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.buttonPrimary}
                                onPress={handleVerifyCode}>
                                <Text style={styles.textButtonPrimary}>{translate('ForgotPasswordScreen.verify')}</Text>
                            </TouchableOpacity>
                            <View style={styles.resendCodeContainer}>
                                <Text>{translate('ForgotPasswordScreen.not_get_code')} </Text>
                                <TouchableOpacity>
                                    <Text style={styles.resendCodeText}>Get Code</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {step === 3 && (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={translate('ForgotPasswordScreen.new_password')}
                                onChangeText={setNewPassword}
                                value={newPassword}
                                secureTextEntry
                            />
                            <TouchableOpacity
                                style={styles.buttonPrimary}
                                onPress={handleResetPassword}>
                                <Text style={styles.textButtonPrimary}>{translate('ForgotPasswordScreen.reset')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {getBackLoginButton()}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardView: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        color: '#333',
        marginBottom: 15,
    },
    buttonPrimary: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    textButtonPrimary: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonTertiary: {
        marginTop: 20,
        alignItems: 'center',
    },
    textButtonTertiary: {
        color: '#007bff',
        fontSize: 16,
    },
    verificationImageCentered: {
        width: 200,
        height: 150,
        alignSelf: 'center',
    },
    verificationTitle: {
        fontSize: 18,
        marginVertical: 12,
        textAlign: 'center',
    },
    verificationSubtitle: {
        marginBottom: 20,
        textAlign: 'center',
    },
    otpContainer: {
        marginVertical: 22,
        width: "85%",
        alignSelf: 'center',
    },
    resendCodeContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
    },
    resendCodeText: {
        fontSize: 14,
        color: "blue",
        fontStyle: 'italic',
    },
});

export default ForgotPasswordScreen;