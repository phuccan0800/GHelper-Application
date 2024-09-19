import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ApiCall from '../Api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
    const [step, setStep] = useState(1);
    const [hasAccount, setHasAccount] = useState(null);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        region: '',
    });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const totalSteps = 3;

    const nextStep = () => setStep((prevStep) => prevStep + 1);
    const prevStep = () => setStep((prevStep) => prevStep - 1);

    const handleAccountCheck = (answer) => {
        setHasAccount(answer);
        if (answer) {
            nextStep();
        } else {
            Alert.alert('Thông báo', 'Vui lòng đăng ký tại ứng dụng G-Helper');
        }
    };

    const handleLogin = async () => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            Alert.alert('Thông báo', 'Email không hợp lệ');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Thông báo', 'Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            const response = await ApiCall.userLogin(email, password);
            if (response.status === 200) {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const parsedData = JSON.parse(userDataString);
                    setUserData(parsedData);
                    console.log("userData", parsedData);
                    nextStep();
                }
            } else {
                Alert.alert('Thông báo', response.message);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Thông báo', 'Đã xảy ra lỗi, vui lòng thử lại.');
        }
    };

    const handleUserDataChange = (field, value) => {
        setUserData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardContainer}
                keyboardVerticalOffset={100} // Điều chỉnh khoảng cách cho bàn phím
            >
                <View style={styles.topButton}>
                    <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Đăng Ký</Text>
                    <View></View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {step === 1 && (
                        <>
                            <Text style={styles.question}>Bạn đã có tài khoản G-Helper chưa?</Text>
                            <TouchableOpacity style={styles.button} onPress={() => handleAccountCheck(true)}>
                                <Text style={styles.buttonText}>Đã có tài khoản</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => handleAccountCheck(false)}>
                                <Text style={styles.buttonText}>Chưa có tài khoản</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Text style={styles.question}>Đăng nhập tài khoản</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry
                            />
                            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                                <Text style={styles.buttonText}>Đăng nhập</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputTitle}>Họ và Tên</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Họ và Tên"
                                    value={userData.name}
                                    onChangeText={(text) => handleUserDataChange('name', text)}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputTitle}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={userData.email}
                                    onChangeText={(text) => handleUserDataChange('email', text)}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputTitle}>Số điện thoại</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Điện thoại"
                                    value={userData.phone}
                                    onChangeText={(text) => handleUserDataChange('phone', text)}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputTitle}>Vùng</Text>


                                <TextInput
                                    style={styles.input}
                                    placeholder="Vùng"
                                    value={userData.region}
                                    onChangeText={(text) => handleUserDataChange('region', text)}
                                />
                            </View>

                            <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Thông báo', 'Thông tin đã được lưu!')}>
                                <Text style={styles.buttonText}>Lưu thông tin</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Chấm bước */}
                    <View style={styles.stepsContainer}>
                        {[1, 2, 3].map((s, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.step,
                                    step > s && styles.completedStep, // Dấu tích cho bước hoàn thành
                                    step === s && styles.activeStep,  // Dài hơn và bo góc cho bước hiện tại
                                ]}
                            >
                                {step > s && (
                                    <Text>
                                        <Ionicons name="checkmark" size={16} color="white" /> {/* Dấu tích */}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>

                    {step > 1 && step <= totalSteps && (
                        <Button title="Quay lại" onPress={prevStep} />
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    question: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    inputTitle: {
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    stepsContainer: {
        flexDirection: 'row',
        position: 'absolute', // Đặt các chấm ở dưới cùng màn hình
        bottom: 30,           // Căn chỉnh khoảng cách từ dưới cùng
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    step: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'gray',
        margin: 5,
        justifyContent: 'center', // Căn giữa dấu tích
        alignItems: 'center',
    },
    activeStep: {
        width: 25,                // Làm bước hiện tại dài ra
        height: 10,
        borderRadius: 10,
        backgroundColor: 'blue',
    },
    completedStep: {
        backgroundColor: 'green', // Màu cho bước hoàn thành
    },
    topButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
});

export default RegisterScreen;
