import React, { useState } from 'react';
import { View, TextInput, Text, Button, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { color } from 'react-native-elements/dist/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { StatusBar } from 'expo-status-bar';
import { OtpInput } from 'react-native-otp-entry'

import styles from '../styles';
import { translate } from '../../translator/translator';
import ApiCall from '../../api/ApiCall';


const ForgotPasswordScreen = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [tokenResetPassword, setTokenResetPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const navigation = useNavigation();


    const handleNext = async () => {
        setLoading(true);
        response = await ApiCall.checkEmailResetPassword(email);
        if (response.status !== 200) {
            return Alert.alert(
                translate('ForgotPasswordScreen.error_title'),
                response.message,
            );
        }
        setTokenResetPassword(response.data.token);
        setStep(2);
    };

    const handleVerifyCode = () => {
        if (!code) {
            return Alert.alert(
                translate('ForgotPasswordScreen.error_title'),
                translate('ForgotPasswordScreen.code_required'),
            );
        }
        setStep(3);
    };

    const handleResetPassword = async () => {
        setLoading(true);
        if (!newPassword) {
            return Alert.alert(
                translate('ForgotPasswordScreen.error_title'),
                translate('ForgotPasswordScreen.password_required'),
            );
        };
        if (newPassword.length < 6 || newPassword.length > 20) {
            return Alert.alert(
                translate('ForgotPasswordScreen.error_title'),
                translate('ForgotPasswordScreen.password_length'),
            );
        }

        const response = await ApiCall.confirmResetPassword({
            code: code,
            token: tokenResetPassword,
            password: newPassword,

        });
        if (response.status === 400 && response.message === 'Invalid code') {
            return Alert.alert(
                translate('ForgotPasswordScreen.error_title'),
                response.message,
                [
                    {
                        text: 'OK',
                        onPress: () => setStep(2),
                    },
                ]
            );

        }
        Alert.alert(
            translate('ForgotPasswordScreen.success_title'),
            translate('ForgotPasswordScreen.success_message'),
            [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('LoginScreen'),
                },
            ]
        );
    };

    const getBackLoginButton = () => {
        return (
            <TouchableOpacity
                style={styles.buttonTetriary}
                onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.textButtonTetriary}>
                    {translate('ForgotPasswordScreen.back_to_login')}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {step === 1 && (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input]}
                        placeholder={translate('ForgotPasswordScreen.email')}
                        onChangeText={setEmail}
                        value={email}
                        keyboardType="email-address"
                    />
                    <TouchableOpacity
                        style={[styles.buttonPrimary,]}
                        onPress={handleNext}>
                        <Text style={styles.textButtonPrimary}>{translate('ForgotPasswordScreen.next')} </Text>
                    </TouchableOpacity>
                </View>
            )}
            {step === 2 && (

                <View style={styles.inputContainer}>
                    <StatusBar hidden />
                    <Image
                        source={{ uri: 'https://static.vecteezy.com/system/resources/previews/014/905/312/non_2x/verification-code-has-been-send-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg' }}
                        resizeMode="contain"
                        style={{
                            width: 200,
                            height: 150,
                        }}
                    />

                    <Text style={{ fontSize: 18, marginVertical: 12 }}> {translate("ForgotPasswordScreen.title_enter_email_verification_code")}</Text>
                    <Text style={{ marginBottom: 20 }}>{translate("ForgotPasswordScreen.title2_enter_email_verification_code")}</Text>
                    <View style={{
                        marginVertical: 22,
                        // marginHorizontal: 10,
                        width: "85%",
                    }}>
                        <OtpInput numberOfDigits={6}
                            value={code}
                            onTextChange={setCode}
                            focusColor='primary'
                            forcusStickBlinkingDuration={400}
                            theme={{
                                pinCodeContainerStyle: {
                                    backgroundColor: 'white',
                                    width: 58,
                                    height: 58,
                                    borderRadius: 12
                                }
                            }}
                        />

                    </View>

                    <TouchableOpacity
                        style={[styles.buttonPrimary,]}
                        onTextChange={(text) => setCode(text)}
                        onPress={handleVerifyCode}>
                        <Text style={styles.textButtonPrimary}>{translate('ForgotPasswordScreen.verify')} </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <Text>{translate('ForgotPasswordScreen.not_get_code')} </Text>
                        <TouchableOpacity>
                            <Text style={[{ fontSize: 14, color: "blue", fontStyle: 'italic' }]}>Get Code</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            )}
            {step === 3 && (
                <View>

                    <TextInput
                        style={[styles.input]}
                        placeholder={translate('ForgotPasswordScreen.new_password')}
                        onChangeText={setNewPassword}
                        value={newPassword}
                        secureTextEntry
                    />
                    <Button
                        title={translate('ForgotPasswordScreen.reset')}
                        onPress={handleResetPassword}
                    />

                </View>
            )}
            {getBackLoginButton()}
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;
