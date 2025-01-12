import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {Appbar, Divider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {Text} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '@utils/COLORS';
import MCIcon from './icon/MCIcon';
// import CustomizedModal from './modal/CustomizedModal';
import {useAppContext} from '@contextApi/index';
import AppURL from '@restApi/AppURL';
import axios from 'axios';
// import {employeeInfoInterface} from '@src/interface/EmployeeInfoInterface';
// import {formatDate} from './comHandler/formatDate';
import profileStyle from '@utils/comStyle/profileStyle';
import NoInternetModal from './modal/NoInternetModal';
import VersionNumber from 'react-native-version-number';
import {removeApiSegment} from '@utils/handler/splitBaseUrlByAPI';
// import {versionCheckFunc} from './comHandler/versionCheckFunc';
const Container = ({children}: any) => {
  const isFocused = useIsFocused();
  const {getAccessableInfo, setAccessableInfo, getVersionInfo, setVersionInfo} =
    useAppContext();
  const navigation = useNavigation();
  const {name} = useRoute();
  const {bottom} = useSafeAreaInsets();
  let currentVersion = VersionNumber.appVersion;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [getModalStatus, setGetModalStatus] = useState('');

  const menuOptionsData = [
    {
      id: 1,
      label: 'My Profile',
      modalStatus: 'myProfile',
      labelIconName: 'account',
    },
    {
      id: 2,
      label: 'Notification',
      modalStatus: 'notification',
      labelIconName: 'bell',
    },
    {
      id: 3,
      label: 'Change Password',
      modalStatus: 'changePassword',
      labelIconName: 'lock',
    },
    {
      id: 4,
      label: 'Change Email',
      modalStatus: 'changeEmail',
      labelIconName: 'email-edit',
    },
  ];

  const logoutHandler = async () => {
    await AsyncStorage.removeItem('AsyncUserInfo');

    // setLoginInfo(null);
    navigation.reset({
      // @ts-ignore
      routes: [{name: 'LoginScreen'}],
    });
  };

  useEffect(() => {
    if (
      getAccessableInfo?.payrollLoginInfo?.Token &&
      !getAccessableInfo?.employeeInfo?.EmployeeID
    ) {
      getUserInfoFunc(getAccessableInfo?.payrollLoginInfo?.Token);
    }
  }, [getAccessableInfo?.payrollLoginInfo?.Token]);

  //TODO:==> Fetching User Info
  const getUserInfoFunc = async (userToken: any) => {
    try {
      const response = await axios.get(
        AppURL.getUserInfo(
          `${getAccessableInfo?.payrollBaseURL}/api/`,
          userToken,
        ),
      );
      let userInfo = await response.data;

      // setEmployeeInfo(userInfo);
      updateBalanceInAsyncStorage(userInfo);
    } catch (error) {
      // @ts-ignore
      console.log('getUserInfoFunc Error:', error.message);
    }
  };

  const retrieveAsyncStorageData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('AsyncAccessableInfo');

      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error retrieving AsyncStorage data:', e);
      return null;
    }
  };

  const updateBalanceInAsyncStorage = async (
    userInfo: employeeInfoInterface,
  ) => {
    try {
      let asyncStorageDataString = await AsyncStorage.getItem(
        'AsyncAccessableInfo',
      );
      // @ts-ignore
      let asyncStorageData = JSON.parse(asyncStorageDataString) || {};

      // Update accessableCompany without creating duplicates
      if (asyncStorageData) {
        asyncStorageData.employeeInfo = userInfo;

        await AsyncStorage.setItem(
          'AsyncAccessableInfo',
          JSON.stringify(asyncStorageData),
        );

        await setAccessableInfo((prevState: any) => ({
          ...prevState,
          employeeInfo: userInfo,
        }));

        console.log('Employee Info AsyncStorage updated successfully');
      } else {
        console.error('AsyncStorage data not found or could not be retrieved');
      }
    } catch (e) {
      console.error('Error updating AsyncStorage data:', e);
    }
  };

  useEffect(() => {
    isFocused && retrieveAsyncStorageData();
  }, [isFocused]);

  // useEffect(() => {
  //   versionCheckFunc(currentVersion)
  //     .then(res => setVersionInfo(res))
  //     .catch(error => error && setVersionInfo(null));
  // }, [isFocused, getVersionInfo]);

  const hideModal = () => {
    setIsModalVisible(false);
  };

  // const profileImg = null;
  const profileImg = `${removeApiSegment(
    getAccessableInfo.loginInfo?.loginBaseURL,
  )}${getAccessableInfo?.userInfo?.Photo}`;

  // const profileImg = `http://182.160.125.3:91/${getAccessableInfo?.userInfo?.Photo}`;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <Appbar
        style={[
          styles.bottom,
          {
            backgroundColor: COLORS.snowColor,
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          },
        ]}
        safeAreaInsets={{bottom}}>
        <Pressable
          onPress={() => {
            //@ts-ignore
            navigation.toggleDrawer();
          }}
          style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            // paddingHorizontal: 20,
          }}>
          <Icon
            name="menu"
            size={width > 550 ? width / 16 : width / 12}
            color={COLORS.white}
          />
        </Pressable>
        <Appbar.Content
          title={
            name?.trim()?.toLowerCase() === 'create tree requisitions'
              ? 'Create Tree Req.'
              : name?.trim()
          }
          titleStyle={{
            fontFamily: 'WorkSans-Regular',
            justifyContent: 'center',
            alignSelf: 'center',
            // left: '-1%',
          }}
          color={COLORS.white}
        />
        <Menu>
          <MenuTrigger>
            <View
              style={{
                borderRadius: 100,
                borderWidth: 2,
                borderColor: COLORS.white,
                justifyContent: 'center',
                alignItems: 'center',
                height: width > 550 ? width / 14.5 : width / 10.6,
                width: width > 550 ? width / 14.5 : width / 10.6,
              }}>
              {profileImg && (
                <Image
                  resizeMode="stretch"
                  // resizeMode="cover"
                  style={[
                    {
                      padding: 5,
                      height: width > 550 ? width / 16 : width / 12,
                      width: width > 550 ? width / 16 : width / 12,
                      borderRadius: 100,
                    },
                  ]}
                  source={{uri: profileImg}}
                  // source={require('../assets/images/FormalProfile.png')}
                />
              )}
            </View>
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                width: width > 650 ? width / 1.9 : width / 1.5,
                padding: 10,
                borderRadius: 10,
                backgroundColor: COLORS.snowColor,
              },
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  marginVertical: 10,
                  marginHorizontal: 10,
                  borderRadius: 60,
                  borderWidth: 2,
                  borderColor: COLORS.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: width > 550 ? width / 9.2 : width / 6.2,
                  width: width > 550 ? width / 9.2 : width / 6.2,
                }}>
                <Image
                  resizeMode="stretch"
                  style={[styles.imgStyle, {padding: 5}]}
                  //   source={{uri: profileImg}}
                  source={{uri: profileImg}}
                />
              </View>

              <View
                style={{
                  paddingHorizontal: 2,
                }}>
                <Text style={styles.menuText}>
                  {getAccessableInfo?.employeeInfo?.FullName}
                </Text>
                <Text style={styles.menuText}>
                  {getAccessableInfo?.employeeInfo?.Designation}
                </Text>
              </View>
            </View>
            {menuOptionsData &&
              menuOptionsData.map((item, index) => {
                let isFirstItem = index === 0;
                let isLastItem = index === menuOptionsData.length - 1;
                return (
                  <View
                    key={item?.id}
                    // @ts-ignore
                    style={{
                      marginTop: isFirstItem && 15,
                      marginVertical: 2,
                    }}>
                    <MenuOption
                      onSelect={() => {
                        item?.modalStatus.toLowerCase() === 'myprofile'
                          ? // @ts-ignore
                            navigation.navigate('My Profile')
                          : (setGetModalStatus(item?.modalStatus),
                            setIsModalVisible(true));
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MCIcon
                          name={item?.labelIconName}
                          size={width / 16}
                          color={COLORS.snowLight95}
                        />
                        <Text style={[styles.menuText, {marginLeft: 5}]}>
                          {item?.label}
                        </Text>
                      </View>
                    </MenuOption>
                    {!isLastItem && (
                      <Divider
                        style={[styles.dividerStyle, {borderWidth: 0.2}]}
                      />
                    )}
                  </View>
                );
              })}
            <View style={{marginTop: 15}}>
              <Pressable
                onPress={() => {
                  logoutHandler();
                }}
                style={styles.logoutContainerStyle}>
                <Text style={styles.logoutBtnTxt}>Logout</Text>
              </Pressable>
            </View>
          </MenuOptions>
        </Menu>
        <Toast position="bottom" topOffset={0} />
      </Appbar>
      {children}
      {/* <CustomizedModal
        isVisible={isModalVisible}
        modalAnimationIn={
          getModalStatus.toLowerCase() === 'myprofile' ? 'zoomIn' : 'flipInX'
        }
        modalAnimationOut={
          getModalStatus.toLowerCase() === 'myprofile' ? 'zoomOut' : 'flipOutX'
        }
        onClose={hideModal}>
        {getModalStatus.toLowerCase() === 'myprofile' && (
          <>
            <View style={styles.iconContainer}>
              <View style={profileStyle.proImgContainer}>
                <Image
                  resizeMode="stretch"
                  style={profileStyle.proImgStyle}
                  source={{uri: profileImg}}
                />
              </View>
              <Text style={styles.profileHeaderTextStyle}>
                {getAccessableInfo?.employeeInfo?.FullName}
              </Text>
              <Text style={styles.profileHeaderTextStyle}>
                {getAccessableInfo?.employeeInfo?.Designation}
              </Text>
            </View>
            <View style={styles.messageContainer}>
              <ComView
                borderTopColor={COLORS.snowLight60}
                borderTopWidth={1}
                borderBottomColor={COLORS.snowLight60}
                borderBottomWidth={1}
                borderTopRightRadius={3}
                borderTopLeftRadius={3}
                label="ID"
                value={getAccessableInfo?.employeeInfo?.Id}
              />
              <ComView
                label="Employee Id"
                value={getAccessableInfo?.employeeInfo?.EmployeeID}
                borderBottomColor={COLORS.snowLight60}
                borderBottomWidth={1}
              />
              <ComView
                label="Mobile"
                value={getAccessableInfo?.employeeInfo?.MobileNo}
                borderBottomColor={COLORS.snowLight60}
                borderBottomWidth={1}
              />
              <ComView
                label="Punch Card No."
                value={getAccessableInfo?.employeeInfo?.PunchCardNo}
                borderBottomColor={COLORS.snowLight60}
                borderBottomWidth={1}
              />
              <ComView
                label="National Id"
                value={getAccessableInfo?.employeeInfo?.NationalId}
                borderBottomColor={COLORS.snowLight60}
                borderBottomWidth={1}
              />
              <ComView
                label="Bank Acc. No."
                value={getAccessableInfo?.employeeInfo?.BankAcNo}
                borderBottomColor={COLORS.snowLight60}
                borderBottomWidth={1}
              />
              <ComView
                label="TIN No."
                value={getAccessableInfo?.employeeInfo?.TinNo}
                borderBottomColor={COLORS.snowLight60}
                borderBottomWidth={1}
              />
              <ComView
                label="Date of Join"
                value={
                  getAccessableInfo?.employeeInfo?.Doj
                    ? formatDate(getAccessableInfo?.employeeInfo?.Doj)
                    : ''
                }
                borderBottomColor={COLORS.snowLight60}
                borderBottomWidth={1}
              />
              <ComView
                label="Department"
                value={getAccessableInfo?.employeeInfo?.Department}
                borderBottomColor={COLORS.snowLight60}
                borderBottomWidth={1}
              />
              <ComView
                label="Section"
                value={getAccessableInfo?.employeeInfo?.Section}
                borderBottomColor={COLORS.snowLight60}
                borderBottomWidth={1}
              />
              <ComView
                label="Company"
                value={getAccessableInfo?.employeeInfo?.Company}
                borderBottomColor={COLORS.snowLight60}
                borderBottomWidth={1}
                borderBottomLeftRadius={3}
                borderBottomRightRadius={3}
              />
            </View>
          </>
        )}
      </CustomizedModal> */}
      {isFocused && <NoInternetModal />}
    </SafeAreaView>
  );
};

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  bottom: {
    left: 0,
    right: 0,
    bottom: 0,
  },

  menuText: {
    paddingVertical: 2,
    fontSize: width > 650 ? width / 32 : width / 27,
    color: COLORS.white,
    fontFamily: 'WorkSans-Regular',
  },
  imgStyle: {
    height: width > 550 ? width / 10 : width / 7,
    width: width > 550 ? width / 10 : width / 7,
    borderRadius: 100,
    borderColor: COLORS.white,
  },
  dividerStyle: {
    borderColor: COLORS.white,
    borderWidth: 0.1,
    width: '100%',
    alignSelf: 'center',
  },

  //   Modal Styling
  messageContainer: {
    marginBottom: 20,
  },

  iconContainer: {
    alignItems: 'center',
    marginBottom: width / 25,
    marginTop: 10,
  },

  profileHeaderTextStyle: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: width / 25,
    color: COLORS.black,
  },

  txtStyle: {
    color: COLORS.black,
    fontFamily: 'WorkSans-Regular',
    fontSize: width / 28,
    marginLeft: 5,
  },
  proDividerStyle: {
    borderColor: COLORS.snowLight60,
    borderWidth: 0.17,
    width: 1,
    height: '100%',
    alignSelf: 'center',
  },
  logoutContainerStyle: {
    marginVertical: 5,
    backgroundColor: COLORS.errorLight85,
    // backgroundColor: 'rgba(10,0,21,.4)',
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: width > 550 ? width / 90 : width / 60,
    borderRadius: 4,
  },
  logoutBtnTxt: {
    fontSize: width > 650 ? width / 32 : width / 27,
    color: COLORS.black,
    fontFamily: 'WorkSans-Regular',
  },
});

