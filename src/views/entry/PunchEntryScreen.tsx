import React, {useState, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
import {useAppContext} from '@contextApi/index';
import {useGetPunchDataQuery} from '@rtk/features/api/apiSlice';
import {formatSubmitDateTime} from '@components/date/formatSubmitDateTime';
import AppURL from '@restApi/AppURL';
import ToastMsg from '@utils/handler/ToastMsg';
import Container from '@components/Container';
import {COLORS} from '@utils/COLORS';
import LiveClock from '@components/clock/LiveClock';
import getToday from '@components/clock/getToday';
import punchEntryStyle from '@utils/comStyle/punchEntryStyle';
import Button from '@components/button/Button';
import treeReqStyle from '@utils/comStyle/treeReqStyle';
import TblComView from '@components/table/TblComView';
import AttendanceInfoSkeleton from '@components/skeleton/attendance/AttendanceInfoSkeleton';
import MCIcon from '@components/icon/MCIcon';
import RefreshBtn from '@components/RefreshBtn';
import CustomizedModal from '@components/modal/CustomizedModal';

const PunchEntryScreen = () => {
  const {getAccessableInfo} = useAppContext();
  const currentDate = new Date();
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    reverseGeocode: '',
    mapLocation: [],
  });
  const [isLoading, setIsLoading] = useState({
    punchIn: false,
    punchOut: false,
    mapView: false,
  });

  const {
    data: rtkPunchData,
    isLoading: punchDataLoading,
    isError: punchDataError,
    isFetching: punchDataRefreshing,
    refetch: punchDataRefetch,
  } = useGetPunchDataQuery(
    useMemo(
      () => ({
        baseURL: `${getAccessableInfo?.loginInfo?.loginBaseURL}`,
        token: getAccessableInfo?.loginInfo?.remarks,
        empId: getAccessableInfo?.userInfo?.Id,
        fromDate: formatSubmitDateTime(getAccessableInfo?.userInfo?.Doj),
        toDate: formatSubmitDateTime(currentDate),
      }),
      [getAccessableInfo?.loginInfo, getAccessableInfo?.userInfo],
    ),
  );

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 60000,
        });

        setLocation(prev => ({
          ...prev,
          latitude: location.latitude,
          longitude: location.longitude,
        }));

        // Reverse geocode to get the region name
        reverseGeocode(location.latitude, location.longitude);
      } catch (error) {
        // @ts-ignore
        console.log('get Locations loading Error: ', error?.message);
      }
    };

    // Reverse geocoding function
    const reverseGeocode = async (lati: any, longi: any) => {
      try {
        const response = await axios.get(AppURL.getReverseGeocode(lati, longi));
        response?.data &&
          setLocation(prev => ({
            ...prev,
            reverseGeocode: `${response?.data?.locality}, ${response?.data?.city}, ${response?.data?.countryName}`,
          }));
      } catch (error) {
        console.log('Error reverse geocoding:', error);
      }
    };

    fetchLocation();
    const intervalId = setInterval(fetchLocation, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const punchInOutHandler = async (punchType: number, loc: any) => {
    const punchData = {
      Token: getAccessableInfo?.loginInfo?.remarks,
      EmployeeDataId: getAccessableInfo?.userInfo?.Id,
      Remarks: location?.reverseGeocode ? location?.reverseGeocode : '',
      Lat: loc?.latitude,
      Lon: loc?.longitude,
      PunchType: punchType,
    };

    try {
      const res = await axios.post(
        AppURL.postPunch(`${getAccessableInfo?.loginInfo?.loginBaseURL}`),
        punchData,
      );
      const pResult = res?.data;

      if (pResult?.Name.trim()?.toLowerCase() === 'already existed !!') {
        ToastMsg({
          text1: pResult?.Name,
          type: 'success',
        });
        setIsLoading(prev => ({
          ...prev,
          punchIn: false,
          punchOut: false,
        }));
      }
      if (pResult?.Name.trim()?.toLowerCase() === 'submitted successfully !!') {
        ToastMsg({
          text1: pResult?.Name,
          type: 'success',
        });
        setIsLoading(prev => ({
          ...prev,
          punchIn: false,
          punchOut: false,
        }));
        setTimeout(() => {
          punchDataRefetch();
        }, 500);
      }
      ToastMsg({
        text1: pResult?.Name,
        type: 'error',
      });

      setIsLoading(prev => ({
        ...prev,
        punchIn: false,
        punchOut: false,
      }));
    } catch (error) {
      // @ts-ignore
      console.log('punchInOutHandler error: ', error.message);

      setTimeout(() => {
        setIsLoading(prev => ({
          ...prev,
          punchIn: false,
          punchOut: false,
        }));
      }, 5000);
    } finally {
      setIsLoading(prev => ({
        ...prev,
        punchIn: false,
        punchOut: false,
      }));
    }
  };

  const hideModal = () => {
    setIsLoading(prev => ({
      ...prev,
      mapView: false,
    }));
    setTimeout(() => {
      setLocation(prev => ({
        ...prev,
        mapLocation: [],
      }));
    }, 3000);
  };

  return (
    <Container>
      <View
        style={{
          height: '92%',
          width: '100%',
          backgroundColor: COLORS.white,
        }}>
        <View
          style={{
            width: screenWidth,
            marginVertical: 10,
          }}>
          <LiveClock />
          <Text
            style={{
              textAlign: 'center',
              fontSize: screenWidth / 30,
              fontFamily: 'WorkSans-Regular',
              color: COLORS.snowColor,
            }}>
            {getToday()}
          </Text>
        </View>
        <View style={punchEntryStyle.btnContainer}>
          <Button
            onPress={async () => {
              const punchInType = 1;
              await setIsLoading(prev => ({
                ...prev,
                punchIn: true,
                punchOut: false,
              }));
              (await (location.latitude && location.longitude))
                ? punchInOutHandler(punchInType, location)
                : ToastMsg({
                    text1: 'Failed to retrieve your location',
                    type: 'error',
                  });
            }}>
            {isLoading.punchIn ? (
              <ActivityIndicator
                size={screenWidth > 550 ? 30 : 20}
                color={COLORS.white}
              />
            ) : (
              <Text style={[punchEntryStyle.txtStyle, {color: COLORS.white}]}>
                Punch In
              </Text>
            )}
          </Button>
          <Button
            style={punchEntryStyle.punchOutBtn}
            onPress={async () => {
              const punchOutType = 4;

              await setIsLoading(prev => ({
                ...prev,
                punchIn: false,
                punchOut: true,
              }));
              (await (location.latitude && location.longitude))
                ? punchInOutHandler(punchOutType, location)
                : ToastMsg({
                    text1: 'Failed to retrieve your location',
                    type: 'error',
                  });
            }}>
            {isLoading.punchOut ? (
              <ActivityIndicator
                size={screenWidth > 550 ? 30 : 20}
                color={COLORS.black}
              />
            ) : (
              <Text style={[punchEntryStyle.txtStyle, {color: COLORS.black}]}>
                Punch Out
              </Text>
            )}
          </Button>
        </View>

        <View
          style={{
            marginTop:
              !punchDataLoading && !punchDataError && !punchDataRefreshing
                ? 20
                : 10,
          }}>
          {(punchDataLoading || punchDataRefreshing) && !punchDataError && (
            <AttendanceInfoSkeleton />
          )}
          {!punchDataLoading &&
            !punchDataError &&
            !punchDataRefreshing &&
            rtkPunchData &&
            rtkPunchData?.length > 0 && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                <View
                  style={{
                    flexDirection: 'column',
                    paddingHorizontal: 10,
                    maxHeight: screenHeight / 1.2,
                  }}>
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
                      title={'Map'}
                      getWidth={screenWidth / 6}
                      customStyle={treeReqStyle.tableHeaderText}
                      customViewStyle={{
                        borderRightWidth: 1,
                        borderColor: COLORS.white,
                      }}
                    />
                    <TblComView
                      title={'Status'}
                      getWidth={screenWidth / 3.8}
                      customStyle={treeReqStyle.tableHeaderText}
                      customViewStyle={{
                        borderRightWidth: 1,
                        borderColor: COLORS.white,
                      }}
                    />
                    <TblComView
                      title={'Time'}
                      getWidth={screenWidth / 4}
                      customStyle={treeReqStyle.tableHeaderText}
                      customViewStyle={{
                        borderRightWidth: 1,
                        borderColor: COLORS.white,
                      }}
                    />
                    <TblComView
                      title={'Date'}
                      getWidth={screenWidth / 3}
                      customStyle={treeReqStyle.tableHeaderText}
                      customViewStyle={{
                        borderRightWidth: 1,
                        borderColor: COLORS.white,
                      }}
                    />

                    <TblComView
                      title={'Locations'}
                      getWidth={screenWidth / 2}
                      customStyle={treeReqStyle.tableHeaderText}
                      customViewStyle={{
                        borderRightWidth: 1,
                        borderColor: COLORS.white,
                      }}
                    />
                    <TblComView
                      title={'Latitude'}
                      getWidth={screenWidth / 4}
                      customStyle={treeReqStyle.tableHeaderText}
                      customViewStyle={{
                        borderRightWidth: 1,
                        borderColor: COLORS.white,
                      }}
                    />
                    <TblComView
                      title={'Longitude'}
                      getWidth={screenWidth / 4}
                      customStyle={treeReqStyle.tableHeaderText}
                      customViewStyle={{
                        borderRightWidth: 1,
                        borderColor: COLORS.white,
                      }}
                    />
                    <TblComView
                      title={'Punch Via'}
                      getWidth={screenWidth / 4}
                      customStyle={treeReqStyle.tableHeaderText}
                    />
                  </View>
                  <ScrollView
                    style={{
                      maxHeight: screenHeight / 1.3,
                    }}>
                    {rtkPunchData &&
                      rtkPunchData
                        ?.slice()
                        ?.reverse()
                        ?.map((item: any, index: number) => {
                          const isLastPunch =
                            index === rtkPunchData?.length - 1;
                          const notApprovedPunch =
                            item?.ActionStatus?.toLowerCase()?.trim() ===
                            'not approved';
                          const approvedPunch =
                            item?.ActionStatus?.toLowerCase()?.trim() ===
                            'approved';

                          return (
                            <View
                              key={index}
                              style={{
                                flexDirection: 'row',
                                backgroundColor: approvedPunch
                                  ? COLORS.snowLight100
                                  : notApprovedPunch
                                  ? COLORS.errorLight95
                                  : COLORS.white,
                                marginBottom:
                                  isLastPunch && rtkPunchData?.length > 15
                                    ? 80
                                    : 0,
                              }}>
                              <TblComView
                                title={index + 1}
                                getWidth={40}
                                customViewStyle={{
                                  borderBottomWidth: 1,
                                  borderRightWidth: 1,
                                  borderLeftWidth: 1,
                                  borderColor: COLORS.snowColor,
                                }}
                                customStyle={{
                                  fontSize:
                                    screenWidth > 550
                                      ? screenWidth / 35
                                      : screenWidth / 30,
                                }}
                              />
                              <Pressable
                                onPress={() => {
                                  setIsLoading(prev => ({
                                    ...prev,
                                    mapView: true,
                                  }));

                                  setLocation(prev => ({
                                    ...prev,
                                    mapLocation: item,
                                  }));
                                }}
                                style={[
                                  treeReqStyle.tableViewStyle,
                                  {
                                    paddingHorizontal: 2,
                                    borderBottomWidth: 1,
                                    borderRightWidth: 1,
                                    borderColor: COLORS.snowColor,
                                    width: screenWidth / 6,
                                  },
                                ]}>
                                <MCIcon
                                  color={COLORS.snowColor}
                                  size={
                                    screenWidth > 550
                                      ? screenWidth / 23
                                      : screenWidth / 13
                                  }
                                  name="eye"
                                />
                              </Pressable>
                              <TblComView
                                customViewStyle={{
                                  borderBottomWidth: 1,
                                  borderColor: COLORS.snowColor,
                                }}
                                title={item?.ActionStatus}
                                getWidth={screenWidth / 3.8}
                              />
                              <TblComView
                                customViewStyle={{
                                  borderBottomWidth: 1,
                                  borderRightWidth: 1,
                                  borderLeftWidth: 1,
                                  borderColor: COLORS.snowColor,
                                }}
                                title={item?.Time}
                                getWidth={screenWidth / 4}
                              />
                              <TblComView
                                title={
                                  item?.WorkDate
                                    ? formatSubmitDateTime(item.WorkDate)
                                    : ''
                                }
                                getWidth={screenWidth / 3}
                                customViewStyle={{
                                  borderBottomWidth: 1,
                                  borderRightWidth: 1,
                                  borderColor: COLORS.snowColor,
                                }}
                              />

                              <TblComView
                                title={item?.Remarks ? item?.Remarks : ''}
                                getWidth={screenWidth / 2}
                                customViewStyle={{
                                  borderBottomWidth: 1,
                                  borderRightWidth: 1,
                                  borderColor: COLORS.snowColor,
                                }}
                              />
                              <TblComView
                                title={item?.Lat}
                                getWidth={screenWidth / 4}
                                customViewStyle={{
                                  borderBottomWidth: 1,
                                  borderRightWidth: 1,
                                  borderColor: COLORS.snowColor,
                                }}
                              />
                              <TblComView
                                title={item?.Lon}
                                getWidth={screenWidth / 4}
                                customViewStyle={{
                                  borderBottomWidth: 1,
                                  borderRightWidth: 1,
                                  borderColor: COLORS.snowColor,
                                }}
                              />

                              <TblComView
                                title={item?.PunchStatus}
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
        </View>
      </View>
      {(!rtkPunchData ||
        (rtkPunchData?.length <= 0 &&
          !punchDataError &&
          !punchDataLoading &&
          !punchDataRefreshing)) && (
        <RefreshBtn
          refreshOnPress={() => {
            punchDataRefetch();
          }}
        />
      )}

      <CustomizedModal
        isVisible={isLoading.mapView}
        modalAnimationIn="zoomIn"
        modalAnimationOut="zoomOut"
        onClose={hideModal}>
        <View
          style={{
            height: screenHeight / 2,
            width: '100%',
            padding: 5,
            paddingTop: screenWidth > 550 ? 35 : 20,
          }}>
          <MapView
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: COLORS.white,
            }}
            region={{
              // @ts-ignore
              latitude: location.mapLocation?.Lat,
              // @ts-ignore
              longitude: location.mapLocation?.Lon,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            // provider="google"
          >
            <Marker
              coordinate={{
                // @ts-ignore
                latitude: location.mapLocation?.Lat,
                // @ts-ignore
                longitude: location.mapLocation?.Lon,
              }}
              title="My current location"
              // @ts-ignore
              description={location.mapLocation?.Remarks}
            />
          </MapView>
        </View>
      </CustomizedModal>
    </Container>
  );
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PunchEntryScreen;
