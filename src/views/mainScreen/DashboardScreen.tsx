import {StyleSheet, Text, View} from 'react-native';
import React, {FC, useEffect} from 'react';
import {useAppContext} from '@contextApi/index';
import axios from 'axios';
import AppURL from '@restApi/AppURL';
import Container from '@components/Container';
import {fetchMenuItems} from '@utils/handler/fetchMenus';

interface Props {}

const DashboardScreen: FC<Props> = props => {
  const {getLoginInfo, setAccessableInfo, getAccessableInfo} = useAppContext();
  // console.log('getLoginInfo: ', JSON.stringify(getLoginInfo, null, 2));
  // console.log(
  //   'getAccessableInfo: ',
  //   JSON.stringify(getAccessableInfo, null, 2),
  // );

  // useEffect(() => {
  //   fetchMenuItems(getLoginInfo?.loginBaseURL, getLoginInfo?.remarks)
  //     .then(res => console.log('res: ', JSON.stringify(res, null, 2)))
  //     .catch(err => console.log('Erros: ', err));
  // }, []);

  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.textStyle}>Snowtex Washing Dyeing Ltd.</Text>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textStyle: {
    fontSize: 18,
    color: '#111111',
  },
});

export default DashboardScreen;
