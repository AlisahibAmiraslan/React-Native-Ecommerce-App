/* eslint-disable dot-notation */
/* eslint-disable react/react-in-jsx-scope */
import {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_ENDPOINT} from '@env';

interface AuthProps {
  authState?: {token: string | null; authenticated: boolean | null};
  user?: {
    id: number | null;
    userName: string | null;
    userRole: string | null;
    email: string | null;
  };
  onRegister?: (
    userName: string,
    email: string,
    password: string,
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogOut?: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';
export const API_URL = API_ENDPOINT;
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  const [user, setUser] = useState<{
    id: number | null;
    userName: string | null;
    userRole: string | null;
    email: string | null;
  }>({
    id: null,
    userName: null,
    userRole: null,
    email: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const userInfoStorage: any = await AsyncStorage.getItem('user');

      const userInfo = JSON.parse(userInfoStorage);

      console.log('stored:', token);

      console.log('user:', userInfo);

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setAuthState({
          token: token,
          authenticated: true,
        });

        setUser({
          id: userInfo?.id,
          userName: userInfo?.userName,
          userRole: userInfo?.userRole,
          email: userInfo?.email,
        });
      }
    };

    loadToken();
  }, []);

  const register = async (
    userName: string,
    email: string,
    password: string,
  ) => {
    try {
      return await axios.post(`${API_URL}/Auth/register`, {
        userName,
        email,
        password,
      });
    } catch (err) {
      return {error: true, msg: (err as any).response.data};
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/Auth/login`, {
        email,
        password,
      });

      setAuthState({
        token: result.data.token,
        authenticated: true,
      });

      setUser({
        id: result.data.dbUser.id,
        userName: result.data.dbUser.userName,
        userRole: result.data.dbUser.userRole,
        email: result.data.dbUser.email,
      });

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${result.data.token}`;

      if (result.data) {
        await AsyncStorage.setItem(TOKEN_KEY, result.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(result.data.dbUser));
      }

      console.log('User is logged in');

      return result;
    } catch (err: any) {
      return {error: true, msg: (err as any).response.data};
    }
  };

  const logout = async () => {
    // Delete token from storage
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem('user');
    console.log('user is logged out');

    // Update HTTP Headers
    axios.defaults.headers.common['Authorization'] = '';

    // Reset auth state
    setAuthState({
      token: null,
      authenticated: false,
    });

    setUser({
      id: null,
      userName: null,
      userRole: null,
      email: null,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogOut: logout,
    authState,
    user,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
