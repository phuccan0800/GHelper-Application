import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../assets/styles';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import { Modal } from 'react-native-paper';

const Profile = () => {
    const [selectedImage, setSelectedImage] = useState('https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg');
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [region, setRegion] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const today = new Date();
    const startDate = getFormatedDate(today.setDate(today.getDate() + 1), "DD/MM/YYYY");
    const [selectedStartDate, setSelectedStartDate] = useState("01/01/1900");
    const [startedDate, setStartedDate] = useState("12/05/2003");

    const handleChangeStartDate = (date) => {
        setStartedDate(date);

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
                <TouchableOpacity
                    onPress={handleOnPressStartDate}>
                    <Text>Close</Text>
                </TouchableOpacity>
                <View
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={[styles.container, {
                        // margin: 20,
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
                            options={{
                                // backgroundColor: 'blue',
                                // textHeaderColor: '#469ab6',
                                // textDefaultColor: 'white',
                                // selectedTextColor: 'white',
                                // mainColor: '#469ab6',
                                // textSecondaryColor: 'white',
                                // borderColor: 'rgba(122, 146, 165, 0.1)',
                                canceledOnTouchOutside: true,

                            }} />

                    </View>

                </View>

            </Modal>
        )
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white',
        }}>
            <View style={{
                marginHorizontal: 12,
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                <TouchableOpacity
                    onPress={navigation.canGoBack() ? navigation.goBack : () => navigation.navigate('Home')}
                    style={{ position: 'absolute', left: 0 }}>
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
                                borderWidth: 0,
                                borderColor: 'primary'
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
                        }}>First Name:</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={firstName}
                                onChangeText={value => setFirstName(value)}
                                editable={true}>
                            </TextInput>
                        </View>

                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            marginBottom: 6
                        }}>Last Name:</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={lastName}
                                onChangeText={value => setLastName(value)}
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
                        }}>Date of Birth:</Text>
                        <TouchableOpacity style={styles.inputContainer}
                            onPress={handleOnPressStartDate}>
                            <Text>
                                {selectedStartDate}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
            {renderDatePicker()}
        </SafeAreaView>
    )
}

export default Profile