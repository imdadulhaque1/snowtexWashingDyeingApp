import {COLORS} from '@utils/COLORS';
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';

const screenWidth = Dimensions.get('window').width;

const ProductSkeleton = () => {
  const itemWidth = screenWidth > 550 ? screenWidth / 3.5 : screenWidth / 2.5;
  // const itemWidth = (screenWidth - 40) / 2;

  return (
    <Skeleton
      containerStyle={styles.skeletonContainer}
      isLoading={true}
      layout={[
        {
          key: 'image',
          width: itemWidth,
          height: screenWidth > 550 ? screenWidth / 9 : screenWidth / 5,
          marginBottom: 10,
          borderRadius: 8,
        },
        {
          key: 'title',
          width: itemWidth - 20,
          height: screenWidth > 550 ? screenWidth / 16 : screenWidth / 12,
          marginBottom: 8,
          borderRadius: 4,
        },
        {
          key: 'button',
          width: itemWidth,
          height: screenWidth > 550 ? screenWidth / 12 : screenWidth / 9,
          borderRadius: 10,
        },
      ]}
    />
  );
};

const TreeReqSkeleton = () => {
  return (
    <>
      {screenWidth > 550 ? (
        <View style={styles.grid}>
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </View>
      ) : (
        <View style={styles.grid}>
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    marginBottom: 10,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.snowLight100,
  },
  grid: {
    marginTop: 7,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TreeReqSkeleton;
