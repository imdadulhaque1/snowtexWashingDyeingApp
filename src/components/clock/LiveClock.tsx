import {COLORS} from '@utils/COLORS';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

const LiveClock = () => {
  const [time, setTime] = useState(moment().format('h:mm:ss A'));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format('h:mm:ss A'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.clock}>{time} </Text>
    </View>
  );
};

const {width: screenWidth} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  clock: {
    fontSize: screenWidth > 550 ? screenWidth / 20 : screenWidth / 15,
    color: COLORS.snowColor,
    fontFamily: 'WorkSans-Bold',
    // fontFamily: 'WorkSans-Bold',
  },
});

export default LiveClock;
