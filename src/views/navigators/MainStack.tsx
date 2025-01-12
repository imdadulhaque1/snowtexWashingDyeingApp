import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomNavigator from './BottomNavigator';
import LoginScreen from '@views/auth/LoginScreen';
import {useAppContext} from '@contextApi/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {COLORS} from '@utils/COLORS';
import SidebarStack from './SidebarStack';

interface Props {}

const MainStack: FC<Props> = props => {
  const isFocused = useIsFocused();
  const Stack = createNativeStackNavigator();
  const {getLoginInfo, setLoginInfo, setAccessableInfo, getAccessableInfo} =
    useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  const getUserInfoResult = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('AsyncUserInfo');

      if (userInfoString !== null) {
        const userInfoObj = JSON.parse(userInfoString);

        setAccessableInfo(userInfoObj);
        setLoginInfo(userInfoObj);
      }
    } catch (error) {
      console.error('Error retrieving LoginResult:', error);
    } finally {
      setIsLoading(false); // Stop loading once token is checked
    }
  };

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      // appInfo();
      getUserInfoResult();
    }
  }, [isFocused]);

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={COLORS.snowColor} />
        </View>
      ) : (
        <Stack.Navigator
          initialRouteName={
            getAccessableInfo?.loginInfo?.remarks ? 'Sidebar' : 'LoginScreen'
          }
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="Sidebar" component={SidebarStack} />
        </Stack.Navigator>
      )}
    </View>
  );
};

export default MainStack;
