/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {createContext, useState, useContext, useEffect} from 'react';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {API_ENDPOINT} from '@env';

const CartContext = createContext({
  cartCount: 0,
  updateCartCount: (newCount: any) => {},
});

export const CartProvider = ({children}: {children: any}) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const deviceUniqueId = await DeviceInfo.getUniqueId();

        const response = await axios.get(
          API_ENDPOINT + '/AddToCart/uniqueId?uniqueId=' + deviceUniqueId,
        );
        setCartCount(response.data.getCartByUniqueId.length);
      } catch (error) {
        console.error('Alışveriş sepeti sayısı getirme hatası:', error);
      }
    };

    fetchCartCount();
  }, []);

  const updateCartCount = (newCount: any) => {
    setCartCount(newCount);
  };

  return (
    <CartContext.Provider value={{cartCount, updateCartCount}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
