import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import axios from 'axios';
import {API_ENDPOINT} from '@env';

const AddTooFavourite = ({product}: {product: any}) => {
  const [getFavourites, setgetFavourites] = useState<any>([]);

  const {user, authState} = useAuth();

  const postData = {
    productId: product.id,
    userId: user?.id,
    productName: product.productName,
    productDescription: product.productDescription,
    productPrice: JSON.stringify(product.price),
    productImage: product.productCatImage,
  };

  // get fav
  useEffect(() => {
    axios
      .get(API_ENDPOINT + '/FavoriteProduct/getFavByUser?id=' + user?.id)
      .then(res => setgetFavourites(res.data))
      .catch(err => console.log(err));
  }, [user?.id]);

  function getFav() {
    axios
      .get(API_ENDPOINT + '/FavoriteProduct/getFavByUser?id=' + user?.id)
      .then(res => setgetFavourites(res.data))
      .catch(err => console.log(err));
  }

  const getSameFavProducts: any = getFavourites?.filter(
    (Item: any) => Item.productId === product.id,
  );

  // add fav
  const AddProductToFavourite = () => {
    try {
      axios
        .post(API_ENDPOINT + '/FavoriteProduct', postData, {
          headers: {Authorization: `Bearer ${authState?.token}`},
        })
        .then(res => {
          if (res.status === 200) {
            Alert.alert(
              'The product has been successfully added to favorites.',
            );
          }
          getFav();
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  // remove fav product
  const RemoveProductToFavourite = () => {
    try {
      axios
        .delete(
          API_ENDPOINT + '/FavoriteProduct/' + getSameFavProducts[0]?.id,
          {
            headers: {Authorization: `Bearer ${authState?.token}`},
          },
        )
        .then(res => {
          if (res.status === 200) {
            Alert.alert(
              'The product has been successfully removed from favorites.',
            );
          }
          getFav();
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  // control if fav have or no
  function getFavControl() {
    if (
      getFavourites.filter((Item: any) => Item.productId === product.id)
        .length > 0
    ) {
      return 1;
    } else {
      return 0;
    }
  }

  return (
    <View style={styles.addToCartContainer}>
      {getFavControl() === 0 && (
        <TouchableOpacity onPress={() => AddProductToFavourite()}>
          <View style={styles.addToCartButton}>
            <Text style={styles.text}>Add to Favourite</Text>
            <Image
              source={require('../../assets/heart.png')}
              tintColor={'white'}
              style={styles.image}
            />
          </View>
        </TouchableOpacity>
      )}

      {getFavControl() === 1 && (
        <TouchableOpacity onPress={() => RemoveProductToFavourite()}>
          <View style={styles.addToCartButton}>
            <Text style={styles.text}>Remove from Favourite</Text>
            <Image
              source={require('../../assets/heart-fill.png')}
              tintColor={'white'}
              style={styles.image}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  addToCartContainer: {
    width: '100%',
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  addToCartButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    width: '100%',
    backgroundColor: '#e74c3c',
    borderRadius: 10,
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  image: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
});

export default AddTooFavourite;
