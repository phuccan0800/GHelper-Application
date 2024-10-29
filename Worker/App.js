// App.js
import React, { useContext, useEffect, useState } from 'react';
import { Easing } from 'react-native';
import * as Font from 'expo-font';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MessageScreen from './screens/MessageScreen';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LanguageProvider, LanguageContext } from './context/LanguageContext';
import { LocationProvider } from './context/LocationContext';
import ProfileScreen from './screens/ProfileScreen';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
const Stack = createStackNavigator();

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

const AppNavigator = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const { locale } = useContext(LanguageContext);
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
    <LocationProvider>
      <LanguageProvider>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </LanguageProvider>
    </LocationProvider>
  );
}
