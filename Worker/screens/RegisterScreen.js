import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, TouchableOpacity, Button, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ApiCall from '../Api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import i18n from '../translator/i18ln';
import { useToast } from '../context/ToastContext';

const RegisterScreen = ({ navigation }) => {
    const showToast = useToast();
    const [step, setStep] = useState(1);
    const [hasAccount, setHasAccount] = useState(null);
    const [isMale, setIsMale] = useState(false);
    const [isFemale, setIsFemale] = useState(false);
    const [availableJobs, setAvailableJobs] = useState([]); // State lưu danh sách công việc khả dụng
    const [selectedJobId, setSelectedJobId] = useState(''); // State lưu job_id được chọn
    const [userData, setUserData] = useState({
        name: '',
        IDCard: '',
        gender: '',
        email: '',
        phone: '',
        region: '',
    });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const totalSteps = 3;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await ApiCall.getAvailableJobs();
                if (response.status === 200) {
                    setAvailableJobs(response.data);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        if (step === 3) {
            fetchJobs(); // Lấy danh sách công việc khi bước đăng ký là 3
        }
    }, [step]);

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

    const handleMaleCheckbox = () => {
        setIsMale(!isMale);
        handleUserDataChange('gender', "male")
        if (isFemale) {
            setIsFemale(false);
        }
    };

    const handleFemaleCheckbox = () => {
        handleUserDataChange('gender', "female")
        setIsFemale(!isFemale);
        if (isMale) {
            setIsMale(false);
        }
    };

    const handleLogin = async () => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            showToast({ message: 'Email không hợp lệ', type: 'warning' });
            return;
        }
        if (password.length < 6) {
            showToast({ message: 'Email không hợp lệ', type: 'warning' });
            return;
        }

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
    };

    const handleUserDataChange = (field, value) => {
        setUserData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleWorkerRegister = async () => {
        if (!userData.name || !userData.IDCard || !userData.email || !userData.phone || !userData.region || !userData.gender || !selectedJobId) {
            showToast({ message: 'Vui lòng điền đầy đủ thông tin và chọn công việc', type: 'warning' });
            return;
        }

        const workerData = {
            ...userData,
            job_id: selectedJobId // Thêm job_id vào dữ liệu đăng ký worker
        };

        const response = await ApiCall.workerRegister(workerData);
        if (response.status === 201) {
            showToast({ message: 'Đăng ký thành công, Vui lòng đợi Admin xác nhận.', type: 'success' });
            navigation.navigate('LoginScreen');
        } else {
            console.log(response);
            showToast({ message: response.message, type: 'error' });
        }
    }

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
                            <View style={{
                                width: '100%',
                                paddingHorizontal: 20,
                                marginBottom: 20,
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingBottom: 10,
                                }}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                        color: '#333',
                                    }}>Giới tính</Text>

                                    <View style={{
                                        flexDirection: 'row', // Đặt flexDirection là 'row' để checkbox Nam và Nữ nằm trên cùng một hàng
                                        alignItems: 'center',
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginRight: 20,
                                        }}>
                                            <Checkbox
                                                value={isMale}
                                                onValueChange={handleMaleCheckbox}
                                                style={styles.checkbox}
                                            />
                                            <Text>Nam</Text>
                                        </View>

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                            <Checkbox
                                                value={isFemale}
                                                onValueChange={handleFemaleCheckbox}
                                                style={styles.checkbox}
                                            />
                                            <Text>Nữ</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputTitle}>Số CMND/CCCD</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="123456789"
                                    value={userData.IDCard}
                                    onChangeText={(text) => handleUserDataChange('IDCard', text)}
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
                                    placeholder="0987654321"
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

                            {/* Dropdown chọn công việc */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputTitle}>Chọn công việc</Text>
                                <Picker
                                    selectedValue={selectedJobId}
                                    style={styles.input}
                                    onValueChange={(itemValue) => setSelectedJobId(itemValue)}
                                >
                                    <Picker.Item label="Chọn công việc" value="" />
                                    {availableJobs.map((job) => (
                                        <Picker.Item key={job.id} label={job.title} value={job.id} />
                                    ))}
                                </Picker>
                            </View>

                            <TouchableOpacity style={styles.button} onPress={() => handleWorkerRegister()}>
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
                        <TouchableOpacity style={styles.primaryButton} onPress={prevStep}>
                            <Text style={styles.primaryButtonText}>{i18n.t('Back')}</Text>
                        </TouchableOpacity>
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
        height: "auto",
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

    primaryButton: {
        color: 'none',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        width: '80%',
        alignItems: 'center',
    },

    primaryButtonText: {
        color: '#007BFF',
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
