import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { Fragment, useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import ApiCall from '../api/ApiCall';
import { translate } from '../translator/translator';
import styles from './styles';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Account = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const accountItems = [
    // Uncomment these if you need these navigation items
    { icon: "person-outline", text: translate('Profile'), onPress: () => navigation.navigate('Profile', { userData: user }) },
    { icon: "security", text: translate('Security'), onPress: () => navigation.navigate('Security') },
    { icon: "lock-outline", text: translate("Privacy"), onPress: () => navigation.navigate('Privacy') },
  ];

  const actionItems = [
    { icon: "logout", text: translate("Logout"), onPress: () => handleLogout() },
  ];

  useFocusEffect(
    useCallback(() => {
      const getUser = async () => {
        const userData = AsyncStorage.getItem('userData');
        setUser(userData);
      };

      const checkNetworkAndFetchUserData = async () => {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
          const userData = await ApiCall.getMe();
          setUser(userData);
        } else {
          console.log('No network connection');
          await getUser();
        }
      };

      checkNetworkAndFetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    try {
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={'gray'} />
      <View style={{
        // marginHorizontal: 12,
        // flexDirection: 'row',
        justifyContent: 'center',
        width: "100%",
      }}>
        <Image
          source={{ uri: 'https://media.sproutsocial.com/uploads/1c_facebook-cover-photo_clean@2x.png' }}
          resizeMode='cover'
          style={{
            height: 220,
            width: "100%",
          }}
        />
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image source={{ uri: user?.avtImg || 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg' }}
          resizeMode='contain'
          style={{
            height: 150,
            width: 150,
            borderRadius: 999,
            marginTop: -90,
            borderColor: 'white',
            borderWidth: 2,

          }} />
        <Text style={{ fontSize: 20 }}>{user?.name}</Text>
        <Text style={{ fontSize: 16, color: 'gray' }}>{user?.email}</Text>
      </View>
      <ScrollView style={{ marginHorizontal: 12 }}>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ marginVertical: 10 }}>{translate('Account')}</Text>
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
          <Text style={{ marginVertical: 10 }}>{translate('Actions')}</Text>
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
