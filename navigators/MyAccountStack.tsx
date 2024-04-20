import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyAdressScreen from '../screens/MyAdressScreen';
import MyOrderScreen from '../screens/MyOrderScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import MyAccountScreen from '../screens/MyAccountScreen';

const Stack = createNativeStackNavigator();

export const MyAccountStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="MyAccountScreen"
        component={MyAccountScreen}
        options={{
          title: 'My Account',
        }}
      />
      <Stack.Screen
        name="MyAdress"
        component={MyAdressScreen}
        options={{
          title: 'My Adress',
        }}
      />
      <Stack.Screen
        name="MyOrder"
        component={MyOrderScreen}
        options={{
          title: 'My Order',
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          title: 'Change Password',
        }}
      />
      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{
          title: 'My Profile',
        }}
      />
    </Stack.Navigator>
  );
};

function MyAccountNavigationRoute(): React.JSX.Element {
  return (
    <NavigationContainer>
      <MyAccountStack />
    </NavigationContainer>
  );
}

export default MyAccountNavigationRoute;
