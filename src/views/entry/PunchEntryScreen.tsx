import {StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import Container from '@components/Container';

interface Props {}

const PunchEntryScreen: FC<Props> = props => {
  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.textStyle}>Punch Entry Screen</Text>
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

export default PunchEntryScreen;
