import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {API_ENDPOINT} from '@env';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';

type PasswordType = {
  id: number | null | undefined;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const ChangePassword = () => {
  const {user, authState, onLogOut} = useAuth();
  const [postData, setPostData] = useState<PasswordType>({
    id: user?.id,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleInputChange = (key: any, value: any) => {
    setPostData({
      ...postData,
      [key]: value,
    });
  };

  const ChangeMyPassword = () => {
    if (
      postData.currentPassword === '' ||
      postData.newPassword === '' ||
      postData.confirmNewPassword === ''
    ) {
      Alert.alert('Please fill all fields');
    } else {
      axios
        .post(API_ENDPOINT + '/Auth/change-password', postData, {
          headers: {Authorization: `Bearer ${authState?.token}`},
        })
        .then(res => {
          if (res.status === 200) {
            Alert.alert('Password successfully changed !');

            setPostData({
              id: 0,
              currentPassword: '',
              newPassword: '',
              confirmNewPassword: '',
            });

            if (onLogOut) {
              setTimeout(async () => {
                await onLogOut();
              }, 2000);
            }
          }
        })
        .catch(err => {
          Alert.alert('An error occurred:', err.response.data);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.text}>Change Your Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          onChangeText={text => handleInputChange('currentPassword', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          onChangeText={text => handleInputChange('newPassword', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm NewPassword"
          onChangeText={text => handleInputChange('confirmNewPassword', text)}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => ChangeMyPassword()}>
          <Text style={styles.buttonText}>Change Your Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    padding: 30,
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
});

export default ChangePassword;
