import React from 'react';
import {View} from 'react-native';
import ProductDetail from '../components/ProductDetail/ProductDetail';

const ProductScreen = ({route}) => {
  const productId = route.params;

  return (
    <View>
      <ProductDetail productId={productId} />
    </View>
  );
};

export default ProductScreen;
