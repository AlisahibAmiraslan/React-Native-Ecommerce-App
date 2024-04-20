import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {MyAccountPages} from '../../data/data';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../context/AuthContext';

const MyAccount = () => {
  const {onLogOut} = useAuth();

  const navigation: any = useNavigation();

  const handelClick = (url: string) => {
    navigation.navigate(url);
  };

  return (
    <View style={styles.container}>
      {MyAccountPages && (
        <FlatList
          data={MyAccountPages}
          renderItem={({item}) => (
            <View style={styles.accountCard}>
              <TouchableOpacity onPress={() => handelClick(item.url)}>
                <View style={styles.accountBody}>
                  <View style={styles.nameContent}>
                    <Image source={item.image} style={styles.image} />
                    <Text style={styles.text}>{item.name}</Text>
                  </View>
                  <View>
                    <Image
                      source={require('../../assets/right.png')}
                      style={styles.image}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item: any) => item.id}
        />
      )}
      <View style={styles.accountBody}>
        <TouchableOpacity onPress={onLogOut}>
          <View style={styles.nameContent}>
            <Image
              source={require('../../assets/logout.png')}
              style={styles.image}
            />
            <Text style={styles.text}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  accountCard: {
    width: '100%',
    borderColor: '#bdc3c7',
    borderBottomWidth: 1,
  },
  accountBody: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 30,
    paddingBottom: 30,
  },
  nameContent: {
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
  image: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
});

export default MyAccount;
