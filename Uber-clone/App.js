import { Provider } from 'react-redux';
import Home from './screens/Home';
import Map from './screens/MapScreen';
import LoginScreen from './screens/user/LoginScreen';
import { store } from './store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Home"
              options={{
                headerShown: false,
              }}
              component={Home} />
            <Stack.Screen
              name="MapScreen"
              options={{
                headerShown: false,
              }}
              component={Map} />
          </Stack.Navigator>
          {/* <Home /> */}
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>

  );
}
