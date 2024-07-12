import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { Fragment, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import ApiCall from '../api/ApiCall';
import { translate } from '../translator/translator';

const Account = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const accountItems = [
    // Uncomment these if you need these navigation items
    { icon: "person-outline", text: "Profile", onPress: () => navigation.navigate('Profile') },
    { icon: "security", text: "Security", onPress: () => navigation.navigate('Security') },
    { icon: "notifications-none", text: "Notifications", onPress: () => navigation.navigate('Notifications') },
    { icon: "lock-outline", text: "Privacy", onPress: () => navigation.navigate('Privacy') },
  ];

  const actionItems = [
    { icon: "logout", text: "Logout", onPress: () => handleLogout() },
  ];

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          console.log('User data:', JSON.parse(userData));
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      dispatch({ type: 'LOGOUT_USER' });
      const response = await ApiCall.logout();
      if (response.status !== 200) {
        return Alert.alert('Logout Fail!', response.message);
      }
      Alert.alert(
        translate('Success'),
        translate('Logout.success_message'),
      );
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Failed to logout', error);
      Alert.alert('Logout Fail!', 'An error occurred during logout.');
    }
  };

  const renderSettingsItem = (item) => (
    <TouchableOpacity
      onPress={item.onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingLeft: 12,
      }}>
      <MaterialIcons name={item.icon} size={24} color="black" />
      <Text style={{
        marginLeft: 36,
        fontSize: 16,
        fontWeight: '600',
      }}>{item.text}</Text>
    </TouchableOpacity>
  );

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
        <Text style={{ fontSize: 24 }}>Settings</Text>
      </View>
      <ScrollView style={{ marginHorizontal: 12 }}>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ marginVertical: 10 }}>Account</Text>
          <View style={{
            borderRadius: 12,
            backgroundColor: 'white',
          }}>
            {accountItems.map((item, index) => (
              <Fragment key={index}>
                {renderSettingsItem(item)}
              </Fragment>
            ))}
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ marginVertical: 10 }}>Actions</Text>
          <View style={{
            borderRadius: 12,
            backgroundColor: 'white',
          }}>
            {actionItems.map((item, index) => (
              <Fragment key={index}>
                {renderSettingsItem(item)}
              </Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Account;
