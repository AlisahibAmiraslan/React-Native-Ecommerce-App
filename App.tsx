/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SearchScreen from './screens/SearchScreen';
import FavoriteScreen from './screens/FavoriteScreen';
import {Image} from 'react-native';
import {CategoryDrawer} from './navigators/CategoryDrawer';
import {AuthProvider, useAuth} from './context/AuthContext';
import {AuthStack} from './navigators/AuthStack';
import {CartStack} from './navigators/CartStack';
import {CartProvider} from './context/CartContext';
import {useCart} from './context/CartContext';
import {MyAccountStack} from './navigators/MyAccountStack';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout />
      </CartProvider>
    </AuthProvider>
  );
}

export const Layout = () => {
  const {authState} = useAuth();
  const {cartCount} = useCart();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#27ae60',
          tabBarInactiveTintColor: 'black',
          headerTitleAlign: 'center',
        }}>
        <Tab.Screen
          name="App Drawer"
          component={CategoryDrawer}
          options={{
            headerShown: false,
            tabBarIcon: ({color}) => (
              <Image
                source={require('./assets/home.png')}
                style={{width: 40, height: 40}}
                tintColor={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({color}) => (
              <Image
                source={require('./assets/search.png')}
                style={{width: 35, height: 35}}
                tintColor={color}
              />
            ),
          }}
        />
        {authState?.authenticated && (
          <Tab.Screen
            name="Favourite"
            component={FavoriteScreen}
            options={{
              tabBarIcon: ({color}) => (
                <Image
                  source={require('./assets/heart.png')}
                  style={{width: 35, height: 35}}
                  tintColor={color}
                />
              ),
              title: 'My Favourites',
            }}
          />
        )}

        <Tab.Screen
          name="Cart"
          component={CartStack}
          options={{
            headerShown: false,
            tabBarIcon: ({color}) => (
              <Image
                source={require('./assets/cart.png')}
                style={{width: 35, height: 35}}
                tintColor={color}
              />
            ),
            tabBarBadge: cartCount,
          }}
        />
        {!authState?.authenticated && (
          <Tab.Screen
            name="Auth"
            component={AuthStack}
            options={{
              headerShown: false,
              tabBarIcon: ({color}) => (
                <Image
                  source={require('./assets/user.png')}
                  style={{width: 35, height: 35}}
                  tintColor={color}
                />
              ),
            }}
          />
        )}

        {authState?.authenticated && (
          <Tab.Screen
            name="MyAccount"
            component={MyAccountStack}
            options={{
              headerShown: false,
              tabBarIcon: ({color}) => (
                <Image
                  source={require('./assets/profile.png')}
                  style={{width: 40, height: 40}}
                  tintColor={color}
                />
              ),
            }}
          />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
