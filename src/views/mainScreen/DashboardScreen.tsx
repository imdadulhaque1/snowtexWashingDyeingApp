import {StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {useAppContext} from '@contextApi/index';
import Container from '@components/Container';

interface Props {}

const DashboardScreen: FC<Props> = props => {
  const {getAccessableInfo} = useAppContext();

  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.textStyle}>Welcome to</Text>
        <Text style={[styles.textStyle, {fontFamily: 'WorkSans-Medium'}]}>
          {getAccessableInfo?.userInfo?.Company
            ? getAccessableInfo?.userInfo?.Company
            : 'Snowtex Group'}
        </Text>
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
    fontFamily: 'WorkSans-Regular',
  },
});

export default DashboardScreen;
