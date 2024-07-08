import React, { useState } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiCall from '../../api/ApiCall';
import styles from '../../assets/styles';
import { translate } from '../../translator/translator';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterScreen = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handlePrevious = () => {
        if (step === 1) {
            return navigation.navigate('LoginScreen');
        }
        if (step === 2) {
            setStep(1);
        }
        if (step === 3) {
            setStep(2);
        }
    };

    const handleNext = () => {
        if (step === 1) {
            if (firstName === '' || lastName === '') {
                return Alert.alert(
                    translate('Error'),
                    translate('Error.all_fields_required'),
                );
            }
            setStep(2);
        }
        if (step === 2) {
            setStep(3);
        }
        if (step === 3) {
            handleRegister();
        }
    };

    const handleRegister = () => {
        setLoading(true);
        if (!firstName || !lastName || !email || !username || !city || !password) {
            setLoading(false);
            return Alert.alert(
                translate('Error'),
                translate('Error.all_fields_required'),
            );
        }
        ApiCall.register({
            firstname: firstName,
            lastname: lastName,
            email: email,
            username: username,
            city: city,
            password: password,
        }).then((response) => {
            setLoading(false);
            console.log(response.status);
            if (response.status !== 201) {
                return Alert.alert(
                    translate('Error') + response.status,
                    response.message,
                );
            }
            navigation.navigate('LoginScreen');
        });
        Alert.alert(
            translate('Success'),
            translate('Register.success_message'),
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {
                step === 1 && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"

                            value={firstName}
                            onChangeText={setFirstName}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                        />

                    </View>
                )
            }
            {
                step === 2 && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                )
            }
            {
                step === 3 && (
                    <View style={styles.inputContainer}>
                        <Text>{translate('Register.cityQuestion')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="City"
                            value={city}
                            onChangeText={setCity}
                        />
                    </View>
                )
            }
            <View style={styles.buttonSpacing}></View>
            <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleNext}>
                <Text style={styles.textButtonPrimary}>Next {step}/3</Text>
            </TouchableOpacity>
            {
                step !== 1 && (
                    <View>
                        <TouchableOpacity
                            style={styles.buttonTetriary}
                            onPress={handlePrevious}>
                            <Text>Back</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            <View style={styles.buttonSpacing}></View>
            <Button
                title="Back to Login"
                style={styles.buttonTetriary} onPress={() => navigation.navigate('LoginScreen')}>
            </Button>
        </SafeAreaView >
    );
};


export default RegisterScreen;