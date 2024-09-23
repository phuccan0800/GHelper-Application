import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.topBar, styles.area, { paddingBottom: 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.rightButtons}>
                    <TouchableOpacity style={{ marginHorizontal: 10 }} >
                        <Ionicons name="settings-outline" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <AntDesign name="questioncircleo" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={true}
            >

                <View >
                    <TouchableOpacity style={styles.myProfileButton}>
                        <View style={{
                            flexDirection: 'row',

                            margin: 10,
                        }}>
                            <Image style={styles.avatar} source={{ uri: 'https://example.com/avatar.png' }} />
                            <View style={{ marginLeft: 5 }}>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Việt Ngu</Text>
                                <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', fontSize: 18, fontWeight: 'bold' }}>
                                    <MaterialIcons name="star-rate" size={18} color="yellow" /> 1.00
                                </Text>
                            </View>
                        </View>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="white" />
                    </TouchableOpacity>

                    <ScrollView
                        style={{
                            marginBottom: 25,
                        }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        bounces={true}
                        overScrollMode="always"
                    >
                        <View style={styles.percentAcceptView}>
                            <Text style={[{ fontSize: 14, color: 'white', opacity: 0.8 }]}>Hàng ngày</Text>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: 10,
                            }}>
                                <View style={{
                                    flexDirection: 'column',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: 20
                                }}>
                                    <Text style={[{ color: 'white', fontSize: 14, fontWeight: 'bold' }]}>0.0%</Text>
                                    <Text style={[{ color: 'white', fontSize: 14, }]}>Hoàn thành</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'column',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: 20
                                }}>
                                    <Text style={[{ color: 'white', fontSize: 14, fontWeight: 'bold' }]}>0.0%</Text>
                                    <Text style={[{ color: 'white', fontSize: 14, }]}>Hủy bỏ</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ padding: 10 }}></View>
                        <View style={styles.percentAcceptView}>
                            <Text style={[{ fontSize: 14, color: 'white', opacity: 0.8 }]}>Hàng Tuần</Text>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: 10,
                            }}>
                                <View style={{
                                    flexDirection: 'column',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: 20
                                }}>
                                    <Text style={[{ color: 'white', fontSize: 14, fontWeight: 'bold' }]}>0.0%</Text>
                                    <Text style={[{ color: 'white', fontSize: 14, }]}>Hoàn thành</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'column',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: 20
                                }}>
                                    <Text style={[{ color: 'white', fontSize: 14, fontWeight: 'bold' }]}>0.0%</Text>
                                    <Text style={[{ color: 'white', fontSize: 14, }]}>Hủy bỏ</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
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
            </ScrollView >
        </SafeAreaView >
    )
}
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