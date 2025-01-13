import {Dimensions, StyleSheet, View} from 'react-native';
import React, {FC, useState} from 'react';
import {useAppContext} from '@contextApi/index';
import Container from '@components/Container';
import {COLORS} from '@utils/COLORS';
import ActivebarStatus from '@components/ActivebarStatus';
import LeaveHistoryScreen from './LeaveHistoryScreen';
import ApplicationFormScreen from './ApplicationFormScreen';
import LeaveBalanceScreen from './LeaveBalanceScreen';

interface Props {}

const LeaveInformationScreen: FC<Props> = props => {
  const {getAccessableInfo} = useAppContext();
  const [typeOf, setTypeOf] = useState({
    history: true,
    form: false,
    balance: false,
  });

  return (
    <Container>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: COLORS.white,
        }}>
        <ActivebarStatus
          title="Leave History"
          width={screenWidth > 550 ? '32.5%' : '32.8%'}
          bBottomLeftRadius={0}
          bBottomEndRadius={10}
          bgColor={typeOf?.history ? COLORS.snowLight70 : COLORS.snowColor}
          txtSize={screenWidth > 550 ? screenWidth / 35 : screenWidth / 28}
          txtColor={typeOf?.history ? COLORS.white : COLORS.black}
          onPress={() => {
            setTypeOf({
              history: true,
              form: false,
              balance: false,
            });
          }}
        />
        <ActivebarStatus
          title="Application Form"
          width={screenWidth > 550 ? '32.5%' : '32.8%'}
          bBottomLeftRadius={10}
          bBottomEndRadius={10}
          bgColor={typeOf?.form ? COLORS.snowLight70 : COLORS.snowColor}
          txtSize={screenWidth > 550 ? screenWidth / 35 : screenWidth / 28}
          txtColor={typeOf?.form ? COLORS.white : COLORS.black}
          onPress={() => {
            setTypeOf({
              history: false,
              form: true,
              balance: false,
            });
          }}
        />
        <ActivebarStatus
          title="Leave Balance"
          width={screenWidth > 550 ? '32.5%' : '32.8%'}
          bBottomLeftRadius={10}
          bBottomEndRadius={0}
          bgColor={typeOf?.balance ? COLORS.snowLight70 : COLORS.snowColor}
          txtColor={typeOf?.balance ? COLORS.white : COLORS.black}
          txtSize={screenWidth > 550 ? screenWidth / 35 : screenWidth / 28}
          onPress={() => {
            setTypeOf({
              history: false,
              form: false,
              balance: true,
            });
          }}
        />
      </View>
      {typeOf.history && (
        <LeaveHistoryScreen getToken={getAccessableInfo?.loginInfo?.remarks} />
      )}
      {typeOf.form && (
        <ApplicationFormScreen
          getToken={getAccessableInfo?.loginInfo?.remarks}
        />
      )}
      {typeOf.balance && (
        <LeaveBalanceScreen getToken={getAccessableInfo?.loginInfo?.remarks} />
      )}
    </Container>
  );
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

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

export default LeaveInformationScreen;
