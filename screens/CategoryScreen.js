import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import {API_ENDPOINT} from '@env';
import CategoryFilters from '../components/CategoryProduct/CategoryFilters';

const CategoryScreen = ({navigation}) => {
  const router = useRoute();

  const [getCategoryProducts, setgetCategoryProducts] = useState([]);

  useEffect(() => {
    axios
      .get(API_ENDPOINT + '/Category/search?id=' + router.params.id)
      .then(res => setgetCategoryProducts(res.data))
      .catch(err => console.log(err));
  }, [router.params.id]);

  return (
    <View>
      <CategoryFilters products={getCategoryProducts} navigation={navigation} />
    </View>
  );
};

export default CategoryScreen;
