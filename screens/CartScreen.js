import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import Cart from '../components/Cart/Cart';

const CartScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Cart />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
});

export default CartScreen;
