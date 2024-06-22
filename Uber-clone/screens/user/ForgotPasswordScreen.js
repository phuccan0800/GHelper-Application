import React, { useState } from 'react';
import { View, TextInput, Text, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../assets/styles';
import { translate } from '../../translator/translator';

const ForgotPasswordScreen = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const navigation = useNavigation();

    const handleNext = () => {
        setLoading(true);

        if (!email) {
            return Alert.alert(
                translate('ForgotPasswordScreen.error_title'),
                translate('ForgotPasswordScreen.error_message')
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

    return (
        <View style={styles.container}>
            {step === 1 && (
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder={translate('ForgotPasswordScreen.email')}
                        onChangeText={setEmail}
                        value={email}
                        keyboardType="email-address"
                    />
                    <Button
                        title={translate('ForgotPasswordScreen.next')}
                        onPress={handleNext}
                    />
                </View>
            )}
            {step === 2 && (
                <View>
                    <TextInput
                        style={styles.input}
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
        </View>
    );
};

export default ForgotPasswordScreen;
