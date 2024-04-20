/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Image,
  View,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {API_ENDPOINT} from '@env';
import axios from 'axios';

const SearchScreen = ({navigation}) => {
  const [getProducts, setGetProducts] = useState([]);
  const [getCategories, setgetCategories] = useState([]);

  useEffect(() => {
    axios
      .get(API_ENDPOINT + '/Category')
      .then(res => {
        setgetCategories(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const searchChange = text => {
    if (text.length < 3) {
      setGetProducts([]);
    }
    if (text.length > 3) {
      try {
        axios
          .get(API_ENDPOINT + '/Product/search-products?text=' + text)
          .then(res => {
            setGetProducts(res.data);
          })
          .catch(err => console.log(err));
      } catch (error) {
        console.log(error);
      }
    }
  };

  //navigate category screen
  const pressHandler = (id, name) => {
    navigation.navigate(name, {id: id});
  };
  //navigate product detail screen
  const navigateProduct = id => {
    navigation.navigate('ProductDetail', id);
  };
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TextInput
          style={styles.input}
          placeholder="Search.."
          onChange={text => searchChange(text.nativeEvent.text)}
        />

        <Image source={require('../assets/search.png')} style={styles.image} />
      </View>
      <View style={styles.productsContainer}>
        {getProducts.length > 0 && (
          <FlatList
            data={getProducts}
            renderItem={({item}) => (
              <View style={{width: '50%', margin: 5}}>
                <TouchableOpacity onPress={() => navigateProduct(item.id)}>
                  <Image
                    source={{uri: item.productCatImage}}
                    style={{width: '100%', height: 200}}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      marginBottom: 10,
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}>
                    {item.productName}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginBottom: 5,
                      color: 'gray',
                      fontWeight: 'thin',
                      fontSize: 12,
                    }}>
                    {item.price} $
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.id}
            numColumns={2}
          />
        )}
      </View>
      <View style={styles.categoryContainer}>
        {getCategories.length > 0 && (
          <FlatList
            data={getCategories}
            renderItem={({item}) => (
              <View style={{width: '50%', margin: 5}}>
                <TouchableOpacity
                  onPress={() => pressHandler(item.id, item.catName)}>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: 10,
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: 14,
                    }}>
                    {item.catName}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.id}
            numColumns={2}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    minHeight: '100%',
  },
  body: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    width: 300,
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  image: {
    width: 30,
    height: 30,
  },
  productsContainer: {
    marginTop: 50,
  },
  categoryContainer: {
    marginTop: 20,
    borderWidth: 0.5,
    paddingVertical: 20,
  },
});

export default SearchScreen;
