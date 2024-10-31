import { View, Text, TouchableOpacity, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useCallback } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles';
import AntDesign from '@expo/vector-icons/AntDesign';
import ApiCall from '../../api/ApiCall';
import { useFocusEffect } from '@react-navigation/native';

const PaymentSetting = ({ navigation }) => {
    const [defaultMethod, setDefaultMethod] = React.useState(null);

    useFocusEffect(
        useCallback(() => {
            async function fetchDefaultMethod() {
                const response = await ApiCall.getDefaultPaymentMethod();
                if (response.status !== 200) {
                    console.log(response.message);
                    return;
                }
                console.log(response);
                setDefaultMethod(response);
            }
            fetchDefaultMethod();
        }, [])
    );

    return (
        <SafeAreaView style={[styles.safeArea, { marginHorizontal: 10, }]}>
            <View style={{
                marginTop: 20,
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
                <Text style={styles.headerTitle}>Payment Settings</Text>
            </View>
            <View style={{ alignItems: 'flex-start' }}>
                <Text style={styles.headerContentText}>Thanh toán</Text>
                <TouchableOpacity style={{ marginTop: 20 }} onPress={
                    () => {
                        navigation.navigate('AllPaymentMethod');
                    }
                }>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%" }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <AntDesign name="creditcard" size={24} color="black" />
                            <View style={{ marginLeft: 20, flexDirection: 'column' }}>
                                <Text style={styles.normalText}>Tất cả phương thức thanh toán</Text>
                                {defaultMethod && <Text style={{ opacity: 0.5 }}> Mặc định - {defaultMethod.name}</Text> || <Text style={{ opacity: 0.5 }}> Bạn chưa thêm thẻ mặc định</Text>}
                            </View>
                        </View>
                        <MaterialIcons name="navigate-next" size={24} color="black" />
                    </View>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default PaymentSetting