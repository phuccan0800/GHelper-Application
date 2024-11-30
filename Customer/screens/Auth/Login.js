import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { translate } from '../../translator/translator';
import TranslateButton from '../../components/TranslateButton';
import ApiCall from '../../api/ApiCall';
import { checkToken } from '../../utils/auth';
import Loading from '../../components/Loading';
import { useToast } from '../../context/ToastContext';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!').required('Required'),
});

const LoginScreen = ({ navigation }) => {
    const showToast = useToast();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            const userToken = await checkToken();
            if (userToken) {
                navigation.navigate('BottomNavigator');
            }
        };
        verifyToken();
    }, []);

    if (loading) {
        return (<Loading />);
    }

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const response = await ApiCall.login(values);
            setLoading(false);
            if (response.status === 200) {
                await showToast({ message: "Login Success!", type: 'success' });
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'BottomNavigator' }],
                });
            } else if (response.status === 400) {
                showToast({ message: response.message, type: 'error' });
            } else {
                showToast({ message: response.status + response.message, type: 'warning' });
            }
        } catch (error) {
            setLoading(false);
            showToast({ message: error.message, type: 'error' });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={'#f8f9fa'} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>{translate('LoginScreen.login')}</Text>
                    <TranslateButton />
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={handleLogin}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View style={styles.formContainer}>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                    />
                                    {errors.email && touched.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                                </View>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        secureTextEntry
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                    />
                                    {errors.password && touched.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                                </View>
                                <TouchableOpacity style={styles.buttonPrimary} onPress={handleSubmit}>
                                    <Text style={styles.textButtonPrimary}>{translate('LoginScreen.submit')}</Text>
                                </TouchableOpacity>
                                <View style={styles.buttonSpacing}></View>
                                <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('RegisterScreen')}>
                                    <Text style={styles.textButtonSecondary}>{translate('LoginScreen.register')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                                    <Text style={styles.forgotPassword}>{translate('LoginScreen.forgot_password')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 15,
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
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
    buttonPrimary: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    textButtonPrimary: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonSpacing: {
        height: 10,
    },
    buttonSecondary: {
        alignItems: 'center',
    },
    textButtonSecondary: {
        color: '#007bff',
        fontSize: 16,
    },
    forgotPassword: {
        color: '#007bff',
        fontSize: 16,
        marginTop: 15,
        textAlign: 'center',
    },
});

export default LoginScreen;
