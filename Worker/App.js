import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { Easing } from 'react-native';
import * as Font from 'expo-font';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MessageScreen from './screens/MessageScreen';
import WorkingScreen from './screens/WorkingScreen';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider, AuthContext } from './context/AuthContext';
import { LanguageProvider, LanguageContext } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { WebsocketProvider } from './context/WebsocketContext';
import { useNavigation } from '@react-navigation/native';

import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { navigationRef } from './context/NavigationRefContext';


import JobNotification from './components/JobNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiCall from './Api/api';

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 0.1,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
}

const closeConfig = {
  animation: 'timing',
  config: {
    duration: 100,
    easing: Easing.linear,
  },
};

const AppStackWithLoading = () => {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#663399" />
        <Text>Đang tải, vui lòng chờ...</Text>
      </View>
    );
  }

  return <AppStack />;
};

const AppStack = () => {
  const Stack = createStackNavigator();
  const { isLoggedIn } = useContext(AuthContext);
  const options = {
    headerShown: false,
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    transitionSpec: {
      open: config,
      close: closeConfig,
    },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  };
  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? 'HomeScreen' : 'LoginScreen'} screenOptions={options}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="MessageScreen" component={MessageScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="WorkingScreen" component={WorkingScreen} />
    </Stack.Navigator>
  );
};


export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Oswald': require('./assets/fonts/Oswald-VariableFont_wght.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <WebsocketProvider>
          <LanguageProvider>
            <JobNotification />
            <NavigationContainer ref={navigationRef}>
              <AppStackWithLoading />
            </NavigationContainer>
          </LanguageProvider>
        </WebsocketProvider>
      </AuthProvider>
    </ToastProvider>

  );
}
