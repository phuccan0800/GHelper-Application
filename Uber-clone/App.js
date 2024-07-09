import { Provider } from 'react-redux';
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

import { checkToken } from './utils/auth';

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
    const userToken = checkToken();
    setLoading(!!userToken);
    // if (loading) {
    //     return (
    //         <SafeAreaProvider style={styles.container}>
    //             <Text>Loading...</Text>
    //         </SafeAreaProvider>
    //     );
    // }
    setIsLoggedIn(!!userToken);

  }, []);

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          {/* <SafeAreaProvider> */}
          <Stack.Navigator initialRouteName={isLoggedIn ? 'BottomNavigator' : 'LoginScreen'}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false, }} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false, }} />
            <Stack.Screen name="BottomNavigator" component={BottomNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="MapScreen" options={{ headerShown: false, }} component={MapScreen} />
            <Stack.Screen name="ForgotPasswordScreen" options={{ headerShown: false, }} component={ForgotPasswordScreen} />
          </Stack.Navigator>
          {/* </SafeAreaProvider> */}
        </NavigationContainer>
        {/* <BottomNavigator /> */}
      </PaperProvider>
    </Provider>

  );
}
