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
  Modal,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {API_ENDPOINT} from '@env';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useAuth} from '../../context/AuthContext';

const PaymentByUser = () => {
  const navigation: any = useNavigation();
  const {user} = useAuth();
  const isFocused = useIsFocused();

  const phoneInput = useRef<PhoneInput>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [GetMyAddress, setGetMyAddress] = useState<any>([]);
  const [valid, setValid] = useState<boolean>(false);
  const [GetCart, setGetCart] = useState([]);
  const [modalVisibleEdit, setModalVisibleEdit] = useState<boolean>(false);
  const [_, setFindId] = useState<number>(0);

  const [postDataAddress, setPostDataAddress] = useState<any>({
    userId: user?.id,
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

  const [UpdatePostData, setUpdatePostData] = useState({
    id: '',
    userId: user?.id,
    name: '',
    surName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    districtName: '',
    adressDescription: '',
  });

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

  useEffect(() => {
    axios
      .get(API_ENDPOINT + '/Address/getAddressByUser?userId=' + user?.id)
      .then(res => setGetMyAddress(res.data))
      .catch(err => console.log(err));

    const checkValidNumber = () => {
      const checkValid = phoneInput.current?.isValidNumber(phoneNumber);
      setValid(checkValid ? checkValid : false);
    };

    checkValidNumber();
  }, [user?.id, phoneNumber, isFocused]);

  const getAdress = () => {
    axios
      .get(API_ENDPOINT + '/Address/getAddressByUser?userId=' + user?.id)
      .then(res => setGetMyAddress(res.data))
      .catch(err => console.log(err));
  };

  const handleInputChangeAddress = (key: any, value: any) => {
    setPostDataAddress({
      ...postDataAddress,
      [key]: value,
    });
  };

  const handleInputChange = (key: any, value: any) => {
    setUpdatePostData({
      ...UpdatePostData,
      [key]: value,
    });
  };

  const handleInputChangePost = (key: any, value: any) => {
    setPostDataCard({
      ...postDataCard,
      [key]: value,
    });
  };
  console.log(postDataCard);

  const updateAddress = (
    id: number,
    name: string,
    surName: string,
    email: string,
    phone: string,
    country: string,
    city: string,
    districtName: string,
    adressDescription: string,
  ) => {
    setUpdatePostData((prev: any) => {
      return {
        ...prev,
        id: id,
        name: name,
        surName: surName,
        email: email,
        phone: phone,
        country: country,
        city: city,
        districtName: districtName,
        adressDescription: adressDescription,
      };
    });
  };

  const sendUpdateAddress = () => {
    axios
      .put(API_ENDPOINT + '/Address', UpdatePostData)
      .then(res => {
        if (res.status === 200) {
          Alert.alert('Address successfully updated !');
          setModalVisibleEdit(false);
          getAdress();
        }
      })
      .catch(err => console.log(err));
  };

  // payment
  const postDataPayment: any = {
    userId: user?.id,
    cardNumber: postDataCard.cardNumber,
    cardName: postDataCard.cardName,
    cardMonth: postDataCard.cardName,
    cardYear: postDataCard.cardYear,
    cardCVC: postDataCard.cardCVC,
    orderDate: new Date(),
    orderDetails: GetCart,
    orderAddresses: GetMyAddress.length > 0 ? GetMyAddress : [postDataAddress],
  };

  // payment with if you have address in your address page
  const sendPaymentWithAddress = () => {
    if (
      postDataCard.cardNumber === '' ||
      postDataCard.cardName === '' ||
      postDataCard.cardMonth === '' ||
      postDataCard.cardYear === '' ||
      postDataCard.cardCVC === ''
    ) {
      Alert.alert('Please fill all fields');
    } else {
      axios
        .post(API_ENDPOINT + '/Order', postDataPayment)
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
            const fetchCartCount = async () => {
              const deviceUniqueId = await DeviceInfo.getUniqueId();
              axios
                .delete(
                  API_ENDPOINT + '/Order/deleteByUniqueId?id=' + deviceUniqueId,
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
    }
  };

  const sendPaymentWithoutAddress = () => {
    if (
      postDataCard.cardNumber === '' ||
      postDataCard.cardName === '' ||
      postDataCard.cardMonth === '' ||
      postDataCard.cardYear === '' ||
      postDataCard.cardCVC === '' ||
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
          .post(API_ENDPOINT + '/Order', postDataPayment)
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
                userId: user?.id,
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
    <View style={styles.container}>
      <ScrollView>
        {/* if you have address */}
        {GetMyAddress.length > 0 && (
          <View>
            <View>
              <Text style={styles.addressText}>Address</Text>
              {GetMyAddress.map((item: any, index: number) => {
                return (
                  <View key={index} style={styles.availableAddress}>
                    <Text>
                      {item.name} {item.surName}
                    </Text>
                    <Text style={styles.availableOpenAddress}>
                      {item.adressDescription}
                    </Text>
                    <Text>
                      {item.city} / {item.country}
                    </Text>
                    <View style={styles.arrange}>
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            setModalVisibleEdit(true);
                            setFindId(item.id);
                            updateAddress(
                              item.id,
                              item.name,
                              item.surName,
                              item.email,
                              item.phone,
                              item.country,
                              item.city,
                              item.districtName,
                              item.adressDescription,
                            );
                          }}>
                          <Text style={styles.edit}>Edit</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
            {/* card  */}
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
                onPress={() => sendPaymentWithAddress()}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* edit adress modal */}
        <Modal animationType="slide" visible={modalVisibleEdit}>
          <View>
            <ScrollView>
              <View style={styles.editAddress}>
                <TouchableOpacity onPress={() => setModalVisibleEdit(false)}>
                  <Text style={styles.editClose}>Close</Text>
                </TouchableOpacity>
                <Text style={styles.addAddress}>Edit Your Address</Text>
                <View style={styles.form}>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={UpdatePostData.name ? UpdatePostData.name : ''}
                    onChangeText={text => handleInputChange('name', text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Surname"
                    value={UpdatePostData.surName ? UpdatePostData.surName : ''}
                    onChangeText={text => handleInputChange('surName', text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={UpdatePostData.email ? UpdatePostData.email : ''}
                    onChangeText={text => handleInputChange('email', text)}
                  />
                  <View>
                    <TextInput
                      style={styles.input}
                      placeholder="Phone"
                      value={UpdatePostData.phone ? UpdatePostData.phone : ''}
                      onChangeText={text => handleInputChange('phone', text)}
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Country"
                    value={UpdatePostData.country ? UpdatePostData.country : ''}
                    onChangeText={text => handleInputChange('country', text)}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="City"
                    value={UpdatePostData.city ? UpdatePostData.city : ''}
                    onChangeText={text => handleInputChange('city', text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="DistrictName"
                    value={
                      UpdatePostData.districtName
                        ? UpdatePostData.districtName
                        : ''
                    }
                    onChangeText={text =>
                      handleInputChange('districtName', text)
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Open Address"
                    value={
                      UpdatePostData.adressDescription
                        ? UpdatePostData.adressDescription
                        : ''
                    }
                    onChangeText={text =>
                      handleInputChange('adressDescription', text)
                    }
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => sendUpdateAddress()}>
                    <Text style={styles.buttonText}>Edit Your Address</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
        {/* edit adress modal */}

        {/* if you don't have address */}
        {GetMyAddress.length < 1 && (
          <View>
            <ScrollView>
              <View>
                <Text style={styles.addAddress}>Add an Address</Text>
                <View style={styles.form}>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    onChangeText={text =>
                      handleInputChangeAddress('name', text)
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Surname"
                    onChangeText={text =>
                      handleInputChangeAddress('surName', text)
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={text =>
                      handleInputChangeAddress('email', text)
                    }
                  />
                  <View>
                    <PhoneInput
                      ref={phoneInput}
                      defaultValue={phoneNumber}
                      defaultCode="AZ"
                      onChangeText={text => setPhoneNumber(text)}
                      onChangeFormattedText={text => {
                        handleInputChangeAddress('phone', text);
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
                    onChangeText={text =>
                      handleInputChangeAddress('country', text)
                    }
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="City"
                    onChangeText={text =>
                      handleInputChangeAddress('city', text)
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="DistrictName"
                    onChangeText={text =>
                      handleInputChangeAddress('districtName', text)
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Open Address"
                    onChangeText={text =>
                      handleInputChangeAddress('adressDescription', text)
                    }
                  />
                  <View>
                    <Text style={styles.addAddress}>
                      Please fill your Card informations for payment
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Card Number"
                      onChangeText={text =>
                        handleInputChangePost('cardNumber', text)
                      }
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Card Name"
                      onChangeText={text =>
                        handleInputChangePost('cardName', text)
                      }
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
                      onPress={() => sendPaymentWithoutAddress()}>
                      <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  addressText: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  availableAddress: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  availableOpenAddress: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  arrange: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'space-between',
  },
  edit: {
    color: 'blue',
    fontSize: 20,
    fontWeight: 'bold',
  },
  delete: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
  noAddress: {
    marginTop: 40,
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
    margin: 20,
  },
  form: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
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
  button: {
    height: 55,
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
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
  editClose: {
    textAlign: 'right',
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    paddingTop: 0,
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
});

export default PaymentByUser;
