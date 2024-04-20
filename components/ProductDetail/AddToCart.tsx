import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {useAuth} from '../../context/AuthContext';
import axios from 'axios';
import {API_ENDPOINT} from '@env';
import {useCart} from '../../context/CartContext';
import {useRoute, useIsFocused} from '@react-navigation/native';

const AddToCart = ({product}: {product: any}) => {
  const isFocus = useIsFocused();
  const router = useRoute();
  const {user} = useAuth();
  const {updateCartCount} = useCart();

  const [DeviceId, setDeviceId] = useState<string>('');

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [GetColorName, setGetColorName] = useState<string>('');

  const [selected, setSelected] = useState<number>(0);
  const [GetSizeId, setGetSizeId] = useState<number>(0);
  const [GetSize1Name, setGetSize1Name] = useState<string>('');
  const [GetSize2Name, setGetSize2Name] = useState<string>('');

  const handlerVariant = (id: number, size1Name: string, size2Name: string) => {
    setGetSizeId(id);
    setGetSize1Name(size1Name);
    setGetSize2Name(size2Name);
  };

  const handlerColor = (color: string) => {
    setGetColorName(color);
  };

  const changeVariantColor = (id: number) => {
    setSelected(id);
  };

  const changeColor = (color: string) => {
    setSelectedColor(color);
  };

  useEffect(() => {
    const getDeviceInfo = async () => {
      const deviceUniqueId = await DeviceInfo.getUniqueId();
      setDeviceId(deviceUniqueId);
    };

    getDeviceInfo();

    setSelectedColor('');
    setSelected(0);
    setGetColorName('');
    setGetSizeId(0);
    setGetSize1Name('');
    setGetSize2Name('');
  }, [router.params, isFocus]);

  const getCarts = () => {
    axios
      .get(API_ENDPOINT + '/AddToCart/uniqueId?uniqueId=' + DeviceId)
      .then(res => {
        updateCartCount(res?.data?.getCartByUniqueId.length);
      })
      .catch(err => console.log(err));
  };

  const Quantity: number = 1;

  const PostData: any = {
    userId: user?.id === null ? 0 : user?.id,
    uniqueId: DeviceId,
    productId: product.id,
    productName: product.productName,
    productDescription: product.productDescription,
    markName: product.markName,
    productPrice: product.price,
    qty: Quantity,
    productSizeId: GetSizeId,
    productColor: GetColorName,
    productSize1Name: GetSize1Name,
    productSize2Name: GetSize2Name,
    seriePrice: product.price * Quantity,
    productImage: product.productCatImage,
  };

  const AddToCartProduct = () => {
    if (GetSizeId !== 0 && GetColorName !== '') {
      axios
        .post(API_ENDPOINT + '/AddToCart', PostData)
        .then(res => {
          if (res.status === 200) {
            Alert.alert('Product successfully added to cart');

            getCarts();
          }
          if (res.status !== 200) {
            Alert.alert('An error occurred. Please try again');
          }
        })
        .catch(err => console.log(err));
    } else {
      Alert.alert('Please choose SIZE and COLOR');
    }
  };

  const uniqueColors = [
    ...new Set(product?.productSizes?.map((item: any) => item.color)),
  ].map(color => {
    return product?.productSizes?.find((item: any) => item.color === color);
  });

  return (
    <View>
      {/* product variants */}

      <View style={styles.variantContainer}>
        <Text style={styles.choosesize}>Choose Color:</Text>
        <View style={styles.variantWrapper}>
          {uniqueColors &&
            uniqueColors.map((item, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => {
                      handlerColor(item.color);
                      changeColor(item.color);
                    }}>
                    <View
                      style={
                        item.color === selectedColor
                          ? styles.active
                          : styles.variantNames
                      }>
                      <Text style={styles.text}>{item.color}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>
        <Text style={styles.choosesize}>Choose Size:</Text>
        <View style={styles.variantWrapper}>
          {product?.productSizes?.map((item: any, index: number) => {
            return (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => {
                    handlerVariant(item.id, item.size1Name, item.size2Name);
                    changeVariantColor(item.id);
                  }}>
                  <View
                    style={
                      item.id === selected ? styles.active : styles.variantNames
                    }>
                    {item.size1Name !== null && item.size1Name !== 'string' && (
                      <Text style={styles.text}>{item.size1Name}</Text>
                    )}
                    {item.size2Name !== null &&
                      item.size2Name !== 'string' &&
                      item.size2name !== 'no-size' && (
                        <Text style={styles.text}>{item.size2Name}</Text>
                      )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
      {/* add to cart */}
      <View style={styles.cartButtonContainer}>
        <TouchableOpacity onPress={() => AddToCartProduct()}>
          <Text style={styles.button}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartButtonContainer: {
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
  },
  button: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 15,
    fontSize: 20,
  },
  variantContainer: {
    marginTop: 30,
    paddingLeft: 10,
    paddingRight: 20,
  },
  variantWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  variantNames: {
    padding: 15,
    color: 'black',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    margin: 10,
  },
  active: {
    padding: 15,
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#8e44ad',
    margin: 10,
  },
  text: {
    color: 'black',
  },
  variantColors: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  choosesize: {paddingLeft: 10, textDecorationLine: 'underline'},
});

export default AddToCart;
