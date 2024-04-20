import React, {useEffect, useState} from 'react';
import {
  Image,
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {API_ENDPOINT} from '@env';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import {useIsFocused} from '@react-navigation/native';

const FavoriteScreen = ({navigation}) => {
  const [getFavourites, setgetFavourites] = useState([]);
  const {user} = useAuth();
  const isFocused = useIsFocused();

  useEffect(() => {
    axios
      .get(API_ENDPOINT + '/FavoriteProduct/getFavByUser?id=' + user?.id)
      .then(res => setgetFavourites(res.data))
      .catch(err => console.log(err));
  }, [user?.id, isFocused]);

  // navigate product detail screen

  const navigateProductScreen = id => {
    navigation.navigate('ProductDetail', id);
  };

  return (
    <View style={styles.container}>
      {getFavourites.length > 0 ? (
        <FlatList
          data={getFavourites}
          renderItem={({item}) => (
            <View style={styles.productBody}>
              <TouchableOpacity
                onPress={() => navigateProductScreen(item.productId)}>
                <Image source={{uri: item.productImage}} style={styles.image} />
                <Text style={styles.name}>{item.productName}</Text>
                <Text style={styles.price}>{item.productPrice} $</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
          numColumns={2}
        />
      ) : (
        <View>
          <Text style={styles.noproduct}>
            You don't have any Favourite Products
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
  },
  productBody: {
    width: '50%',
    margin: 5,
  },
  image: {width: '100%', height: 200},
  name: {
    textAlign: 'center',
    marginBottom: 10,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  price: {
    textAlign: 'center',
    marginBottom: 5,
    color: 'gray',
    fontWeight: 'thin',
    fontSize: 12,
  },
  noproduct: {
    color: '#27ae60',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default FavoriteScreen;
