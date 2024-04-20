import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import ProductImage from './ProductImage';
import AddTooFavourite from './AddTooFavourite';
import {useAuth} from '../../context/AuthContext';
import axios from 'axios';
import {API_ENDPOINT} from '@env';
import AddToCart from './AddToCart';

const ProductDetail = ({productId}: {productId: number}) => {
  const {authState} = useAuth();
  const [product, setProduct] = useState<any>([]);

  useEffect(() => {
    axios
      .get(API_ENDPOINT + '/Product/' + productId)
      .then(res => setProduct(res.data))
      .catch(err => console.log(err));
  }, [productId]);

  return (
    <View>
      <ScrollView>
        <View style={styles.productsContainer}>
          {/* images */}
          <ProductImage images={product.productImages} />
          {/* product details */}
          <View style={styles.productDetail}>
            <Text style={styles.productName}>{product.productName}</Text>
            <Text style={styles.productDesc}>{product.productDetail}</Text>
            <Text style={styles.productPrice}>Price: {product.price}$</Text>
          </View>
          {/* add to cart */}
          <View>
            <AddToCart product={product} />
          </View>

          {/* ad to favourite */}
          {authState?.authenticated && <AddTooFavourite product={product} />}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  productsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 40,
  },
  productDetail: {
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  productName: {
    width: '100%',
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
  },
  productDesc: {
    fontSize: 12,
    marginTop: 15,
    fontStyle: 'italic',
  },
  productPrice: {
    marginTop: 20,
    color: '#e74c3c',
    fontSize: 20,
  },
});

export default ProductDetail;
