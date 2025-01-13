import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {useIsFocused} from '@react-navigation/native';
import {useAppContext} from '@contextApi/index';
import {
  formatDate,
  formatDateTime,
  secondsToHms,
} from '@utils/handler/formatDate';
import {useGetAttendanceInfoQuery} from '@rtk/features/api/apiSlice';
import Container from '@components/Container';
import {removeApiSegment} from '@utils/handler/splitBaseUrlByAPI';
import MCIcon from '@components/icon/MCIcon';
import {COLORS} from '@utils/COLORS';
import profileStyle from '@utils/comStyle/profileStyle';
import AttendanceInfoSkeleton from '@components/skeleton/attendance/AttendanceInfoSkeleton';
import treeReqStyle from '@utils/comStyle/treeReqStyle';
import CustomizedModal from '@components/modal/CustomizedModal';
import modalStyle from '@utils/comStyle/modalStyle';
import {ModalComView} from '@components/modal/ModalComView';

const moment = require('moment');

const ProfileScreen = () => {
  const isFocused = useIsFocused();
  const {getAccessableInfo} = useAppContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [date, setDate] = React.useState({
    from: new Date(),
    to: new Date(),
  });

  const [show, setShow] = React.useState({
    from: false,
    to: false,
  });

  const [pickedDate, setPickedDate] = React.useState({
    from: '',
    to: '',
  });

  const fromOnChange = (event: any, selectedDate?: Date) => {
    if (event?.type === 'set' && selectedDate) {
      const currentDate = selectedDate || date.from;

      setPickedDate(prevTree => ({
        ...prevTree,
        from: formatDateTime(currentDate),
      }));

      setDate(prevDate => ({
        ...prevDate,
        from: currentDate,
      }));
    }
  };
  const showFromDatepicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date.from,
        mode: 'date',
        onChange: fromOnChange,
      });
    } else {
      setShow(prev => ({
        ...prev,
        from: true,
      }));
    }
  };
  const toOnChange = (event: any, selectedDate?: Date) => {
    if (event?.type === 'set' && selectedDate) {
      const currentDate = selectedDate || date.to;

      setPickedDate(prevTree => ({
        ...prevTree,
        to: formatDateTime(currentDate),
      }));

      setDate(prevDate => ({
        ...prevDate,
        to: currentDate,
      }));
    }
  };
  const showToDatepicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date.to,
        mode: 'date',
        onChange: toOnChange,
      });
    } else {
      setShow(prev => ({
        ...prev,
        to: true,
      }));
    }
  };

  const currentMonthFirstDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  );
  const today = new Date();

  const {
    data: rtkAttendanceData,
    isLoading: attendanceLoading,
    isError: attendanceError,
    isFetching: attendanceRefreshing,
    refetch: attendanceRefetch,
  } = useGetAttendanceInfoQuery({
    baseURL: `${getAccessableInfo?.loginInfo?.loginBaseURL}`,
    token: getAccessableInfo?.loginInfo?.remarks,
    fromDate: pickedDate?.from,
    toDate: pickedDate?.to,
  });

  const secToFormat = (seconds: number) => {
    if (seconds <= 0) {
      return '';
    } else {
      return moment.utc(seconds * 1000).format('HH:mm');
    }
  };

  useEffect(() => {
    if (isFocused && !pickedDate?.from && !pickedDate?.to) {
      setPickedDate(prevTree => ({
        ...prevTree,
        from: formatDateTime(currentMonthFirstDate),
        to: formatDateTime(today),
      }));
    }
  }, [isFocused, pickedDate?.from, pickedDate?.to]);

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const totalWorkingHours =
    rtkAttendanceData &&
    rtkAttendanceData?.length > 0 &&
    rtkAttendanceData?.reduce(
      (total: any, item: any) => total + parseInt(item?.WorkingHours),
      0,
    );
  const totalShortLeave =
    rtkAttendanceData &&
    rtkAttendanceData?.length > 0 &&
    rtkAttendanceData?.reduce(
      (total: any, item: any) => total + parseInt(item?.ActualShortLeave),
      0,
    );
  const totalEarlyOut =
    rtkAttendanceData &&
    rtkAttendanceData?.length > 0 &&
    rtkAttendanceData?.reduce(
      (total: any, item: any) => total + parseInt(item?.EarlyOutTime),
      0,
    );
  const totalLateHours =
    rtkAttendanceData &&
    rtkAttendanceData?.length > 0 &&
    rtkAttendanceData?.reduce(
      (total: any, item: any) => total + parseInt(item?.LateHourTime),
      0,
    );
  const actualShortLeave =
    rtkAttendanceData &&
    rtkAttendanceData?.length > 0 &&
    rtkAttendanceData?.reduce(
      (total: any, item: any) => total + parseInt(item?.ShortLeave),
      0,
    );
  const totalOTHours =
    rtkAttendanceData &&
    rtkAttendanceData?.length > 0 &&
    rtkAttendanceData?.reduce(
      (total: any, item: any) => total + parseInt(item?.OT),
      0,
    );

  // const profileImg = `${AppURL.imgURL}${getAccessableInfo?.employeeInfo?.Photo}`;
  const profileImg = `${removeApiSegment(
    getAccessableInfo.loginInfo?.loginBaseURL,
  )}${getAccessableInfo?.userInfo?.Photo}`;

  const handleRefresh = () => {
    attendanceRefetch();
  };
  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.innerTopContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.proImgContainer}>
              <Image
                resizeMode="stretch"
                style={styles.proImgStyle}
                source={{uri: profileImg}}
              />
            </View>
            <View style={{marginLeft: 10, flexDirection: 'row'}}>
              <Text style={styles.profileHeaderTextStyle}>
                {getAccessableInfo?.userInfo?.FullName}
              </Text>
              <Pressable
                onPress={() => {
                  setIsModalVisible(true);
                }}
                style={{marginLeft: 5}}>
                <MCIcon
                  name="information"
                  size={screenWidth > 550 ? screenWidth / 20 : screenWidth / 15}
                  color={COLORS.white}
                />
              </Pressable>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 10,
          }}>
          <Pressable
            style={profileStyle.datePickerBtnContainer}
            onPress={showFromDatepicker}>
            <Text style={profileStyle.txtStyle}>
              {pickedDate?.from
                ? pickedDate?.from?.split(' ')[0]
                : 'Select From Date'}
            </Text>
            <MCIcon
              name="calendar-month-outline"
              size={screenWidth > 550 ? screenWidth / 25 : screenWidth / 20}
              color={COLORS.snowColor}
            />
          </Pressable>
          <View
            style={{
              marginHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'WorkSans-SemiBold',
                textAlign: 'center',
                fontSize: screenWidth / 25,
                color: COLORS.snowColor,
              }}>
              To
            </Text>
          </View>
          <Pressable
            style={profileStyle.datePickerBtnContainer}
            onPress={showToDatepicker}>
            <Text style={profileStyle.txtStyle}>
              {pickedDate?.to
                ? pickedDate?.to?.split(' ')[0]
                : 'Select To Date'}
            </Text>
            <MCIcon
              name="calendar-month-outline"
              size={screenWidth > 550 ? screenWidth / 25 : screenWidth / 20}
              color={COLORS.snowColor}
            />
          </Pressable>
          {show.from && (
            <DateTimePicker
              value={date.from}
              mode="date"
              display="default"
              onChange={fromOnChange}
            />
          )}
          {show.to && (
            <DateTimePicker
              value={date.to}
              mode="date"
              display="default"
              onChange={toOnChange}
            />
          )}
        </View>

        {(attendanceLoading || attendanceRefreshing) && !attendanceError && (
          <AttendanceInfoSkeleton />
        )}
        {!attendanceLoading &&
          !attendanceError &&
          !attendanceRefreshing &&
          rtkAttendanceData &&
          rtkAttendanceData?.length > 0 && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              refreshControl={
                <RefreshControl
                  tintColor={COLORS.snowColor}
                  refreshing={attendanceRefreshing}
                  onRefresh={handleRefresh}
                />
              }>
              <View style={{flexDirection: 'column', paddingHorizontal: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: COLORS.snowColor,
                  }}>
                  <TblComView
                    title={'SL'}
                    getWidth={40}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'Working Date'}
                    getWidth={screenWidth / 3.8}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'Shift Information'}
                    getWidth={
                      screenWidth > 550 ? screenWidth / 2 : screenWidth / 2.5
                    }
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'Lunch Information'}
                    getWidth={screenWidth / 3}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />

                  <TblComView
                    title={'In Time'}
                    getWidth={screenWidth / 3}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'Out Time'}
                    getWidth={screenWidth / 4}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'Day Status'}
                    getWidth={screenWidth / 4}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'Working Hours'}
                    getWidth={screenWidth / 4}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'Late Hours'}
                    getWidth={screenWidth / 4}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'Total Short Leave'}
                    getWidth={screenWidth / 4}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'Actual Short Leave'}
                    getWidth={screenWidth / 4}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'Early Out'}
                    getWidth={screenWidth / 4}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'OT Hours(Hrs)'}
                    getWidth={screenWidth / 4}
                    customStyle={treeReqStyle.tableHeaderText}
                  />
                </View>
                <ScrollView
                  style={{
                    maxHeight:
                      screenWidth > 550
                        ? screenHeight / 1.85
                        : screenHeight / 1.75,
                  }}>
                  {rtkAttendanceData &&
                    rtkAttendanceData
                      ?.slice()
                      ?.reverse()
                      ?.map((item: any, index: number) => {
                        let isLast = index === rtkAttendanceData?.length - 1;
                        const presentStatus = item?.Remarks;
                        const allTypeOfleave =
                          presentStatus.toLowerCase() === 'cl' ||
                          presentStatus.toLowerCase() === 'sl' ||
                          presentStatus.toLowerCase() === 'el' ||
                          presentStatus.toLowerCase() === 'gl';
                        return (
                          <View
                            key={index}
                            style={{
                              flexDirection: 'row',
                              backgroundColor:
                                presentStatus.toLowerCase() === 'p'
                                  ? COLORS.snowLight100
                                  : presentStatus.toLowerCase() === 'l'
                                  ? COLORS.errorLight95
                                  : allTypeOfleave
                                  ? COLORS.errorLight100
                                  : COLORS.white,
                              marginBottom: isLast ? 50 : 0,
                            }}>
                            <TblComView
                              title={rtkAttendanceData?.length - index}
                              getWidth={40}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderLeftWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />
                            <TblComView
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                              title={item?.WorkDate}
                              getWidth={screenWidth / 3.8}
                            />
                            <TblComView
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderLeftWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                              title={item?.ShifInfo}
                              getWidth={
                                screenWidth > 550
                                  ? screenWidth / 2
                                  : screenWidth / 2.5
                              }
                            />
                            <TblComView
                              title={item?.LunchInfo}
                              getWidth={screenWidth / 3}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />

                            <TblComView
                              title={item?.InTime}
                              getWidth={screenWidth / 3}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />
                            <TblComView
                              title={item?.OutTime}
                              getWidth={screenWidth / 4}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />
                            <TblComView
                              title={item?.Remarks}
                              getWidth={screenWidth / 4}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />
                            <TblComView
                              title={
                                item?.WorkingHours
                                  ? secToFormat(item?.WorkingHours)
                                  : ''
                              }
                              getWidth={screenWidth / 4}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />
                            <TblComView
                              title={
                                item?.LateHourTime
                                  ? secToFormat(item?.LateHourTime)
                                  : ''
                              }
                              getWidth={screenWidth / 4}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />
                            <TblComView
                              title={
                                item?.ActualShortLeave
                                  ? secToFormat(item?.ActualShortLeave)
                                  : ''
                              }
                              getWidth={screenWidth / 4}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />
                            <TblComView
                              title={
                                item?.ShortLeave
                                  ? secToFormat(item?.ShortLeave)
                                  : ''
                              }
                              getWidth={screenWidth / 4}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />
                            <TblComView
                              title={
                                item?.EarlyOutTime
                                  ? secToFormat(item?.EarlyOutTime)
                                  : ''
                              }
                              getWidth={screenWidth / 4}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />
                            <TblComView
                              title={item?.OT ? secToFormat(item?.OT) : ''}
                              getWidth={screenWidth / 4}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />
                          </View>
                        );
                      })}
                </ScrollView>
              </View>
            </ScrollView>
          )}

        {rtkAttendanceData && rtkAttendanceData?.length > 0 && (
          <View style={styles.summaryContainerStyle}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <ComView
                label="Total Working Hours:"
                value={secondsToHms(totalWorkingHours)}
              />
              <ComView
                label="Total Short Leave:"
                value={secondsToHms(totalShortLeave)}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 5,
              }}>
              <ComView
                label="Total Early Out:"
                value={secondsToHms(totalEarlyOut)}
              />
              <ComView
                label="Total Late Hours:"
                value={secondsToHms(totalLateHours)}
              />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <ComView
                label="Actual Short  Leave:"
                value={secondsToHms(actualShortLeave)}
              />
              <ComView
                label="Total OT Hours:"
                value={secondsToHms(totalOTHours)}
              />
            </View>
          </View>
        )}
      </View>

      <CustomizedModal
        isVisible={isModalVisible}
        modalAnimationIn="zoomIn"
        modalAnimationOut="zoomOut"
        onClose={hideModal}>
        <View style={modalStyle.iconContainer}>
          <View style={profileStyle.proImgContainer}>
            <Image
              resizeMode="stretch"
              style={profileStyle.proImgStyle}
              source={{uri: profileImg}}
            />
          </View>
          <Text style={[styles.profileHeaderTextStyle, {color: COLORS.black}]}>
            {getAccessableInfo?.userInfo?.FullName}
          </Text>
          <Text style={[styles.profileHeaderTextStyle, {color: COLORS.black}]}>
            {getAccessableInfo?.userInfo?.Designation}
          </Text>
        </View>
        <View style={modalStyle.messageContainer}>
          {/* <ModalComView
            borderTopColor={COLORS.snowLight60}
            borderTopWidth={1}
            borderBottomColor={COLORS.snowLight60}
            borderBottomWidth={1}
            borderTopRightRadius={3}
            borderTopLeftRadius={3}
            label="ID"
            value={getAccessableInfo?.employeeInfo?.Id}
          /> */}
          <ModalComView
            borderTopColor={COLORS.snowLight60}
            borderTopWidth={1}
            label="Employee Id"
            value={getAccessableInfo?.userInfo?.EmployeeID}
            borderBottomColor={COLORS.snowLight60}
            borderBottomWidth={1}
            borderTopRightRadius={3}
            borderTopLeftRadius={3}
          />
          <ModalComView
            label="Mobile"
            value={getAccessableInfo?.userInfo?.MobileNo}
            borderBottomColor={COLORS.snowLight60}
            borderBottomWidth={1}
          />
          <ModalComView
            label="Punch Card No."
            value={getAccessableInfo?.userInfo?.PunchCardNo}
            borderBottomColor={COLORS.snowLight60}
            borderBottomWidth={1}
          />
          <ModalComView
            label="National Id"
            value={getAccessableInfo?.userInfo?.NationalId}
            borderBottomColor={COLORS.snowLight60}
            borderBottomWidth={1}
          />
          <ModalComView
            label="Bank Acc. No."
            value={getAccessableInfo?.userInfo?.BankAcNo}
            borderBottomColor={COLORS.snowLight60}
            borderBottomWidth={1}
          />
          <ModalComView
            label="TIN No."
            value={getAccessableInfo?.userInfo?.TinNo}
            borderBottomColor={COLORS.snowLight60}
            borderBottomWidth={1}
          />
          <ModalComView
            label="Date of Join"
            value={formatDate(getAccessableInfo?.userInfo?.Doj)}
            borderBottomColor={COLORS.snowLight60}
            borderBottomWidth={1}
          />
          <ModalComView
            label="Department"
            value={getAccessableInfo?.userInfo?.Department}
            borderBottomColor={COLORS.snowLight60}
            borderBottomWidth={1}
          />
          <ModalComView
            label="Section"
            value={getAccessableInfo?.userInfo?.Section}
            borderBottomColor={COLORS.snowLight60}
            borderBottomWidth={1}
          />
          <ModalComView
            label="Company"
            value={getAccessableInfo?.userInfo?.Company}
            borderBottomColor={COLORS.snowLight60}
            borderBottomWidth={1}
            borderBottomLeftRadius={3}
            borderBottomRightRadius={3}
          />
        </View>
      </CustomizedModal>
    </Container>
  );
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    height: '100%',
  },
  innerTopContainer: {
    height: screenWidth / 3,
    backgroundColor: COLORS.snowColor,
    borderBottomEndRadius: screenWidth > 550 ? 80 : 50,
    borderBottomLeftRadius: screenWidth > 550 ? 80 : 50,
  },
  textStyle: {
    fontSize: screenWidth > 550 ? screenWidth / 40 : screenWidth / 35,
    color: COLORS.black,
  },
  iconContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenWidth / 25,
    marginTop: screenWidth > 550 ? 10 : 5,
  },
  profileHeaderTextStyle: {
    fontFamily: 'WorkSans-Regular',
    fontSize: screenWidth > 550 ? screenWidth / 35 : screenWidth / 28,
    color: COLORS.white,
  },
  proImgContainer: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.snowLight60,
    justifyContent: 'center',
    alignItems: 'center',
    height: screenWidth > 550 ? screenWidth / 4.6 : screenWidth / 4.2,
    width: screenWidth > 550 ? screenWidth / 4.6 : screenWidth / 4.2,
  },
  proImgStyle: {
    padding: 5,
    height: screenWidth > 550 ? screenWidth / 5 : screenWidth / 4.5,
    width: screenWidth > 550 ? screenWidth / 5 : screenWidth / 4.5,
    borderRadius: 5,
  },
  summaryContainerStyle: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: COLORS.snowLight90,
    width: '100%',
    height: screenWidth > 550 ? 100 : 75,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopColor: COLORS.darkInactiveColor,
    borderTopWidth: 0.5,

    overflow: 'hidden',
    shadowColor: COLORS.snowColor,
    shadowRadius: 10,
    shadowOpacity: 0.4,
  },
});

export default ProfileScreen;

interface ComViewInterface {
  label?: string;
  value?: any;
  viewWidth?: any;
}
interface tblComViewInterface {
  title?: any;
  getWidth?: any;
  customStyle?: object;
  customViewStyle?: object;
}

const ComView: React.FC<ComViewInterface> = ({label, value, viewWidth}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: viewWidth,
        alignItems: 'center',
      }}>
      <View
        style={{
          // minWidth: '50%',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}>
        <Text style={[styles.textStyle]}>{label} </Text>
      </View>
      <Text style={[styles.textStyle, {fontFamily: 'WorkSans-SemiBold'}]}>
        {value}
      </Text>
    </View>
  );
};

const TblComView: React.FC<tblComViewInterface> = ({
  title,
  getWidth,
  customStyle,
  customViewStyle,
}) => {
  return (
    <View
      style={[
        treeReqStyle.tableViewStyle,
        customViewStyle,
        {width: getWidth, paddingHorizontal: 2},
      ]}>
      <Text style={[styles.textStyle, customStyle]}>{title}</Text>
    </View>
  );
};
