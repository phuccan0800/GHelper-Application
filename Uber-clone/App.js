import { Provider } from 'react-redux';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { store } from './store';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './screens/Home';
import MapScreen from './screens/MapScreen';
import LoginScreen from './screens/user/LoginScreen';
import RegisterScreen from './screens/user/RegisterScreen';
import ForgotPasswordScreen from './screens/user/ForgotPasswordScreen';
import BottomNavigator from './screens/BottomNavigator';
import Profile from './screens/Account/Profile';
import Privacy from './screens/Account/Privacy';
import { checkToken } from './utils/auth';
import RenJob from './screens/RentJob';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#663399',
    myOwnColor: '#BADA55',
  },
}

export default function App() {
  const Stack = createNativeStackNavigator();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const userToken = await checkToken();
      console.log(userToken);
      setIsLoggedIn(!!userToken); // Ensure this is a boolean
      setLoading(false);
    };

    verifyToken();
  }, []);

  useEffect(() => {
    console.log("IsLoggedIn: ", isLoggedIn);
  }, [isLoggedIn]);

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={isLoggedIn ? 'BottomNavigator' : 'LoginScreen'}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BottomNavigator" component={BottomNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
            {/* Account Setting Screen */}
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="Privacy" component={Privacy} options={{ headerShown: false }} />
            <Stack.Screen name="RentJob" component={RenJob} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
