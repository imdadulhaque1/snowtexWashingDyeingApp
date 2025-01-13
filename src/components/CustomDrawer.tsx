import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {FC, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import drawerStyle from '@utils/comStyle/drawerStyle';
import {useAppContext} from '@contextApi/index';
import {COLORS} from '@utils/COLORS';
import MyStatusBar from './statusBar/MyStatusBar';

const CustomDrawer = () => {
  const isFocused = useIsFocused();
  const {getLoginInfo, setAccessableInfo, getAccessableInfo} = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [menuId, setMenuId] = useState<number>();
  const [subMenuId, setSubMenuId] = useState<number>();
  const [subChildrenMenuId, setSubChildrenMenuId] = useState<number>();
  const [subChildrenFourMenuId, setSubChildrenFourMenuId] = useState<number>();
  const [leftIcon, setLeftIcon] = useState(false);

  let secondLayerBgColor = COLORS.snowDeep30;
  let thirdLayerBgColor = COLORS.snowDeep20;
  let forthLayerBgColor = COLORS.snowDeep10;

  const getUserInfoResult = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('AsyncUserInfo');

      if (userInfoString !== null) {
        const userInfoObj = JSON.parse(userInfoString);

        setAccessableInfo(userInfoObj);
      }
    } catch (error) {
      console.error('Error retrieving LoginResult:', error);
    }
  };

  useEffect(() => {
    if (
      !getAccessableInfo?.loginInfo ||
      !getAccessableInfo?.userInfo ||
      !getAccessableInfo?.menus
    ) {
      getUserInfoResult();
    }
  }, [
    !getAccessableInfo?.loginInfo,
    !getAccessableInfo?.userInfo,
    !getAccessableInfo?.menus,
  ]);

  const logoutHandler = async () => {
    await AsyncStorage.removeItem('AsyncUserInfo');

    // setLoginInfo(null);
    navigation.reset({
      // @ts-ignore
      routes: [{name: 'LoginScreen'}],
    });
  };

  return (
    <SafeAreaView style={{backgroundColor: COLORS.snowColor}}>
      <MyStatusBar
        backgroundColor={COLORS.snowColor}
        barStyle="light-content"
      />
      <View
        style={{
          height: '100%',
        }}>
        <View
          style={{
            justifyContent: 'center',
            marginVertical: width > 550 ? 20 : 10,
          }}>
          <Image
            style={{
              resizeMode: 'stretch',
              height: width > 550 ? width / 6 : width / 4.5,
              width: width > 550 ? width / 6 : width / 4.5,
              alignSelf: 'center',
            }}
            source={require('../assets/images/snowtexPayroll.jpg')}
          />
          <Text
            style={[
              drawerStyle.txtStyle,
              {
                textAlign: 'center',
                fontFamily: 'WorkSans-SemiBold',
                fontSize: width > 550 ? width / 30 : width / 22,
              },
            ]}>
            {getAccessableInfo?.userInfo?.Company
              ? getAccessableInfo?.userInfo?.Company
              : 'Snowtex Group'}
          </Text>
          <Text
            style={[
              drawerStyle.txtStyle,
              {
                textAlign: 'center',
                fontFamily: 'WorkSans-Medium',
                fontSize: width > 550 ? width / 30 : width / 22,
              },
            ]}>
            Version: {1.0}
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: COLORS.snowColor,
            }}>
            {getAccessableInfo?.menus &&
              getAccessableInfo?.menus?.length > 0 &&
              getAccessableInfo?.menus?.map((route: any, index: number) => {
                return (
                  <View key={index}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        console.log('route?.Name: ', route?.Name);

                        route?.Id === menuId
                          ? setMenuId(undefined)
                          : setMenuId(route?.Id);
                        setSubMenuId(undefined);
                        setSubChildrenMenuId(undefined);
                        setSubChildrenFourMenuId(undefined);
                        // updateCheckHandler();
                        route?.DataList.length === 0 &&
                          //@ts-ignore
                          navigation.navigate(route?.Name);
                        // navigation.navigate(route?.Name?.trim());
                      }}
                      style={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: COLORS.snowLight60,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: COLORS.snowDeep40,
                        paddingVertical:
                          width > 650
                            ? width / 55
                            : width > 550 && width <= 650
                            ? width / 50
                            : width / 40, //!----->First layer,
                        // paddingVertical: 10,
                        paddingHorizontal: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        {leftIcon && (
                          <Icon
                            name={
                              menuId === route?.Id
                                ? 'checkbox-outline'
                                : 'checkbox-blank-outline'
                            }
                            size={20}
                            color={COLORS.white}
                          />
                        )}
                        <Text style={drawerStyle.txtStyle}>{route?.Name}</Text>
                      </View>
                      {route.DataList.length !== 0 && (
                        <MaterialIcon
                          name={
                            menuId === route?.Id
                              ? 'keyboard-arrow-down'
                              : 'keyboard-arrow-left'
                          }
                          size={20}
                          color={COLORS.white}
                        />
                      )}
                    </TouchableOpacity>
                    {menuId === route?.Id &&
                      route?.DataList &&
                      route?.DataList.map((item: any, index: number) => {
                        return (
                          <View key={index}>
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => {
                                item?.Id === subMenuId
                                  ? setSubMenuId(undefined)
                                  : setSubMenuId(item?.Id);
                                setSubChildrenMenuId(undefined);
                                setSubChildrenFourMenuId(undefined);
                                item?.DataList.length === 0 &&
                                  //@ts-ignore
                                  navigation.navigate(item?.Name);
                                // navigation.navigate(item?.Name);
                              }}
                              style={{
                                borderBottomWidth: 0.5,
                                borderBottomColor: COLORS.snowLight60,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                backgroundColor: secondLayerBgColor,
                                paddingVertical:
                                  width > 650
                                    ? width / 55
                                    : width > 550 && width <= 650
                                    ? width / 50
                                    : width / 40, //!----->Second layer
                                paddingLeft: 25,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                {leftIcon && (
                                  <Icon
                                    name={
                                      subMenuId === item?.Id
                                        ? 'checkbox-outline'
                                        : 'checkbox-blank-outline'
                                    }
                                    size={20}
                                    color={COLORS.white}
                                  />
                                )}
                                <Text style={drawerStyle.txtStyle}>
                                  {item.Name}
                                </Text>
                              </View>
                              {item.DataList.length !== 0 && (
                                <MaterialIcon
                                  name={
                                    subMenuId === item?.Id
                                      ? 'keyboard-arrow-down'
                                      : 'keyboard-arrow-left'
                                  }
                                  size={20}
                                  color={COLORS.white}
                                  style={{paddingRight: 10}}
                                />
                              )}
                            </TouchableOpacity>
                            {subMenuId === item?.Id &&
                              item?.DataList &&
                              item?.DataList.map(
                                (subChildrenItem: any, index: number) => {
                                  return (
                                    <View key={index}>
                                      <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                          subChildrenItem?.Id ===
                                          subChildrenMenuId
                                            ? setSubChildrenMenuId(undefined)
                                            : setSubChildrenMenuId(
                                                subChildrenItem?.Id,
                                              );
                                          setSubChildrenFourMenuId(undefined);

                                          subChildrenItem?.DataList.length ===
                                            0 &&
                                            //@ts-ignore
                                            navigation.navigate(
                                              // @ts-ignore
                                              subChildrenItem?.Name,
                                            );
                                        }}
                                        style={{
                                          borderBottomWidth: 0.5,
                                          borderBottomColor: COLORS.snowLight60,
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          backgroundColor: thirdLayerBgColor,
                                          paddingVertical:
                                            width > 650
                                              ? width / 55
                                              : width > 550 && width <= 650
                                              ? width / 50
                                              : width / 40, //!----->Third layer,
                                          paddingLeft: 35,
                                        }}>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                          }}>
                                          {leftIcon && (
                                            <Icon
                                              name={
                                                subChildrenMenuId ===
                                                subChildrenItem?.Id
                                                  ? 'checkbox-outline'
                                                  : 'checkbox-blank-outline'
                                              }
                                              size={20}
                                              color={COLORS.white}
                                            />
                                          )}
                                          <Text style={drawerStyle.txtStyle}>
                                            {subChildrenItem.Name}
                                          </Text>
                                        </View>
                                        {subChildrenItem.DataList.length !==
                                          0 && (
                                          <MaterialIcon
                                            name={
                                              subChildrenMenuId ===
                                              subChildrenItem?.Id
                                                ? 'keyboard-arrow-down'
                                                : 'keyboard-arrow-left'
                                            }
                                            size={20}
                                            color={COLORS.white}
                                            style={{paddingRight: 10}}
                                          />
                                        )}
                                      </TouchableOpacity>
                                      {subChildrenMenuId ===
                                        subChildrenItem?.Id &&
                                        subChildrenItem?.DataList &&
                                        subChildrenItem?.DataList.map(
                                          (
                                            subChildrenThreeItem: any,
                                            index: number,
                                          ) => {
                                            return (
                                              <View key={index}>
                                                <TouchableOpacity
                                                  activeOpacity={0.8}
                                                  onPress={() => {
                                                    setSubChildrenFourMenuId(
                                                      subChildrenThreeItem?.Id,
                                                    );
                                                    navigation.navigate(
                                                      //@ts-ignore
                                                      subChildrenThreeItem?.Name,
                                                    );
                                                  }}
                                                  style={{
                                                    borderBottomWidth: 0.5,
                                                    borderBottomColor:
                                                      COLORS.snowLight60,
                                                    flexDirection: 'row',
                                                    justifyContent:
                                                      'space-between',
                                                    backgroundColor:
                                                      forthLayerBgColor,
                                                    paddingVertical:
                                                      width > 650
                                                        ? width / 55
                                                        : width > 550 &&
                                                          width <= 650
                                                        ? width / 50
                                                        : width / 40, //!----->Four layer,
                                                    paddingLeft: 35,
                                                  }}>
                                                  <View
                                                    style={{
                                                      flexDirection: 'row',
                                                      justifyContent:
                                                        'space-between',
                                                    }}>
                                                    {leftIcon && (
                                                      <Icon
                                                        name={
                                                          subChildrenFourMenuId ===
                                                          subChildrenThreeItem?.Id
                                                            ? 'checkbox-outline'
                                                            : 'checkbox-blank-outline'
                                                        }
                                                        size={20}
                                                        color={COLORS.white}
                                                      />
                                                    )}
                                                    <Text
                                                      style={{
                                                        color: COLORS.white,
                                                        fontSize: 12.5,
                                                      }}>
                                                      {
                                                        subChildrenThreeItem.Name
                                                      }
                                                    </Text>
                                                  </View>
                                                </TouchableOpacity>
                                              </View>
                                            );
                                          },
                                        )}
                                    </View>
                                  );
                                },
                              )}
                          </View>
                        );
                      })}
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </View>

      <Pressable style={styles.bottomBtnContainer} onPress={logoutHandler}>
        <Text style={styles.backToCompanyTxt}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
};
const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  bottomBtnContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.errorColor,
    paddingVertical: 8,
  },
  bottomInnerContainerStyle: {
    height: width > 650 ? width / 10 : width / 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10,0,21,.4)',
    flexDirection: 'row',
  },
  backToCompanyTxt: {
    color: COLORS.black,
    alignSelf: 'center',
    fontSize: width > 600 ? width / 30 : width / 22,
    fontFamily: 'WorkSans-Regular',
    marginLeft: 5,
  },
});

export default CustomDrawer;
