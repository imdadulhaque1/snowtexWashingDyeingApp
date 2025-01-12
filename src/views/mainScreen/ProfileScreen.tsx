import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {COLORS} from '@utils/COLORS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useAppContext} from '@contextApi/index';

interface Props {}

const ProfileScreen: FC<Props> = props => {
  const navigation = useNavigation();
  const {setLoginInfo} = useAppContext();

  const logoutHandler = async () => {
    await AsyncStorage.removeItem('AsyncUserInfo');

    setLoginInfo(null);
    navigation.reset({
      routes: [{name: 'LoginScreen'}],
    });
  };
  return (
    <View style={styles.container}>
      <Pressable
        onPress={logoutHandler}
        style={{
          backgroundColor: COLORS.errorColor,
          position: 'absolute',
          bottom: 10,
          width: '50%',
          paddingVertical: 7,
          borderRadius: 10,
        }}>
        <Text style={styles.textStyle}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 18,
    color: COLORS.white,
    fontFamily: 'WorkSans-Regular',
    textAlign: 'center',
  },
});

export default ProfileScreen;
