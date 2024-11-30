import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { Fragment, useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import ApiCall from '../api/ApiCall';
import { translate } from '../translator/translator';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Account = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const accountItems = [
    { icon: "person-outline", text: translate('Profile'), onPress: () => navigation.navigate('Profile', { userData: user }) },
    { icon: "security", text: translate('Security'), onPress: () => navigation.navigate('Security') },
    { icon: "lock-outline", text: translate("Privacy"), onPress: () => navigation.navigate('Privacy') },
  ];

  const actionItems = [
    { icon: "logout", text: translate("Logout"), onPress: () => handleLogout() },
  ];

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        const state = await NetInfo.fetch();
        const userData = state.isConnected ? await ApiCall.getMe() : await AsyncStorage.getItem('userData');
        setUser(userData);
      };

      fetchUserData();
    }, [])
  );
  const handleLogout = async () => {
    try {
      // Step 1: Call the API to logout
      const response = await ApiCall.logout();

      // Step 2: If response is not successful, alert the user
      if (response.status !== 200) {
        return Alert.alert('Logout Fail!', response.message);
      }

      // Step 3: Clear AsyncStorage - removing all saved user information
      await AsyncStorage.clear();

      // Step 4: Alert success message
      Alert.alert(
        translate('Success'),
        translate('Logout.success_message'),
      );

      // Step 5: Navigate to LoginScreen and reset the navigation state
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });

    } catch (error) {
      console.error('Failed to logout', error);

      // Step 6: Alert in case of error during logout
      Alert.alert('Logout Fail!', 'An error occurred during logout.');
    }
  };


  const renderSettingsItem = (item) => (
    <TouchableOpacity
      onPress={item.onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingLeft: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
      }}>
      <MaterialIcons name={item.icon} size={28} color="#007BFF" />
      <Text style={{
        marginLeft: 24,
        fontSize: 18,
        fontWeight: '500',
        color: '#333333',
      }}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={'#007BFF'} />
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: 'https://media.sproutsocial.com/uploads/1c_facebook-cover-photo_clean@2x.png' }}
          resizeMode='cover'
          style={styles.headerImage}
        />
      </View>
      <View style={styles.userInfoContainer}>
        <Image source={{ uri: user?.avtImg }}
          resizeMode='contain'
          style={styles.userAvatar} />
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>{translate('Account')}</Text>
          <View style={styles.card}>
            {accountItems.map((item, index) => (
              <Fragment key={index}>
                {renderSettingsItem(item)}
              </Fragment>
            ))}
          </View>
        </View>
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>{translate('Actions')}</Text>
          <View style={styles.card}>
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

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    width: "100%",
    height: 150,
    backgroundColor: '#007BFF',
  },
  headerImage: {
    height: "100%",
    width: "100%",
  },
  userInfoContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: -60,
  },
  userAvatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderColor: 'white',
    borderWidth: 3,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
  },
  scrollView: {
    marginHorizontal: 12,
  },
  cardContainer: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007BFF',
    marginBottom: 8,
    marginLeft: 8,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    overflow: 'hidden',
  },
});

export default Account;
