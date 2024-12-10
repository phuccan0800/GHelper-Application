import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useToast } from '../../context/ToastContext'
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import { Modal, RadioButton } from 'react-native-paper';
import ApiCall from '../../api/ApiCall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


const Profile = ({ route = {} }) => {
    const showToast = useToast();
    const [userData, setUserData] = useState({});
    const [selectedImage, setSelectedImage] = useState(userData?.avtImg);
    const navigation = useNavigation();
    const [name, setName] = useState(userData.name);
    const [region, setRegion] = useState(userData.region);
    const [email, setEmail] = useState(userData.email);
    const [phone, setPhone] = useState(userData.phone);
    const [gender, setGender] = useState(userData.gender);
    const [idCard, setIdCard] = useState(userData.IDCard);
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const today = new Date();
    const startDate = getFormatedDate(today.setDate(today.getDate() + 1), "DD/MM/YYYY");
    const [selectedStartDate, setSelectedStartDate] = useState(userData.birthDate ? getFormatedDate(new Date(userData.birthDate), "DD/MM/YYYY") : "01/01/1900");
    const [startedDate, setStartedDate] = useState("12/05/2003");

    const handleChangeStartDate = (date) => {
        setStartedDate(date);

    }
    useFocusEffect(
        useCallback(() => {
            const getUser = async () => {
                try {
                    const response = await ApiCall.getMe();
                    if (response.status === 200) {
                        const user = response.data;
                        setUserData(user);
                        setName(user.name);
                        setRegion(user.region);
                        setEmail(user.email);
                        setPhone(user.phone);
                        setSelectedImage(user.avtImg);
                        setGender(user.gender ? user.gender : 'male');
                        setIdCard(user.IDCard);
                        setSelectedStartDate(user.birthDate ? getFormatedDate(new Date(user.birthDate), "DD/MM/YYYY") : "01/01/1900");

                    }
                } catch (error) {
                    showToast({ message: error.message, type: 'error' });
                }
            };
            getUser();
        }, [])
    );

    const handleSaveChange = async () => {
        console.log(selectedStartDate);
        const data = {
            name: name,
            gender: gender,
            email: email,
            phone: phone,
            region: region,
            birthDate: new Date(selectedStartDate),
            IDCard: idCard
        }
        const response = await ApiCall.editProfile(data);
        if (response) {
            showToast({ message: response.message, type: 'success' });
            AsyncStorage.setItem('userData', JSON.stringify(response));
        }
    }

    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(prevState => !prevState);
    }


    const handleImageSelection = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const formData = new FormData();
                formData.append('file', {
                    uri: result.assets[0].uri,
                    type: 'image/jpeg',
                    name: 'avatar.jpg',
                });
                const response = await ApiCall.uploadNewAvatar(formData);
                if (response.status === 200) {

                    showToast({ message: response.message, type: 'success' });
                    route.params.userData.avtImg = response.link;
                    setSelectedImage(result.assets[0].uri);
                } else {
                    showToast({ message: response.message, type: 'error' });
                }
            }

        } catch (error) {
            console.error("Image selection error: ", error);
        }
    }

    function renderDatePicker() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={openStartDatePicker}
                onDismiss={() => setOpenStartDatePicker(false)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <View style={[styles.container, {
                        margin: 20,
                        backgroundColor: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        padding: 35,
                        width: '80%',
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                    }]}>
                        <DatePicker
                            mode="calendar"
                            minimumDate={startDate}
                            selected={startedDate}
                            onDateChanged={handleChangeStartDate}
                            onSelectedChange={(date) => setSelectedStartDate(date)}
                            options={{
                                backgroundColor: 'white',
                                textHeaderColor: '#000',
                                selectedTextColor: '#fff',
                                mainColor: '#1E90FF',
                                textSecondaryColor: '#000',
                                borderColor: 'rgba(122, 146, 165, 0.1)',
                            }}
                        />
                        <TouchableOpacity
                            onPress={handleOnPressStartDate}
                            style={{
                                margin: 10,
                                padding: 20,
                                backgroundColor: '#1E90FF',
                                borderRadius: 10,
                            }}
                        >
                            <Text style={{ color: 'white', height: 30 }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <SafeAreaView style={[styles.safeArea, { height: "100%" }]}>
            <View style={{
                marginHorizontal: 12,
                flexDirection: 'row',
                justifyContent: 'center',
                height: 50,
            }}>
                <TouchableOpacity
                    onPress={navigation.canGoBack() ? navigation.goBack : () => navigation.reset({
                        index: 0,
                        routes: [{ name: 'BottomNavigator' }],
                    })}
                    style={{ position: 'absolute', left: 0 }}
                >
                    <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 24 }}>Profile</Text>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { marginTop: 50 }]}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={{
                        alignItems: 'center',
                        marginVertical: 22
                    }}>
                        <TouchableOpacity
                            onPress={handleImageSelection}>
                            <Image
                                source={{ uri: selectedImage }}
                                style={{
                                    height: 130,
                                    width: 130,
                                    borderRadius: 85,
                                    borderWidth: 2,
                                    borderColor: 'white'
                                }} />
                            <View style={{
                                position: 'absolute',

                                bottom: 0,
                                right: 10,
                                borderRadius: 9999,
                                // borderShadow: 0.5,
                                // borderWidth: 1,

                                shadowColor: 'black',
                                shadowOffset: { width: 0, height: 2 },
                                zIndex: 9999
                            }}>
                                <MaterialIcons name="edit" size={30} color="black" />
                            </View>

                        </TouchableOpacity>
                    </View>
                    <View>
                        <View style={[styles.container, { flexDirection: "column" },]}>

                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                marginBottom: 6
                            }}>Name:</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={value => setName(value)}
                                    editable={true}>

                                </TextInput>
                            </View>
                            <View style={[styles.container, { flexDirection: "row", justifyContent: "space-around", alignItems: "center", width: '100%' }]}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '600'
                                }}>Gender:</Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                    <RadioButton
                                        value="male"
                                        status={gender === 'male' ? 'checked' : 'unchecked'}
                                        onPress={() => setGender('male')}
                                        color="#1E90FF"
                                    />
                                    <Text style={{ fontSize: 18, marginRight: 10 }}>Male</Text>
                                    <RadioButton
                                        value="female"
                                        status={gender === 'female' ? 'checked' : 'unchecked'}
                                        onPress={() => setGender('female')}
                                        color="#1E90FF"
                                    />
                                    <Text style={{ fontSize: 18, marginRight: 10 }}>Female</Text>
                                </View>
                            </View>

                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                marginBottom: 6
                            }}>Email:</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={value => setEmail(value)}
                                    editable={true}>

                                </TextInput>
                            </View>

                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                marginBottom: 6
                            }}>Phone:</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={value => setPhone(value)}
                                    editable={true}>

                                </TextInput>
                            </View>

                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                marginBottom: 6
                            }}>Region:</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={region}
                                    onChangeText={value => setRegion(value)}
                                    editable={true}>

                                </TextInput>
                            </View>

                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                marginBottom: 6
                            }}>Date of Birth:</Text>
                            <TouchableOpacity style={styles.inputContainer}
                                onPress={handleOnPressStartDate}>
                                <Text>
                                    {selectedStartDate}
                                </Text>
                            </TouchableOpacity>



                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                marginBottom: 6
                            }}>ID Card:</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={idCard}
                                    onChangeText={value => setIdCard(value)}
                                    editable={true}
                                    keyboardType="numeric">
                                </TextInput>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleSaveChange} style={[styles.buttonPrimary, { marginTop: 40 }]}>
                        <Text style={styles.textButtonPrimary}>Save Change</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
            {renderDatePicker()}
        </SafeAreaView >
    )
}

export default Profile