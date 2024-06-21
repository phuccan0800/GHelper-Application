import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch } from 'react-redux';
import SuccessModal from '../../components/Modal';
import { translate, change_language } from '../../translator/translator';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!').required('Required'),
});

const LoginScreen = ({ navigation }) => {

    const [screenReload, setScreenReload] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const dispatch = useDispatch();

    const handleLanguageChange = (language) => {
        change_language();
        setScreenReload(prevState => !prevState);
    };
    const handleLogin = async (values) => {
        try {
            const response = await axios.post('http://192.168.0.33:3000/api/login', values);
            console.log('Login successful', response.data);
            dispatch({ type: 'SET_USER', payload: response.data });
            setShowSuccessModal(true);
            navigation.navigate('Home');


        } catch (error) {
            Alert.alert('Login error', 'Please try again');
            console.error('Login error', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{translate('LoginScreen.login')}</Text>
            < Button title={translate('change_language')} onPress={() => handleLanguageChange()} />
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View>
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
                        <Button onPress={handleSubmit} title="Login" />
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

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default LoginScreen;
