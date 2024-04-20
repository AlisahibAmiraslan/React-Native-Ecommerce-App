/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {API_ENDPOINT} from '@env';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';

const PaymentByGuest = () => {
  const navigation: any = useNavigation();

  const phoneInput = useRef<PhoneInput>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [valid, setValid] = useState<boolean>(false);
  const [GetCart, setGetCart] = useState([]);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const deviceUniqueId = await DeviceInfo.getUniqueId();

        const response = await axios.get(
          API_ENDPOINT + '/AddToCart/uniqueId?uniqueId=' + deviceUniqueId,
        );
        setGetCart(response.data.getCartByUniqueId);
      } catch (error) {
        console.error('Alışveriş sepeti getirme hatası:', error);
      }
    };

    fetchCartCount();
  }, []);

  const [postDataAddress, setPostDataAddress] = useState<any>({
    userId: 0,
    name: '',
    surName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    districtName: '',
    adressDescription: '',
  });

  const [postDataCard, setPostDataCard] = useState<any>({
    cardNumber: '',
    cardName: '',
    cardMonth: '',
    cardYear: 0,
    cardCVC: 0,
  });

  const postData: any = {
    userId: 0,
    cardNumber: postDataCard.cardNumber,
    cardName: postDataCard.cardName,
    cardMonth: postDataCard.cardName,
    cardYear: postDataCard.cardYear,
    cardCVC: postDataCard.cardCVC,
    orderDate: new Date(),
    orderDetails: GetCart,
    orderAddresses: [postDataAddress],
  };

  useEffect(() => {
    const checkValidNumber = () => {
      const checkValid = phoneInput.current?.isValidNumber(phoneNumber);
      setValid(checkValid ? checkValid : false);
    };

    checkValidNumber();
  }, [phoneNumber]);

  const handleInputChange = (key: any, value: any) => {
    setPostDataAddress({
      ...postDataAddress,
      [key]: value,
    });
  };

  const handleInputChangePost = (key: any, value: any) => {
    setPostDataCard({
      ...postDataCard,
      [key]: value,
    });
  };

  const sendPayment = () => {
    if (
      postDataCard.cardNumber === '' ||
      postDataCard.cardName === '' ||
      postDataCard.cardMonth === '' ||
      postDataCard.cardYear === '' ||
      postDataCard.cardCvc === '' ||
      postDataAddress.name === '' ||
      postDataAddress.surName === '' ||
      postDataAddress.email === '' ||
      postDataAddress.phone === '' ||
      postDataAddress.country === '' ||
      postDataAddress.city === '' ||
      postDataAddress.districtName === '' ||
      postDataAddress.adressDescription === ''
    ) {
      Alert.alert('Please fill all fields');
    } else {
      if (valid) {
        axios
          .post(API_ENDPOINT + '/Order', postData)
          .then(res => {
            if (res.status === 200) {
              Alert.alert('Payment has been successfully implemented');
              setPostDataCard({
                cardNumber: '',
                cardName: '',
                cardMonth: '',
                cardYear: 0,
                cardCVC: 0,
              });
              setPostDataAddress({
                userId: 0,
                name: '',
                surName: '',
                email: '',
                phone: '',
                country: '',
                city: '',
                districtName: '',
                adressDescription: '',
              });

              const fetchCartCount = async () => {
                const deviceUniqueId = await DeviceInfo.getUniqueId();
                axios
                  .delete(
                    API_ENDPOINT +
                      '/Order/deleteByUniqueId?id=' +
                      deviceUniqueId,
                  )
                  .then(responseDelete => {
                    console.log(responseDelete);
                  })
                  .catch(err => console.log(err.response));
              };
              fetchCartCount();

              setTimeout(() => {
                navigation.navigate('CartScreen');
              }, 2000);
            }
          })
          .catch(err => console.log(err.response));
      } else {
        Alert.alert('Please check your phone number. Number must valid');
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView>
        <View>
          <Text style={styles.addAddress}>Add an Address</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              onChangeText={text => handleInputChange('name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Surname"
              onChangeText={text => handleInputChange('surName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={text => handleInputChange('email', text)}
            />
            <View>
              <PhoneInput
                ref={phoneInput}
                defaultValue={phoneNumber}
                defaultCode="AZ"
                onChangeText={text => setPhoneNumber(text)}
                onChangeFormattedText={text => {
                  handleInputChange('phone', text);
                }}
                withShadow
                containerStyle={{
                  borderRadius: 15,
                  width: '100%',
                  height: 75,
                  marginBottom: 20,
                }}
              />
              {phoneNumber.length > 1 && (
                <Text style={valid ? styles.succesMsg : styles.errMsg}>
                  {valid ? 'Valid Number' : 'Invalid Number'}
                </Text>
              )}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Country"
              onChangeText={text => handleInputChange('country', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="City"
              onChangeText={text => handleInputChange('city', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="DistrictName"
              onChangeText={text => handleInputChange('districtName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Open Address"
              onChangeText={text =>
                handleInputChange('adressDescription', text)
              }
            />
            <View>
              <Text style={styles.addAddress}>
                Please fill your Card informations for payment
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                onChangeText={text => handleInputChangePost('cardNumber', text)}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Card Name"
                onChangeText={text => handleInputChangePost('cardName', text)}
              />
              <View style={styles.inputFlexContainer}>
                <View style={styles.inputFlex}>
                  <Text style={styles.inputText}>Card Month</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="12"
                    onChangeText={text =>
                      handleInputChangePost('cardMonth', text)
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputFlex}>
                  <Text style={styles.inputText}>Card Year</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="24"
                    onChangeText={text =>
                      handleInputChangePost('cardYear', text)
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputFlex}>
                  <Text style={styles.inputText}>CVC</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="333"
                    onChangeText={text =>
                      handleInputChangePost('cardCVC', text)
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => sendPayment()}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: 10,
    marginTop: 30,
  },
  editAddress: {
    paddingTop: 40,
    paddingBottom: 60,
  },
  addAddress: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    width: '100%',
    height: 60,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    paddingLeft: 20,
    borderRadius: 10,
  },
  inputFlexContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  inputFlex: {
    width: '31%',
  },
  inputText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  succesMsg: {
    color: 'green',
    textAlign: 'center',
    paddingBottom: 20,
  },
  errMsg: {
    color: 'red',
    textAlign: 'center',
    paddingBottom: 20,
  },
  button: {
    height: 55,
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
});

export default PaymentByGuest;
