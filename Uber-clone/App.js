import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { store } from './store';

import HomeScreen from './screens/Home';
import MapScreen from './screens/MapScreen';
import LoginScreen from './screens/user/LoginScreen';
import RegisterScreen from './screens/user/RegisterScreen';
import ForgotPasswordScreen from './screens/user/ForgotPasswordScreen';
import { MD3LightTheme } from 'react-native-paper';

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
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          {/* <SafeAreaProvider> */}
          <Stack.Navigator initialRouteName='LoginScreen'>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false, }} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false, }} />
            <Stack.Screen name="Home" options={{ headerShown: false, }} component={HomeScreen} />
            <Stack.Screen name="MapScreen" options={{ headerShown: false, }} component={MapScreen} />
            <Stack.Screen name="ForgotPasswordScreen" options={{ headerShown: false, }} component={ForgotPasswordScreen} />
          </Stack.Navigator>
          {/* </SafeAreaProvider> */}
        </NavigationContainer>
      </PaperProvider>
    </Provider>

  );
}
