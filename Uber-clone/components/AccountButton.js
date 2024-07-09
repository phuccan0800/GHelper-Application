import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Menu, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiCall from '../api/ApiCall';
import { SafeAreaView } from 'react-native-safe-area-context';

import { translate } from '../translator/translator';

const AccountButton = () => {
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleLogout = async () => {
        closeMenu();
        dispatch({ type: 'LOGOUT_USER' });
        response = await ApiCall.logout();
        if (response.status !== 200) {
            return Alert.alert('Logout Fail !', response.message);
        }
        Alert.alert(
            translate('Success'),
            translate('Logout.success_message'),
        );
        navigation.navigate('LoginScreen');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View >
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <TouchableOpacity
                            onPress={openMenu}
                        >
                            <Image
                                source={{
                                    uri: 'https://links.papareact.com/gzs'
                                }}
                                style={styles.avatar}
                            />
                        </TouchableOpacity>
                    }
                >
                    <Menu.Item onPress={handleLogout} title={translate('Logout')} />
                </Menu>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'black'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});

export default AccountButton;
