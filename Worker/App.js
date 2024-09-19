// App.js
import React, { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator, TransitionPresets } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LanguageProvider, LanguageContext } from './context/LanguageContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const { locale } = useContext(LanguageContext);
  const options = { headerShown: false, };

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={options} />
      ) : (
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={options} />
      )}
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={options} />
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
    <LanguageProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </LanguageProvider>
  );
}
