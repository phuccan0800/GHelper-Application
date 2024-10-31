import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from '../styles';
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
        try {
            const response = await ApiCall.login(values);
            if (response.status === 200) {
                await showToast({ message: "Login Success !", type: 'success' });
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'BottomNavigator' }],
                })
            }
            else if (response.status === 400) {
                showToast({ message: response.message, type: 'error' });
            }
            else {
                showToast({ message: response.status + response.message, type: 'warning' });
            }

        } catch (error) {
            showToast({ message: error.message, type: 'error' });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={'gray'} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { marginTop: 50 }]}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>{translate('LoginScreen.login')}</Text>
                    <TranslateButton />
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={handleLogin}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                />
                                {errors.email && touched.email ? <Text style={styles.error}>{errors.email}</Text> : null}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    secureTextEntry
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                />
                                {errors.password && touched.password ? <Text style={styles.error}>{errors.password}</Text> : null}
                                <TouchableOpacity style={styles.buttonPrimary} onPress={handleSubmit}>
                                    <Text style={styles.textButtonPrimary}>{translate('LoginScreen.submit')}</Text>
                                </TouchableOpacity>
                                <View style={styles.buttonSpacing}></View>
                                <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                                    <Text>{translate('LoginScreen.register')}</Text>
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


export default LoginScreen;
