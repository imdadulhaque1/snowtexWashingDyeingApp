import {COLORS} from '@utils/COLORS';
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';

const screenWidth = Dimensions.get('window').width;

const RowSkeleton = () => {
  const itemWidth = screenWidth - 40;
  const itemHeight = screenWidth > 550 ? 45 : 35;

  return (
    <View style={styles.rowContainer}>
      <Skeleton
        isLoading={true}
        layout={[
          {
            key: 'SL',
            width: itemWidth,
            height: itemHeight,
            marginBottom: 10,
            borderRadius: 4,
          },
          {
            key: 'workingDate',
            width: itemWidth,
            height: itemHeight,
            marginBottom: 10,
            borderRadius: 4,
          },
          {
            key: 'shiftInfo',
            width: itemWidth,
            height: itemHeight,
            marginBottom: 10,
            borderRadius: 4,
          },
          {
            key: 'lunchInfo',
            width: itemWidth,
            height: itemHeight,
            marginBottom: 10,
            borderRadius: 4,
          },
          {
            key: 'leave',
            width: itemWidth,
            height: itemHeight,
            marginBottom: 10,
            borderRadius: 4,
          },
          {
            key: 'sick',
            width: itemWidth,
            height: itemHeight,
            marginBottom: 10,
            borderRadius: 4,
          },
        ]}
      />
    </View>
  );
};

const AttendanceInfoSkeleton = () => {
  return (
    <View style={styles.skeletonContainer}>
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    padding: 10,
    backgroundColor: COLORS.snowDeepTxtColor,
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default AttendanceInfoSkeleton;
