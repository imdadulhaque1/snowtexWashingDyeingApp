import {Dimensions, StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import {Divider} from 'react-native-paper';
import {Text} from 'react-native';
import {COLORS} from '@utils/COLORS';
import MCIcon from './icon/MCIcon';

interface Props {
  title?: string;
  isComplete?: boolean;
  isActive?: boolean;
  bgColor?: any;
  borderWidth?: number;
  borderColor?: any;
  isNext?: boolean;
  height?: number | any;
  nextColor?: any;
  nextWidth?: number | any;
  nextHeight?: number | any;
}

const Progressbar: FC<Props> = props => {
  const {
    title,
    isComplete,
    isActive,
    bgColor,
    borderWidth,
    borderColor,
    isNext,
    height,
    nextColor,
    nextWidth,
    nextHeight,
  } = props;
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: borderWidth,
            borderColor: borderColor,
            borderRadius: height / 2,
            height: height,
            width: height,
            backgroundColor: isComplete ? COLORS.snowColor : COLORS.white,
          }}>
          {isComplete ? (
            <MCIcon size={15} color={COLORS.white} name="check" />
          ) : (
            <MCIcon size={15} color={COLORS.errorLight90} name="close" />
          )}
        </View>

        {isNext && (
          <Divider
            style={{
              backgroundColor: nextColor,
              height: nextHeight,
              width: nextWidth,
            }}
          />
        )}
      </View>
      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
        <Text style={styles.txtStyle}>{title}</Text>
      </View>
    </View>
  );
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  txtStyle: {
    fontSize: screenWidth > 550 ? screenWidth / 45 : screenWidth / 40,
    color: COLORS.black,
    fontFamily: 'WorkSans-Regular',
  },
});

export default Progressbar;
