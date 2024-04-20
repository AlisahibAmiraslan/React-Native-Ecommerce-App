import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {useAuth} from '../context/AuthContext';

const MyProfileScreen = () => {
  const {user} = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Text>Name:</Text>
        <Text style={styles.text}> {user?.userName} </Text>
      </View>
      <View style={styles.profile}>
        <Text>Email:</Text>
        <Text style={styles.text}> {user?.email} </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  profile: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
  },
  text: {
    fontSize: 20,
    color: 'black',
    paddingTop: 10,
  },
});

export default MyProfileScreen;
