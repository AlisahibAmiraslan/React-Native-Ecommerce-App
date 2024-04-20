/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */

import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import axios from 'axios';
import {Image, TouchableOpacity} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {API_ENDPOINT} from '@env';
import ProductScreen from '../screens/ProductScreen';

const Drawer = createDrawerNavigator();

function LogoTitle() {
  return (
    <Image
      style={{width: 200, height: 55}}
      source={require('./../assets/logo.png')}
    />
  );
}

export const CategoryDrawer = () => {
  const {authState, onLogOut} = useAuth();

  const [Categories, setCategories] = useState<any>([]);

  useEffect(() => {
    axios
      .get(API_ENDPOINT + '/Category')
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: 'red',
        headerTintColor: 'black',
        drawerContentStyle: {
          backgroundColor: '#fff',
        },
        headerTitleAlign: 'center',
      }}>
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerRight: () =>
            authState?.authenticated ? (
              <TouchableOpacity onPress={onLogOut}>
                <Image
                  source={require('./../assets/logout.png')}
                  style={{width: 35, height: 35, marginRight: 10}}
                />
              </TouchableOpacity>
            ) : (
              ''
            ),
          title: 'Home',
          headerTitle: () => <LogoTitle />,
        }}
      />

      {Categories &&
        Categories.map((item: any, index: number) => {
          return (
            <Drawer.Screen
              name={item.catName}
              component={CategoryScreen}
              initialParams={{
                id: item.id,
              }}
              key={index}
            />
          );
        })}

      <Drawer.Screen
        name="ProductDetail"
        component={ProductScreen}
        options={{
          drawerItemStyle: {
            display: 'none',
          },
          headerTitle: () => <LogoTitle />,
        }}
      />
    </Drawer.Navigator>
  );
};

function CategoryNavigationRoute(): React.JSX.Element {
  return (
    <NavigationContainer>
      <CategoryDrawer />
    </NavigationContainer>
  );
}

export default CategoryNavigationRoute;
