import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import { Modal } from 'react-native-paper';
import ApiCall from '../../api/ApiCall';

const Profile = ({ route }) => {
    userData = route.params.userData;
    const [selectedImage, setSelectedImage] = useState(userData.avtImg);
    const navigation = useNavigation();
    const [name, setName] = useState(userData.name);
    const [region, setRegion] = useState('');
    const [email, setEmail] = useState(userData.email);
    const [phone, setPhone] = useState('');

    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const today = new Date();
    const startDate = getFormatedDate(today.setDate(today.getDate() + 1), "DD/MM/YYYY");
    const [selectedStartDate, setSelectedStartDate] = useState("01/01/1900");
    const [startedDate, setStartedDate] = useState("12/05/2003");

    const handleChangeStartDate = (date) => {
        setStartedDate(date);

    }

    const handleSaveChange = async () => {
        const data = {
            name: name,
            email: email,
            phone: phone,
            region: region,
        }
        const response = await ApiCall.editProfile(data);
        console.log(response);
    }

    const handleOnPressStartDate = (date) => {
        setOpenStartDatePicker(!openStartDatePicker);
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
                formData.append('avatar', {
                    uri: result.assets[0].uri,
                    type: 'image/jpeg',
                    name: 'avatar.jpg',
                });
                const response = await ApiCall.uploadNewAvatar(formData);
                console.log(response);
                route.params.userData.avtImg = response.link;
                setSelectedImage(result.assets[0].uri);

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
            >

                <View
                    style={{
                        alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                    <View style={[styles.container, {
                        margin: 20,
                        backgroundColor: 'primary',
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
                        // elevation: 5,
                    }]}>

                        <DatePicker
                            mode="calendar"
                            minimumDate={startDate}
                            selected={startedDate}
                            onDateChanged={handleChangeStartDate}
                            onSelectedChange={(date) => setSelectedStartDate(date)}
                            canceledOnTouchOutside={() => setOpenStartDatePicker}
                            options={{
                                canceledOnTouchOutside: true,

                            }} />

                    </View>

                </View>

                <TouchableOpacity
                    onPress={handleOnPressStartDate}>
                    <Text>Close</Text>
                </TouchableOpacity>
            </Modal>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{
                marginHorizontal: 12,
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                <TouchableOpacity
                    onPress={navigation.canGoBack() ? navigation.goBack : () => navigation.navigate('Home')}
                    style={{ position: 'absolute', left: 0 }}
                >
                    <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 24 }}>Profile</Text>
            </View>
            <ScrollView>
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
                    </View>
                </View>
                <TouchableOpacity onPress={handleSaveChange} style={[styles.buttonPrimary, { marginTop: 40 }]}>
                    <Text style={styles.textButtonPrimary}>Save Change</Text>
                </TouchableOpacity>
            </ScrollView>
            {renderDatePicker()}
        </SafeAreaView>
    )
}

export default Profile