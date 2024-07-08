import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../../assets/styles';
import SuccessModal from '../../components/Modal';
import { translate, change_language } from '../../translator/translator';
import { checkToken } from '../../utils/auth';
import ApiCall from '../../api/ApiCall';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!').required('Required'),
});

const LoginScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const [screenReload, setScreenReload] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(true);


    const handleLanguageChange = () => {
        change_language();
        setScreenReload(prevState => !prevState);
    };
    const handleLogin = async (values) => {
        try {
            const response = await ApiCall.login(values);
            if (response.status === 200) {
                dispatch({ type: 'SET_USER', payload: response.data });
                setShowSuccessModal(true);
                navigation.navigate('Home');
            }
            else if (response.status === 400) {
                return Alert.alert('Login Fail !', translate('LoginScreen.invalid_credentials'));
            }
            else {
                return Alert.alert('Login Fail !', response.message);
            }

        } catch (error) {
            console.log(error.response);

            Alert.alert('Login error', error.response.data.message);
        }
    };

    // check user login
    useEffect(() => {
        const veriryToken = async () => {
            const token = await checkToken();
            if (token) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            }
            setLoading(false);
        };
        veriryToken();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{translate('LoginScreen.login')}</Text>
            <TouchableOpacity style={styles.change_language} onPress={handleLanguageChange}>
                <Text style={styles.change_language_text}>{translate('change_language')}</Text>
            </TouchableOpacity>
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

            <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onNavigate={() => navigation.navigate('Home')}
            />
        </View>
    );
};


export default LoginScreen;
