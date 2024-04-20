import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import axios from 'axios';
import {API_ENDPOINT} from '@env';
import DeviceInfo from 'react-native-device-info';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {useCart} from '../../context/CartContext';
import {useAuth} from '../../context/AuthContext';

const Cart = () => {
  const navigation: any = useNavigation();
  const {updateCartCount} = useCart();
  const isFocused = useIsFocused();
  const {authState} = useAuth();

  const [GetCartItems, setGetCartItems] = useState<any>([]);

  useEffect(() => {
    const fetchCartCount = async () => {
      const deviceUniqueId = await DeviceInfo.getUniqueId();
      axios
        .get(API_ENDPOINT + '/AddToCart/uniqueId?uniqueId=' + deviceUniqueId)
        .then(res => {
          setGetCartItems(res.data);
          updateCartCount(res?.data?.getCartByUniqueId?.length);
        })
        .catch(err => console.log(err.response));
    };
    fetchCartCount();
  }, [isFocused, updateCartCount]);

  const getCarts = async () => {
    const deviceUniqueId = await DeviceInfo.getUniqueId();

    axios
      .get(API_ENDPOINT + '/AddToCart/uniqueId?uniqueId=' + deviceUniqueId)
      .then(res => {
        setGetCartItems(res.data);
        updateCartCount(res?.data?.getCartByUniqueId.length);
      })
      .catch(err => console.log(err.response));
  };

  const deleteCartItem = (id: number) => {
    axios
      .delete(API_ENDPOINT + '/AddToCart/' + id)
      .then(res => {
        if (res.status === 200) {
          Alert.alert('Cart Item successfully deleted');
          getCarts();
        }
      })
      .catch(err => console.log(err.response));
  };

  const UpdateItem = (
    id: number,
    userId: number,
    uniqueId: string,
    productId: number,
    productPrice: number,
    qty: number,
    seriePrice: number,
    value: number,
  ) => {
    if (value === 1) {
      if (qty === 1) {
        deleteCartItem(id);
        getCarts();
      } else {
        const postData = {
          id: id,
          userId: userId,
          uniqueId: uniqueId,
          productId: productId,
          productPrice: productPrice,
          qty: qty - 1,
          seriePrice: seriePrice - productPrice,
        };

        try {
          axios
            .put(API_ENDPOINT + '/AddToCart/update-unique-cart', postData)
            .then(res => {
              if (res.status === 200) {
                getCarts();
              }
            })
            .catch(err => console.log(err.response));
        } catch (error: any) {
          console.log(error.response);
        }
      }
    } else if (value === 2) {
      const postData = {
        id: id,
        userId: userId,
        uniqueId: uniqueId,
        productId: productId,
        productPrice: productPrice,
        qty: qty + 1,
        seriePrice: seriePrice + productPrice,
      };

      try {
        axios
          .put(API_ENDPOINT + '/AddToCart/update-unique-cart', postData)
          .then(res => {
            if (res.status === 200) {
              getCarts();
            }
          })
          .catch(err => console.log(err.response));
      } catch (error: any) {
        console.log(error.response);
      }
    }
  };

  const navigatePaymentScreen = () => {
    if (authState?.authenticated) {
      navigation.navigate('PaymentByUserScreen');
    } else {
      navigation.navigate('PaymentByGuestScreen');
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <ScrollView style={styles.cartBody}>
          {GetCartItems?.getCartByUniqueId?.length > 0 &&
            GetCartItems?.getCartByUniqueId?.map((item: any, index: number) => {
              return (
                <View key={index} style={styles.cartwrapper}>
                  <View style={styles.cartInfo}>
                    <Image
                      source={{uri: item.productImage}}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                    <View>
                      <Text style={styles.cartInfoDetail}>
                        Brand: {item.markName}
                      </Text>
                      <View style={styles.cartQuantity}>
                        <TouchableOpacity
                          onPress={() =>
                            UpdateItem(
                              item.id,
                              item.userId,
                              item.uniqueId,
                              item.productId,
                              item.productPrice,
                              item.qty,
                              item.seriePrice,
                              1,
                            )
                          }>
                          <Image
                            source={require('../../assets/minus.png')}
                            style={styles.quantityIcon}
                          />
                        </TouchableOpacity>
                        <TextInput
                          style={styles.input}
                          value={String(item.qty)}
                          editable={false}
                        />
                        <TouchableOpacity
                          onPress={() =>
                            UpdateItem(
                              item.id,
                              item.userId,
                              item.uniqueId,
                              item.productId,
                              item.productPrice,
                              item.qty,
                              item.seriePrice,
                              2,
                            )
                          }>
                          <Image
                            source={require('../../assets/plus.png')}
                            style={styles.quantityIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={styles.cartDetails}>
                    <Text style={styles.cartDetailText}>
                      {item.productName}
                    </Text>
                    <Text style={styles.productTextPrice}>
                      Product Price: {item.productPrice}
                    </Text>
                    <Text style={styles.productTextSeriePrice}>
                      Total Price {item.seriePrice}
                    </Text>
                    <Text style={styles.productTextColor}>
                      Color: {item.productColor}
                    </Text>
                    {item.productSize1Name !== null &&
                      item.productSize1Name !== 'string' && (
                        <Text style={styles.productTextSizeName}>
                          Size: {item.productSize1Name}
                        </Text>
                      )}

                    {item.productSize2Name !== null &&
                      item.productSize2Name !== 'string' && (
                        <Text style={styles.productTextSizeName}>
                          Size: {item.productSize2Name}
                        </Text>
                      )}
                    <View style={styles.deletewrapper}>
                      <View style={styles.delete}>
                        <TouchableOpacity
                          onPress={() => deleteCartItem(item.id)}>
                          <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
      <View style={styles.cartTotalPrices}>
        {GetCartItems?.getCartByUniqueId?.length > 0 ? (
          <Text style={styles.totalPrice}>
            All Total Price: {GetCartItems?.totalPrice} $
          </Text>
        ) : (
          ''
        )}
        {GetCartItems?.getCartByUniqueId?.length > 0 ? (
          <View style={styles.paymentButton}>
            <TouchableOpacity onPress={() => navigatePaymentScreen()}>
              <Text style={styles.paymentText}>Buy</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.paymentEmptyText}>
              Your Shopping Cart is Empty
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    padding: 20,
    paddingBottom: 5,
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  cartBody: {
    width: '100%',
    height: 450,
  },
  cartwrapper: {
    borderWidth: 0.5,
    marginBottom: 10,
    borderColor: 'black',
  },
  cartInfo: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  cartInfoDetail: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  cartDetails: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
  },
  cartDetailText: {
    fontWeight: 'bold',
    paddingBottom: 10,
    color: 'black',
    fontSize: 17,
  },
  productTextPrice: {
    color: '#e67e22',
    paddingBottom: 10,
    fontSize: 17,
  },
  productTextSeriePrice: {
    color: '#27ae60',
    paddingBottom: 10,
    fontSize: 17,
  },
  productTextColor: {color: 'black', paddingBottom: 10, fontSize: 14},
  productTextSizeName: {color: 'black', fontSize: 14},
  productImage: {width: 200, height: 100},
  deletewrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  delete: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    padding: 5,
    backgroundColor: 'red',
    width: 100,
  },
  deleteText: {
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
  },
  cartTotalPrices: {
    padding: 20,
  },
  cartQuantity: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityIcon: {
    width: 25,
    height: 25,
  },
  input: {
    backgroundColor: 'white',
    width: 40,
    height: 35,
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  paymentButton: {
    width: '100%',
    marginTop: 20,
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  paymentText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentEmptyText: {
    color: 'red',
    fontSize: 25,
    marginTop: 50,
    textAlign: 'center',
  },
});

export default Cart;
