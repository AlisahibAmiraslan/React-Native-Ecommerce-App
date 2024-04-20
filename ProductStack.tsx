import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProductScreen from './screens/ProductScreen';

const Stack = createNativeStackNavigator();

export const ProductStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="ProductDetail"
        component={ProductScreen}
        options={{
          title: 'Products',
        }}
      />
    </Stack.Navigator>
  );
};

function RouteProductNavigation(): React.JSX.Element {
  return (
    <NavigationContainer>
      <ProductStack />
    </NavigationContainer>
  );
}

export default RouteProductNavigation;
