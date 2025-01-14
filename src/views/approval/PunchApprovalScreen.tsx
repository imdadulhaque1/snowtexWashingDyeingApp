import {ActivityIndicator, Dimensions, Text, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import React, {FC, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import AppURL from '@restApi/AppURL';
import {useAppContext} from '@contextApi/index';
import {LeaveApprovalDeleteInterface} from '@interface/punchApproval/LeaveApprovalDeleteInterface';
import {useGetPunchApprovalAllDataQuery} from '@rtk/features/api/apiSlice';
import {formatOnlyDate} from '@utils/handler/formatOnlyDate';
import ToastMsg from '@utils/handler/ToastMsg';
import Container from '@components/Container';
import leaveInfoStyle from '@utils/comStyle/leaveInfoStyle';
import AttendanceInfoSkeleton from '@components/skeleton/attendance/AttendanceInfoSkeleton';
import {COLORS} from '@utils/COLORS';
import TblComView from '@components/table/TblComView';
import treeReqStyle from '@utils/comStyle/treeReqStyle';
import Button from '@components/button/Button';
import MCIcon from '@components/icon/MCIcon';
import punchEntryStyle from '@utils/comStyle/punchEntryStyle';
import {formatDate} from '@utils/handler/formatDate';
import RefreshBtn from '@components/RefreshBtn';
import ConfirmModal from '@components/modal/ConfirmModal';
import confirmModalStyle from '@utils/comStyle/modal/confirmModalStyle';

interface Props {}

const PunchApprovalScreen: FC<Props> = props => {
  const {getAccessableInfo} = useAppContext();

  const [booleanStatus, setBooleanStatus] = useState<{
    isModalDeleteOpen: boolean;
    isModalApproveOpen: boolean;
    mapViewModalOpen: boolean;
    actionData: LeaveApprovalDeleteInterface | null;
    isDeleting: boolean;
    isApprove: boolean;
  }>({
    isModalDeleteOpen: false,
    isModalApproveOpen: false,
    mapViewModalOpen: false,
    actionData: null,
    isDeleting: false,
    isApprove: false,
  });

  // const previousMonthFirstDate = new Date(
  //   new Date().getFullYear(),
  //   new Date().getMonth() - 1,
  //   1,
  // );

  const currentMonthFirstDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  );
  const today = new Date();

  const {
    data: rtkPunchApprovalData,
    isLoading: punchApprovalLoading,
    isError: punchApprovalError,
    isFetching: punchApprovalRefreshing,
    refetch: punchApprovalRefetch,
  } = useGetPunchApprovalAllDataQuery({
    baseURL: `${getAccessableInfo?.loginInfo?.loginBaseURL}`,
    token: getAccessableInfo?.loginInfo?.remarks,
    fromDate: formatOnlyDate(currentMonthFirstDate),
    toDate: formatOnlyDate(today),
  });

  const handleRefresh = () => {
    punchApprovalRefetch();
  };

  const punchApproveDeleteFunc = async (
    data: any,
    token: string,
    actionType: number,
  ) => {
    const punchData: any = await {
      Token: token,
      Id: data?.Id,
      Approved: actionType,
      TextMode: data?.TextMode,
    };

    try {
      const res = await axios.post(
        AppURL.punchApproveDelete(
          `${getAccessableInfo?.loginInfo?.loginBaseURL}`,
        ),
        punchData,
      );
      const response = res?.data;

      if (
        response?.Name.toLowerCase()?.trim() === 'you are not  permitted !!'
      ) {
        ToastMsg({
          text1: `${response?.Name}`,
          type: 'info',
        });
      } else {
        ToastMsg({
          text1: `${response?.Name}`,
          type: 'success',
        });
        setTimeout(() => {
          punchApprovalRefetch()
            .then(res => console.log('Recalling Punched Data'))
            .catch(err =>
              console.log('Error to Recalling Punched Data', err?.message),
            );
        }, 1000);
      }

      setTimeout(() => {
        setBooleanStatus(prev => ({
          ...prev,
          isModalApproveOpen: false,
          isModalDeleteOpen: false,
          mapViewModalOpen: false,
          isDeleting: false,
          isApprove: false,
          actionData: null,
        }));
      }, 500);
    } catch (error) {
      // @ts-ignore
      console.log('punchApproveDeleteFunc Error: ', error?.message);
      setTimeout(() => {
        setBooleanStatus(prev => ({
          ...prev,
          isModalApproveOpen: false,
          isModalDeleteOpen: false,
          mapViewModalOpen: false,
          isDeleting: false,
          isApprove: false,
          actionData: null,
        }));
      }, 4000);
    }
  };

  const hideModal = () => {
    setBooleanStatus(prev => ({
      ...prev,
      isModalApproveOpen: false,
      isModalDeleteOpen: false,
      mapViewModalOpen: false,
      isDeleting: false,
      isApprove: false,
      actionData: null,
    }));
  };

  return (
    <Container>
      <View style={[leaveInfoStyle.containerStyle, {paddingHorizontal: 10}]}>
        <View
          style={{
            marginTop: rtkPunchApprovalData ? 10 : 0,
          }}>
          {(punchApprovalRefreshing || punchApprovalLoading) &&
            !punchApprovalError && <AttendanceInfoSkeleton />}
          {!punchApprovalRefreshing &&
            !punchApprovalLoading &&
            rtkPunchApprovalData &&
            rtkPunchApprovalData?.length > 0 && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                <View
                  style={{
                    flexDirection: 'column',
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
                      title={'Action'}
                      getWidth={screenWidth / 2}
                      customStyle={treeReqStyle.tableHeaderText}
                      customViewStyle={{
                        borderRightWidth: 1,
                        borderColor: COLORS.white,
                      }}
                    />
                    <TblComView
                      title={'Employee Name'}
                      getWidth={screenWidth / 3.3}
                      customStyle={treeReqStyle.tableHeaderText}
                      customViewStyle={{
                        borderRightWidth: 1,
                        borderColor: COLORS.white,
                      }}
                    />
                    <TblComView
                      title={'Work Date'}
                      getWidth={screenWidth / 4}
                      customStyle={treeReqStyle.tableHeaderText}
                      customViewStyle={{
                        borderRightWidth: 1,
                        borderColor: COLORS.white,
                      }}
                    />
                    <TblComView
                      title={'Punch Status'}
                      getWidth={screenWidth / 4}
                      customStyle={treeReqStyle.tableHeaderText}
                      customViewStyle={{
                        borderRightWidth: 1,
                        borderColor: COLORS.white,
                      }}
                    />
                    <TblComView
                      title={'Employee Id'}
                      getWidth={screenWidth / 4}
                      customStyle={treeReqStyle.tableHeaderText}
                      customViewStyle={{
                        borderRightWidth: 1,
                        borderColor: COLORS.white,
                      }}
                    />
                    <TblComView
                      title={'Punch Time'}
                      getWidth={screenWidth / 4}
                      customStyle={treeReqStyle.tableHeaderText}
                      customViewStyle={{
                        borderRightWidth: 1,
                        borderColor: COLORS.white,
                      }}
                    />
                  </View>
                  <ScrollView
                    style={{
                      maxHeight: screenHeight / 1.1,
                    }}>
                    {rtkPunchApprovalData &&
                      rtkPunchApprovalData?.map((item: any, index: number) => {
                        const isLastItem =
                          index === rtkPunchApprovalData?.length - 1;
                        const approvedPunch =
                          item?.ActionStatus.toLowerCase() === 'approved';
                        const notApprovedYet =
                          item?.ActionStatus.toLowerCase() === 'pending';
                        const unapprovedPunch =
                          item?.ActionStatus.toLowerCase() === 'unapproved';

                        return (
                          <View
                            key={index}
                            style={{
                              flexDirection: 'row',
                              backgroundColor: notApprovedYet
                                ? COLORS.white
                                : unapprovedPunch
                                ? COLORS.errorLight95
                                : COLORS.white90,
                              marginBottom:
                                isLastItem && rtkPunchApprovalData?.length > 16
                                  ? 70
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

                            <View
                              style={{
                                width: screenWidth / 2,
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: screenWidth > 550 ? 11 : 10,
                                paddingVertical: 4,
                              }}>
                              <Button
                                style={{
                                  backgroundColor: COLORS.snowLight80,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minHeight:
                                    screenWidth > 550
                                      ? screenWidth / 16
                                      : screenWidth / 13,
                                  minWidth:
                                    screenWidth > 550
                                      ? screenWidth / 12
                                      : screenWidth / 10,
                                  borderRadius: 3,
                                }}
                                onPress={async () => {
                                  await setBooleanStatus(prev => ({
                                    ...prev,
                                    isModalApproveOpen: false,
                                    isModalDeleteOpen: false,
                                    mapViewModalOpen: true,
                                    isDeleting: false,
                                    isApprove: false,
                                    actionData: item,
                                  }));
                                }}>
                                <MCIcon
                                  name="eye"
                                  color={COLORS.black}
                                  size={
                                    screenWidth > 550
                                      ? screenWidth / 25
                                      : screenWidth / 18
                                  }
                                />
                              </Button>
                              <Button
                                style={{
                                  backgroundColor: notApprovedYet
                                    ? COLORS.snowLight70
                                    : COLORS.darkInactiveColor,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minHeight:
                                    screenWidth > 550
                                      ? screenWidth / 16
                                      : screenWidth / 13,
                                  minWidth:
                                    screenWidth > 550
                                      ? screenWidth / 4
                                      : screenWidth / 5,
                                  borderRadius: 3,
                                }}
                                onPress={async () => {
                                  notApprovedYet
                                    ? await setBooleanStatus(prev => ({
                                        ...prev,
                                        isModalApproveOpen: true,
                                        isModalDeleteOpen: false,
                                        mapViewModalOpen: false,
                                        isDeleting: false,
                                        isApprove: false,
                                        actionData: item,
                                      }))
                                    : unapprovedPunch
                                    ? ToastMsg({
                                        text1: 'Already Un-Approved !',
                                        type: 'info',
                                      })
                                    : ToastMsg({
                                        text1: 'Already Approved !',
                                        type: 'info',
                                      });
                                }}>
                                <Text
                                  style={[
                                    punchEntryStyle.txtStyle,
                                    {
                                      color: notApprovedYet
                                        ? COLORS.black
                                        : unapprovedPunch
                                        ? COLORS.errorLight80
                                        : COLORS.white50,
                                    },
                                  ]}>
                                  {notApprovedYet
                                    ? 'Approve'
                                    : unapprovedPunch
                                    ? 'Unapproved'
                                    : 'Approved'}
                                </Text>
                              </Button>

                              <Button
                                style={{
                                  backgroundColor: notApprovedYet
                                    ? COLORS.errorLight90
                                    : COLORS.darkInactiveColor,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minHeight:
                                    screenWidth > 550
                                      ? screenWidth / 16
                                      : screenWidth / 13,
                                  minWidth:
                                    screenWidth > 550
                                      ? screenWidth / 12
                                      : screenWidth / 10,
                                  borderRadius: 3,
                                }}
                                onPress={async () => {
                                  notApprovedYet
                                    ? await setBooleanStatus(prev => ({
                                        ...prev,
                                        isModalApproveOpen: false,
                                        isModalDeleteOpen: true,
                                        mapViewModalOpen: false,
                                        isDeleting: false,
                                        isApprove: false,
                                        actionData: item,
                                      }))
                                    : unapprovedPunch
                                    ? ToastMsg({
                                        text1: 'Already Un-Approved !',
                                        type: 'info',
                                      })
                                    : ToastMsg({
                                        text1: 'Already Approved !',
                                        type: 'info',
                                      });
                                }}>
                                <MCIcon
                                  name="delete"
                                  color={
                                    notApprovedYet
                                      ? COLORS.red
                                      : unapprovedPunch
                                      ? COLORS.errorLight85
                                      : COLORS.white60
                                  }
                                  size={
                                    screenWidth > 550
                                      ? screenWidth / 25
                                      : screenWidth / 18
                                  }
                                />
                              </Button>
                            </View>

                            <TblComView
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                              title={item?.EmployeeName}
                              getWidth={screenWidth / 3.3}
                            />
                            <TblComView
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                              title={
                                item?.WorkDate ? formatDate(item?.WorkDate) : ''
                              }
                              getWidth={screenWidth / 4}
                            />
                            <TblComView
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                              title={item?.ActionStatus}
                              getWidth={screenWidth / 4}
                            />
                            {/* <TblComView
                            customViewStyle={{
                              borderBottomWidth: 1,
                              borderRightWidth: 1,
                              borderColor: COLORS.snowColor,
                            }}
                            title={item?.PunchStatus}
                            getWidth={screenWidth / 4}
                          /> */}
                            <TblComView
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                              title={item?.EmployeeID}
                              getWidth={screenWidth / 4}
                            />

                            <TblComView
                              title={item?.Time}
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

        {(!rtkPunchApprovalData ||
          (rtkPunchApprovalData?.length <= 0 &&
            !punchApprovalError &&
            !punchApprovalRefreshing &&
            !punchApprovalLoading)) && (
          <RefreshBtn
            refreshOnPress={() => {
              punchApprovalRefetch();
            }}
          />
        )}

        <ConfirmModal
          isVisible={
            booleanStatus?.isModalApproveOpen
              ? booleanStatus?.isModalApproveOpen
              : booleanStatus?.isModalDeleteOpen
              ? booleanStatus?.isModalDeleteOpen
              : booleanStatus?.mapViewModalOpen
          }
          modalWidth={screenWidth > 550 ? screenWidth / 1.5 : screenWidth / 1.3}
          modalAnimationIn="zoomIn"
          modalAnimationOut="zoomOut"
          onClose={hideModal}>
          {booleanStatus?.mapViewModalOpen && (
            <View
              style={[
                confirmModalStyle.modalContainer,
                {minHeight: screenHeight / 2},
              ]}>
              <MapView
                style={{
                  height: screenHeight / 2.2,
                  width: '100%',
                  backgroundColor: COLORS.white,
                }}
                // @ts-ignore
                region={{
                  // @ts-ignore
                  latitude: booleanStatus?.actionData?.Lat,
                  // @ts-ignore
                  longitude: booleanStatus?.actionData?.Lon,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                // provider="google"
              >
                <Marker
                  coordinate={{
                    // @ts-ignore
                    latitude: booleanStatus?.actionData?.Lat,
                    // @ts-ignore
                    longitude: booleanStatus?.actionData?.Lon,
                  }}
                  title="Punch Entry Location"
                  // @ts-ignore
                  description={booleanStatus?.actionData?.Remarks}
                />
              </MapView>
            </View>
          )}
          {(booleanStatus?.isModalApproveOpen ||
            booleanStatus?.isModalDeleteOpen) && (
            <View
              style={[
                confirmModalStyle.modalContainer,
                {
                  backgroundColor: booleanStatus?.isModalApproveOpen
                    ? COLORS.snowLight95
                    : COLORS.errorLight95,
                },
              ]}>
              <Text style={confirmModalStyle.headerStyle}>Are your sure ?</Text>
              <Text style={confirmModalStyle.messageStyle}>
                {booleanStatus?.isModalApproveOpen
                  ? `You want to Approve Mr. ${booleanStatus?.actionData?.EmployeeName}'s punch !`
                  : `You want to Delete Mr. ${booleanStatus?.actionData?.EmployeeName}'s punch !`}
              </Text>

              <View
                style={[
                  punchEntryStyle.btnContainer,
                  {
                    width: '100%',
                    marginTop: screenWidth > 550 ? 30 : 20,
                    marginBottom: screenWidth > 550 ? 10 : 5,
                  },
                ]}>
                <Button
                  style={confirmModalStyle.cancelBtnStyle}
                  onPress={hideModal}>
                  <Text
                    style={[punchEntryStyle.txtStyle, {color: COLORS.black}]}>
                    No
                  </Text>
                </Button>
                <Button
                  style={confirmModalStyle.deleteBtnStyle}
                  onPress={async () => {
                    // tokens, Id, approvedDelete, TextMode
                    booleanStatus?.isModalApproveOpen
                      ? (setBooleanStatus(prev => ({
                          ...prev,
                          isModalDeleteOpen: false,
                          isDeleting: false,
                          isApprove: true,
                        })),
                        punchApproveDeleteFunc(
                          booleanStatus?.actionData,
                          getAccessableInfo?.payrollLoginInfo?.Token,
                          3,
                        ))
                      : (setBooleanStatus(prev => ({
                          ...prev,
                          isModalApproveOpen: false,
                          isDeleting: true,
                          isApprove: false,
                        })),
                        punchApproveDeleteFunc(
                          booleanStatus?.actionData,
                          getAccessableInfo?.payrollLoginInfo?.Token,
                          2,
                        ));
                  }}>
                  {booleanStatus?.isDeleting || booleanStatus?.isApprove ? (
                    <ActivityIndicator
                      size={screenWidth > 550 ? 30 : 25}
                      color={COLORS.white}
                    />
                  ) : (
                    <Text
                      style={[punchEntryStyle.txtStyle, {color: COLORS.black}]}>
                      {booleanStatus?.isModalApproveOpen
                        ? 'Yes, Approve !'
                        : 'Yes, Delete !'}
                    </Text>
                  )}
                </Button>
              </View>
            </View>
          )}
        </ConfirmModal>
      </View>
    </Container>
  );
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default PunchApprovalScreen;
