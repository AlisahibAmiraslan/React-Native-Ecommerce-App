import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

const SettingsScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>SettingScreen</Text>
      <Button title="Toogle drawer" onPress={() => navigation.toggleDrawer()} />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
