import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import ApiCall from '../Api/api';
import { useToast } from '../context/ToastContext';
import { AsyncStorage } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');


const ProfileScreen = ({ navigation, route }) => {
    const { workerData } = route.params;
    const showToast = useToast();
    const handleLogout = async () => {
        Alert.alert(
            'Are you sure to log out?',
            'You will be logged out of your account',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Log out',
                    onPress: async () => {
                        // Gọi hàm logout từ API
                        try {
                            const response = await ApiCall.logout();
                            if (response.status === 200) {
                                showToast({ type: 'success', message: response.data.message });
                                await AsyncStorage.clear();
                                navigation.navigate('LoginScreen');
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.topBar, styles.area, { paddingBottom: 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.rightButtons}>
                    <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={handleLogout} >
                        <MaterialCommunityIcons name="logout" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <AntDesign name="questioncircleo" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={true}>
                <View>
                    {/* Hiển thị thông tin hồ sơ cá nhân */}
                    <TouchableOpacity style={styles.myProfileButton}>
                        <View style={{ flexDirection: 'row', margin: 10 }}>
                            <Image style={styles.avatar} source={{
                                uri: workerData?.user?.avtImg
                                    ? `http://115.146.126.73:5000${workerData.user.avtImg}`
                                    : 'http://115.146.126.73:5000',
                            }} />
                            <View style={{ marginLeft: 5 }}>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                                    {workerData && workerData.user.name ? workerData.user.name : "Tên người dùng"}
                                </Text>
                                <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', fontSize: 18, fontWeight: 'bold' }}>
                                    <MaterialIcons name="star-rate" size={18} color="yellow" />
                                    {workerData && workerData.rating !== undefined && workerData.rating !== null
                                        ? workerData.rating.toFixed(2)
                                        : "N/A"}
                                </Text>
                            </View>
                        </View>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="white" />
                    </TouchableOpacity>

                    {/* Các thông tin khác của người dùng */}
                    <Text style={[styles.normalText, { fontWeight: 'bold' }]}>Tài khoản của tôi</Text>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        bounces={true}
                        overScrollMode="always"
                        style={{ marginTop: 10 }}
                    >
                        <TouchableOpacity
                            style={styles.scrollItem}
                            onPress={() => navigation.navigate('MessageScreen')}
                        >
                            <AntDesign name="message1" style={styles.scrollIcon} size={30} color="white" />
                            <Text style={styles.scrollText}>Tin nhắn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.scrollItem}>
                            <FontAwesome style={styles.scrollIcon} name="calendar" size={30} color="white" />
                            <Text style={styles.scrollText}>Lịch sử làm việc</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.scrollItem}>
                            <MaterialCommunityIcons style={styles.scrollIcon} name="lightbulb-on-outline" size={30} color="white" />
                            <Text style={styles.scrollText}>Khám phá</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.scrollItem}>
                            <FontAwesome5 style={styles.scrollIcon} name="coins" size={30} color="white" />
                            <Text style={styles.scrollText}>Thưởng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.scrollItem}>
                            <AntDesign name="questioncircleo" style={styles.scrollIcon} size={30} color="white" />
                            <Text style={styles.scrollText}>Hỗ Trợ</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#222222',
    },
    area: {
        marginHorizontal: 15,
    },
    normalText: {
        color: 'white',
        fontSize: 18,
        marginHorizontal: 15,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rightButtons: {
        flexDirection: 'row',
    },
    arrowBack: {
        position: 'absolute',
        top: 0,
        left: 0,
        padding: 10,
    },
    myProfileButton: {
        marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 10,
    },
    scrollItem: {
        marginHorizontal: 30,
        alignContent: 'center',
        alignItems: 'center',
        maxWidth: 100,
    },
    scrollIcon: {
        borderRadius: 50,
        padding: 10,

        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    scrollText: {
        marginTop: 5,
        flexDirection: 'column',
        color: 'white',
        textAlign: 'center',
        fontSize: 12,
    },

    avatar: {
        width: 60,
        height: 60,
        backgroundColor: 'gray',
        borderRadius: 65,
    },

    percentAcceptView: {
        backgroundColor: '#555555',
        flexDirection: 'clumn',
        borderRadius: 8,
        alignContent: 'center',
        alignItems: 'center',
        width: screenWidth * 0.7,
        height: 100,
        padding: 10,
    }
})
export default ProfileScreen