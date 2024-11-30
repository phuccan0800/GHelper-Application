import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiCall from '../../api/ApiCall';
import { translate } from '../../translator/translator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from '../../context/ToastContext';
import Icon from 'react-native-vector-icons/Ionicons';

const RegisterScreen = () => {
    const showToast = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [region, setRegion] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = async () => {
        if (!name) {
            showToast({ message: 'Name is required', type: 'error' });
            return;
        }
        if (!email || !validateEmail(email)) {
            showToast({ message: 'Valid email is required', type: 'error' });
            return;
        }
        if (!password || password.length < 6) {
            showToast({ message: 'Password must be at least 6 characters', type: 'error' });
            return;
        }
        if (password !== confirmPassword) {
            showToast({ message: 'Passwords do not match', type: 'error' });
            return;
        }
        if (!agreed) {
            showToast({ message: 'You must agree to the terms and policies', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const response = await ApiCall.register({
                name: name,
                email: email,
                region: region,
                password: password,
            });
            setLoading(false);
            if (response.status !== 201) {
                showToast({ message: response.message, type: 'error' });
            } else {
                navigation.navigate('LoginScreen');
                showToast({ message: translate('Register.success_message'), type: 'success' });
            }
        } catch (error) {
            setLoading(false);
            showToast({ message: error.message, type: 'error' });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Create Your Account</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Your Name"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Confirm Password"
                                secureTextEntry={!showPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Region</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Your Region"
                            value={region}
                            onChangeText={setRegion}
                        />
                    </View>
                    <View style={styles.agreementContainer}>
                        <TouchableOpacity onPress={() => setAgreed(!agreed)} style={styles.checkboxContainer}>
                            <Icon name={agreed ? 'checkbox' : 'square-outline'} size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.agreementText}>I agree to the terms and policies</Text>
                    </View>
                    <View style={styles.buttonSpacing}></View>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister}>
                            <Text style={styles.textButtonPrimary}>Register</Text>
                        </TouchableOpacity>
                    )}
                    <View style={styles.buttonSpacing}></View>
                    <TouchableOpacity style={styles.buttonTertiary} onPress={() => navigation.navigate('LoginScreen')}>
                        <Text style={styles.textButtonTertiary}>Back to Login</Text>
                    </TouchableOpacity>
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
        marginTop: 30,
        paddingHorizontal: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        color: '#333',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingRight: 10,
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    agreementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    checkboxContainer: {
        marginRight: 10,
    },
    agreementText: {
        fontSize: 14,
        color: '#555',
    },
    buttonSpacing: {
        height: 20,
    },
    buttonPrimary: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    textButtonPrimary: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonTertiary: {
        marginTop: 10,
        alignItems: 'center',
    },
    textButtonTertiary: {
        color: '#007bff',
        fontSize: 16,
    },
});

export default RegisterScreen;