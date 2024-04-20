import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CartScreen from '../screens/CartScreen';
import PaymentByGuestScreen from '../screens/PaymentByGuestScreen';
import {useAuth} from '../context/AuthContext';
import PaymentByUserScreen from '../screens/PaymentByUserScreen';

const Stack = createNativeStackNavigator();

export const CartStack = () => {
  const {authState} = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          title: 'Cart',
        }}
      />
      {authState?.authenticated ? (
        <Stack.Screen
          name="PaymentByUserScreen"
          component={PaymentByUserScreen}
          options={{
            title: 'Payment',
          }}
        />
      ) : (
        <Stack.Screen
          name="PaymentByGuestScreen"
          component={PaymentByGuestScreen}
          options={{
            title: 'Payment',
          }}
        />
      )}
    </Stack.Navigator>
  );
};

function CartNavigationRoute(): React.JSX.Element {
  return (
    <NavigationContainer>
      <CartStack />
    </NavigationContainer>
  );
}

export default CartNavigationRoute;
