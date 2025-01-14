import {StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {COLORS} from '@utils/COLORS';
import Container from '@components/Container';

interface Props {}

const GeneralApprovalScreen: FC<Props> = props => {
  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.textStyle}>Under Developments....!</Text>
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
    color: COLORS.errorColor,
    fontFamily: 'WorkSans-Regular',
  },
});

export default GeneralApprovalScreen;
