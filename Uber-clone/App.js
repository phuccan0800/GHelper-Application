import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { store } from './store';
import React, { useContext } from 'react';

import { AuthContext, AuthProvider } from './context/AuthContext'; // Import AuthContext và AuthProvider
import MapScreen from './screens/MapScreen';
import LoginScreen from './screens/user/LoginScreen';
import RegisterScreen from './screens/user/RegisterScreen';
import ForgotPasswordScreen from './screens/user/ForgotPasswordScreen';
import BottomNavigator from './screens/BottomNavigator';
import Profile from './screens/Account/Profile';
import Privacy from './screens/Account/Privacy';
import RentJob from './screens/RentJob';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#663399',
    myOwnColor: '#BADA55',
  },
};

const AppStack = () => {
  const Stack = createNativeStackNavigator();
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? 'BottomNavigator' : 'LoginScreen'}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BottomNavigator" component={BottomNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      {/* Account Setting Screen */}
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="Privacy" component={Privacy} options={{ headerShown: false }} />
      <Stack.Screen name="RentJob" component={RentJob} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <AppStack />
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </Provider>
  );
}
