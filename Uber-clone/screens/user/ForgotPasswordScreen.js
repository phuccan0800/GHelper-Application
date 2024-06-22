import React, { useState } from 'react';
import { View, TextInput, Text, Button, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { color } from 'react-native-elements/dist/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import styles from '../../assets/styles';
import { translate } from '../../translator/translator';
import ApiCall from '../../api/ApiCall';


const ForgotPasswordScreen = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
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
        setStep(2);
    };

    const handleVerifyCode = () => {
        setStep(3);
    };

    const handleResetPassword = () => {
        Alert.alert(
            translate('ForgotPasswordScreen.success_title'),
            translate('ForgotPasswordScreen.success_message'),
            [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('Home'),
                },
            ]
        );
    };

    const getBackLoginButton = () => {
        return (
            <TouchableOpacity
                // style={{
                //     position: 'absolute',
                //     bottom: 50,
                //     right: 10,
                //     marginBottom: 10,
                //     marginRight: 10,
                //     borderWidth: 1,
                //     padding: 10,
                //     borderRadius: 5,
                // }}
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
                <View>
                    <TextInput
                        style={[styles.input, { fontSize: 18, width: "100%" }]}
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
                <View>
                    <TextInput
                        style={[styles.input, { fontSize: 18, }]}
                        placeholder={translate('ForgotPasswordScreen.code')}
                        onChangeText={setCode}
                        value={code}
                        keyboardType="numeric"
                    />
                    <Button
                        title={translate('ForgotPasswordScreen.verify')}
                        onPress={handleVerifyCode}
                    />
                </View>
            )}
            {step === 3 && (
                <View>
                    <TextInput
                        style={styles.input}
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