export default Container;

interface ComViewInterface {
  label: string;
  value: any;
  borderTopColor?: any;
  borderTopWidth?: any;
  borderBottomColor?: any;
  borderBottomWidth?: any;
  borderTopLeftRadius?: any;
  borderTopRightRadius?: any;
  borderBottomLeftRadius?: any;
  borderBottomRightRadius?: any;
}

const ComView: React.FC<ComViewInterface> = ({
  label,
  value,
  borderTopColor,
  borderTopWidth = 0,
  borderBottomColor,
  borderBottomWidth = 0,
  borderTopLeftRadius = 0,
  borderTopRightRadius = 0,
  borderBottomLeftRadius = 0,
  borderBottomRightRadius = 0,
}) => {
  return (
    <View
      style={{
        borderTopColor: borderTopColor,
        borderTopWidth: borderTopWidth,
        borderBottomColor: borderBottomColor,
        borderBottomWidth: borderBottomWidth,
        borderLeftColor: COLORS.snowLight60,
        borderLeftWidth: 1,
        borderRightColor: COLORS.snowLight60,
        borderRightWidth: 1,
        borderTopLeftRadius: borderTopLeftRadius,
        borderTopRightRadius: borderTopRightRadius,
        borderBottomLeftRadius: borderBottomLeftRadius,
        borderBottomRightRadius: borderBottomRightRadius,
        paddingVertical: 4,
        flexDirection: 'row',
        width: width / 1.2,
      }}>
      <Text style={[styles.txtStyle, {width: '50%'}]}>{label}</Text>
      <Divider style={styles.proDividerStyle} />
      <Text style={[styles.txtStyle, {width: '48%'}]}>{value}</Text>
    </View>
  );
};
