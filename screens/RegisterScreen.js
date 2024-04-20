import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useAuth} from '../context/AuthContext';

const RegisterScreen = ({navigation}) => {
  const {onRegister} = useAuth();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailError, setShowEmailError] = useState('');
  const [showPasswordError, setShowPasswordError] = useState('');
  const [showSuccesMsg, setShowSuccesMsg] = useState('');

  const register = async () => {
    const result = await onRegister(userName, email, password);

    if (result.error) {
      if (
        !result?.msg?.errors?.hasOwnProperty('Email') &&
        !result?.msg?.errors?.hasOwnProperty('Password')
      ) {
        Alert.alert(result.msg);
      }
      if (result?.msg?.errors?.hasOwnProperty('Email')) {
        setShowEmailError(result?.msg?.errors?.Email[0]);
      }
      if (result?.msg?.errors?.hasOwnProperty('Password')) {
        setShowPasswordError(result?.msg?.errors?.Password[0]);
      }
      setTimeout(() => {
        setShowEmailError(' ');
        setShowPasswordError(' ');
      }, 3000);
    }

    if (result.status === 200) {
      setShowSuccesMsg('Succesfully Registred');

      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);

      setUserName('');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <View style={styles.container}>
      {showEmailError.length > 0 && (
        <View>
          <Text style={styles.emailErr}>{showEmailError}</Text>
        </View>
      )}
      {showPasswordError.length > 0 && (
        <View>
          <Text style={styles.emailErr}>{showPasswordError}</Text>
        </View>
      )}
      <Text style={styles.title}>Register</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="User Name"
          onChangeText={text => setUserName(text)}
          value={userName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          value={password}
        />
        <TouchableOpacity style={styles.button} onPress={register}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        {showSuccesMsg.length > 0 && (
          <View>
            <Text style={styles.succesMsg}>{showSuccesMsg}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 35,
    marginBottom: 20,
  },
  form: {
    width: '100%',
    paddingLeft: 30,
    paddingRight: 30,
  },
  input: {
    width: '100%',
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    paddingLeft: 20,
    borderRadius: 10,
  },
  button: {
    height: 45,
    backgroundColor: 'red',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
  },
  createText: {
    marginTop: 20,
    fontSize: 20,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
    textAlign: 'right',
  },
  succesMsg: {
    marginTop: 20,
    textAlign: 'center',
    color: 'green',
  },
  emailErr: {
    color: 'red',
    marginBottom: 10,
  },
});

export default RegisterScreen;
