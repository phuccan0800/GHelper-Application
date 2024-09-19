import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiCall from '../Api/api';
import TranslateButton from '../components/TranslateButton';
import { LanguageContext } from '../context/LanguageContext';
import i18n from '../translator/i18ln';



const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { language } = useContext(LanguageContext);

    const handleLogin = async () => {
        console.log('Login attempted with:', email, password);
        const response = await ApiCall.loginWorker(email, password);
        if (response.status === 200) {
            try {
                const jtoken = response.data.jtoken;
                await AsyncStorage.setItem('userToken', jtoken);
                await AsyncStorage.setItem('isWorker', jtoken);
                navigation.navigate('HomeScreen');
            } catch (error) {
                console.error('Error saving token:', error);
            }
        }
    };

    const handleRegister = () => {
        navigation.navigate('RegisterScreen');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardContainer}
            >
                <View style={styles.topButton}>
                    <TranslateButton />
                </View>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.loginContainer}>
                        <Text style={styles.title}>{i18n.t('Login')}</Text>
                        <Image source={require('../assets/images/biglogo.png')} style={{
                            resizeMode: 'contain',
                            width: 400,
                            height: 200,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 5,
                            elevation: 5,
                            marginBottom: 20
                        }} />

                        <TextInput
                            style={styles.input}
                            placeholder={i18n.t('Email')}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={i18n.t('Password')}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>{i18n.t('Sign in')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.forgotPasswordContainer}>
                            <Text style={styles.forgotPasswordText}>{i18n.t('Forgot password')}</Text>
                        </TouchableOpacity>
                        <View style={{
                            flexDirection: 'row',

                        }}>
                            <Text style={{
                                fontSize: 16,
                            }}>{i18n.t("Don't have an account?")}</Text>
                            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
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
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: '100%',
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 30,
        fontFamily: 'Oswald',
        fontWeight: 'bold',
        marginBottom: 20,
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
    registerButton: {
        marginLeft: 10,
    },
    registerButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPasswordContainer: {
        padding: 10,
        marginBottom: 10,
        width: '100%',
        alignItems: 'flex-end',
    },
    forgotPasswordText: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
