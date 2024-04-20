/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import {API_ENDPOINT} from '@env';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import PhoneInput from 'react-native-phone-number-input';
import {useIsFocused} from '@react-navigation/native';

const MyAddress = () => {
  const {user} = useAuth();
  const isFocused = useIsFocused();
  const phoneInput = useRef<PhoneInput>(null);
  const [GetMyAddress, setGetMyAddress] = useState<any>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [valid, setValid] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState<boolean>(false);
  const [FindId, setFindId] = useState<number>(0);
  const [postData, setPostData] = useState({
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

  const handleInputChange = (key: any, value: any) => {
    setPostData({
      ...postData,
      [key]: value,
    });

    setUpdatePostData({
      ...UpdatePostData,
      [key]: value,
    });
  };

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

  const sendAddress = () => {
    if (
      postData.name === '' ||
      postData.surName === '' ||
      postData.email === '' ||
      postData.phone === '' ||
      postData.country === '' ||
      postData.city === '' ||
      postData.districtName === '' ||
      postData.adressDescription === ''
    ) {
      Alert.alert('Please fill all fields');
    } else {
      if (valid) {
        axios
          .post(API_ENDPOINT + '/Address', postData)
          .then(res => {
            if (res.status === 200) {
              Alert.alert('Address successfully added !');
              getAdress();
              setPostData({
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
            }
          })
          .catch(err => console.log(err));
      } else {
        Alert.alert('Please check your phone number. Number must valid');
      }
    }
  };

  const deleteAddress = () => {
    axios
      .delete(API_ENDPOINT + '/Address/' + FindId)
      .then(res => {
        if (res.status === 200) {
          Alert.alert('Address successfully deleted !');
          getAdress();
          setModalVisible(false);
        }
      })
      .catch(err => console.log(err));
  };

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

  return (
    <View style={styles.container}>
      <ScrollView>
        {GetMyAddress.length > 0 && (
          <View>
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
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          setModalVisible(true);
                          setFindId(item.id);
                        }}>
                        <Text style={styles.delete}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
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

        {/* delete address modal */}
        <Modal animationType="slide" visible={modalVisible} transparent>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
            <View
              style={{
                width: '100%',
                display: 'flex',
                padding: 40,
                height: 200,
                backgroundColor: 'white',
              }}>
              <Text style={styles.availableOpenAddress}>
                Do you want Delete your Address?
              </Text>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  paddingTop: 30,
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity onPress={() => deleteAddress()}>
                  <Text style={styles.delete}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.edit}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* delete address modal */}

        {GetMyAddress.length < 1 && (
          <View style={styles.noAddress}>
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
              <TouchableOpacity
                style={styles.button}
                onPress={() => sendAddress()}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
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
});

export default MyAddress;
