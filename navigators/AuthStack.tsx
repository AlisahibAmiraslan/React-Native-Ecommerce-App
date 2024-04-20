import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Log in to Weedigitron',
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: 'Register to Weedigitron',
        }}
      />
    </Stack.Navigator>
  );
};

function AuthNavigationRoute(): React.JSX.Element {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}

export default AuthNavigationRoute;
