import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import PaymentByGuest from '../components/Cart/PaymentByGuest';

const PaymentByGuestScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <PaymentByGuest />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
});

export default PaymentByGuestScreen;
