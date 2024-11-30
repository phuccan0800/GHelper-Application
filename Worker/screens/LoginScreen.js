import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiCall from '../Api/api';
import TranslateButton from '../components/TranslateButton';
import { LanguageContext } from '../context/LanguageContext';
import i18n from '../translator/i18ln';

import { useToast } from '../context/ToastContext'

const LoginScreen = ({ navigation }) => {
    const showToast = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { language } = useContext(LanguageContext);
    const [showPassword, setShowPassword] = useState(false);
    const handleLogin = async () => {
        const response = await ApiCall.loginWorker(email, password);
        if (response.status === 200) {
            await AsyncStorage.setItem('userToken', response.data.token);
            const user = await ApiCall.getWorkerData();
            await AsyncStorage.setItem('userData', JSON.stringify(user.data));
            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });
        } else {
            showToast({ message: response.message, type: 'error' });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardContainer}>
                <View style={styles.topButton}>
                    <TranslateButton />
                </View>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.loginContainer}>
                        <Text style={styles.title}>{i18n.t('Login')}</Text>
                        <Image source={require('../assets/images/biglogo.png')} style={styles.logo} />

                        <TextInput
                            style={styles.input}
                            placeholder={i18n.t('Email')}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder={i18n.t('Password')}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
                                <Text>{showPassword ? '🙈' : '👁️'}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>{i18n.t('Sign in')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.forgotPasswordContainer}>
                            <Text style={styles.forgotPasswordText}>{i18n.t('Forgot password')}</Text>
                        </TouchableOpacity>

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerPrompt}>{i18n.t("Don't have an account?")}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                                <Text style={styles.registerButtonText}>{i18n.t('Register')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginContainer: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 30,
        fontFamily: 'Oswald',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    logo: {
        resizeMode: 'contain',
        width: 400,
        height: 200,
        marginBottom: 20,
        elevation: 5,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
    passwordInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    icon: {
        padding: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPasswordContainer: {
        padding: 10,
        alignItems: 'flex-end',
    },
    forgotPasswordText: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    registerPrompt: {
        fontSize: 16,
    },
    registerButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default LoginScreen;
