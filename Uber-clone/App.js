import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import React, { useContext } from 'react';

import { AuthContext, AuthProvider } from './context/AuthContext'; // Import AuthContext và AuthProvider
import { ToastProvider } from './context/ToastContext';

import LoginScreen from './screens/Auth/Login';
import RegisterScreen from './screens/Auth/Register';
import ForgotPasswordScreen from './screens/Auth/ForgotPasswordScreen';
import BottomNavigator from './screens/BottomNavigator';
import Profile from './screens/Account/Profile';
import Privacy from './screens/Account/Privacy';
import RentJob from './screens/RentJob';
import RentJobConfirm from './screens/RenJobConfirm';
import PaymentSetting from './screens/Payment/PaymentSetting';
import AllPaymentMethod from './screens/Payment/AllPaymentMethod';
import AddPaymentMethod from './screens/Payment/AddPaymentMethod';
import PaymentMethodInformation from './screens/Payment/PaymentMethodInformation';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#663399',
    myOwnColor: '#BADA55',
  },
};

const AppStack = () => {
  const Stack = createStackNavigator();
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? 'BottomNavigator' : 'LoginScreen'}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BottomNavigator" component={BottomNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="Privacy" component={Privacy} options={{ headerShown: false }} />
      <Stack.Screen name="RentJob" component={RentJob} options={{ headerShown: false }} />
      <Stack.Screen name="RentJobConfirm" component={RentJobConfirm} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentSetting" component={PaymentSetting} options={{ headerShown: false }} />
      <Stack.Screen name="AllPaymentMethod" component={AllPaymentMethod} options={{
        headerShown: false, gestureEnabled: true,
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }} />
      <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethod} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentMethodInformation" component={PaymentMethodInformation} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <AppStack />
          </NavigationContainer>
        </PaperProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
