import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import ImageModal from 'react-native-image-modal';
import {useAppContext} from '@contextApi/index';
import {useGetLeaveHistoryDataQuery} from '@rtk/features/api/apiSlice';
import AppURL from '@restApi/AppURL';
import ToastMsg from '@utils/handler/ToastMsg';
import leaveInfoStyle from '@utils/comStyle/leaveInfoStyle';
import AttendanceInfoSkeleton from '@components/skeleton/attendance/AttendanceInfoSkeleton';
import {COLORS} from '@utils/COLORS';
import TblComView from '@components/table/TblComView';
import treeReqStyle from '@utils/comStyle/treeReqStyle';
import MCIcon from '@components/icon/MCIcon';
import Progressbar from '@components/Progressbar';
import {formatDate} from '@utils/handler/formatDate';
import PdfModal from '@components/modal/PdfModal';
import RefreshBtn from '@components/RefreshBtn';
import ConfirmModal from '@components/modal/ConfirmModal';
import confirmModalStyle from '@utils/comStyle/modal/confirmModalStyle';
import punchEntryStyle from '@utils/comStyle/punchEntryStyle';
import Button from '@components/button/Button';

interface Props {
  getToken: string;
}

const LeaveHistoryScreen: FC<Props> = props => {
  const {getAccessableInfo, isLeaveApply, setIsLeaveApply} = useAppContext();
  const [deleteStatus, setDeleteStatus] = useState({
    isModalOpen: false,
    deleteId: null,
    isDeleting: false,
  });
  const {
    data: rtkLeaveHistoryData,
    isLoading: leaveHistoryLoading,
    isError: leaveHistoryError,
    isFetching: leaveHistoryRefreshing,
    refetch: leaveHistoryRefetch,
  } = useGetLeaveHistoryDataQuery({
    baseURL: `${getAccessableInfo?.loginInfo?.loginBaseURL}`,
    token: props.getToken,
  });

  useEffect(() => {
    if (isLeaveApply) {
      leaveHistoryRefetch().then(res => setIsLeaveApply(false));
    }
  }, [isLeaveApply]);

  const LeaveDeleteFunc = async (id: any, token: string) => {
    setDeleteStatus(prev => ({
      ...prev,
      isDeleting: true,
    }));
    try {
      const deleteRes = await axios.get(
        AppURL.deleteLeave(
          `${getAccessableInfo?.loginInfo?.loginBaseURL}`,
          id,
          token,
        ),
      );

      const leaveDelete = await deleteRes?.data;

      await ToastMsg({
        text1: `${leaveDelete?.Name}`,
        type: 'success',
      });

      await setDeleteStatus(prev => ({
        ...prev,
        isDeleting: false,
      }));
      setTimeout(() => {
        hideModal();
      }, 500);

      console.log('deleteRes: ', JSON.stringify(leaveDelete, null, 2));
    } catch (error) {
      // @ts-ignore
      console.log('LeaveDeleteFunc Error: ', error?.message);
      setTimeout(() => {
        setDeleteStatus(prev => ({
          ...prev,
          isDeleting: false,
        }));
      }, 4000);
    }
  };

  const handleRefresh = () => {
    leaveHistoryRefetch();
  };

  const formatDesignation = (designation: any) => {
    const words = designation.trim().split(' ');
    if (words.length > 1) {
      return words.map((word: any) => word[0].toUpperCase() + '.').join(' ');
    }
    return designation;
  };

  const hideModal = () => {
    setDeleteStatus(prev => ({
      ...prev,
      isModalOpen: false,
      deleteId: null,
    }));
  };

  return (
    <View style={[leaveInfoStyle.containerStyle, {paddingHorizontal: 10}]}>
      <View
        style={{
          marginTop:
            !leaveHistoryLoading &&
            !leaveHistoryError &&
            !leaveHistoryRefreshing
              ? 10
              : 0,
        }}>
        {(leaveHistoryLoading || leaveHistoryRefreshing) &&
          !leaveHistoryError && <AttendanceInfoSkeleton />}
        {!leaveHistoryLoading &&
          !leaveHistoryError &&
          !leaveHistoryRefreshing &&
          rtkLeaveHistoryData &&
          rtkLeaveHistoryData?.length > 0 && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              refreshControl={
                <RefreshControl
                  tintColor={COLORS.red}
                  refreshing={leaveHistoryRefreshing}
                  onRefresh={handleRefresh}
                />
              }>
              <View
                style={{
                  flexDirection: 'column',
                  //   paddingHorizontal: 10,
                  height: screenHeight / 1.1,
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
                    getWidth={screenWidth / 6}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'leave Name'}
                    getWidth={screenWidth / 3.5}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <View style={styles.headerMainContainer}>
                    <Text style={treeReqStyle.tableHeaderText}>
                      Approved Status
                    </Text>
                    <View style={styles.headerInnerContainer}>
                      <View style={leaveInfoStyle.headerRightContainer}>
                        <Text
                          style={[
                            treeReqStyle.tableHeaderText,
                            {
                              fontSize:
                                screenWidth > 550
                                  ? screenWidth / 45
                                  : screenWidth / 35,
                            },
                          ]}>
                          Approved By
                        </Text>
                      </View>
                      <View style={leaveInfoStyle.rightTxtContainer}>
                        <Text
                          style={[
                            treeReqStyle.tableHeaderText,
                            {
                              fontSize:
                                screenWidth > 550
                                  ? screenWidth / 45
                                  : screenWidth / 35,
                            },
                          ]}>
                          Status
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TblComView
                    title={'From Date'}
                    getWidth={screenWidth / 3.5}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'To Date'}
                    getWidth={screenWidth / 3.5}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />

                  <TblComView
                    title={'Application Date'}
                    getWidth={screenWidth / 3.5}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'Reason'}
                    getWidth={screenWidth / 2.5}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                  <TblComView
                    title={'Leave Documents'}
                    getWidth={screenWidth / 2}
                    customStyle={treeReqStyle.tableHeaderText}
                    customViewStyle={{
                      borderRightWidth: 1,
                      borderColor: COLORS.white,
                    }}
                  />
                </View>
                <ScrollView
                  style={{
                    maxHeight: screenHeight / 1.2,
                  }}>
                  {rtkLeaveHistoryData &&
                    rtkLeaveHistoryData
                      ?.slice()
                      ?.reverse()
                      ?.map((item: any, index: number) => {
                        const isLast =
                          index === rtkLeaveHistoryData?.length - 1;

                        const leaveDocuments = item?.FileArray;
                        return (
                          <View
                            key={index}
                            style={{
                              flexDirection: 'row',
                              backgroundColor:
                                item?.ApprovedStatus.toLowerCase() === 'pending'
                                  ? COLORS.waitingLight100
                                  : item?.ApprovedStatus.toLowerCase() ===
                                    'approved'
                                  ? COLORS.snowLight100
                                  : COLORS.white,
                              marginBottom:
                                isLast && rtkLeaveHistoryData?.length > 13
                                  ? 50
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
                                item?.ApprovedStatus.toLowerCase() !==
                                'approved'
                                  ? setDeleteStatus(prev => ({
                                      ...prev,
                                      isModalOpen: true,
                                      deleteId: item?.Id,
                                    }))
                                  : ToastMsg({
                                      text1: 'Already Approved !',
                                      type: 'info',
                                    });
                              }}
                              style={{
                                width: screenWidth / 6,
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <MCIcon
                                name="delete"
                                color={
                                  item?.ApprovedStatus.toLowerCase() !==
                                  'approved'
                                    ? COLORS.red
                                    : COLORS.darkInactiveColor
                                }
                                size={
                                  screenWidth > 550
                                    ? screenWidth / 25
                                    : screenWidth / 15
                                }
                              />
                            </Pressable>

                            <TblComView
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                              title={item?.LeaveName}
                              getWidth={screenWidth / 3.5}
                            />
                            <View style={[leaveInfoStyle.multiRowContainer]}>
                              <View
                                style={[
                                  leaveInfoStyle.leftTxtContainer,
                                  {
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                  },
                                ]}>
                                <ScrollView
                                  horizontal
                                  showsHorizontalScrollIndicator={false}
                                  contentContainerStyle={{
                                    alignItems: 'center',
                                  }}>
                                  {item?.ApprovalUserList &&
                                    item?.ApprovalUserList?.length > 0 &&
                                    item?.ApprovalUserList?.map(
                                      (innerItem: any, innerIndex: number) => {
                                        const isLastUser =
                                          innerIndex ===
                                          item.ApprovalUserList.length - 1;

                                        const formattedDesignation =
                                          formatDesignation(
                                            innerItem?.Designation,
                                          );
                                        return (
                                          <View
                                            key={innerIndex}
                                            style={{paddingVertical: 2}}>
                                            {/* <View key={innerIndex}>
                                                {innerItem?.SignatureYesNo ===
                                                  1 && (
                                                  <Text
                                                    style={[
                                                      leaveInfoStyle.txtStyle,
                                                      {
                                                        backgroundColor:
                                                          COLORS.snowLight90,
                                                        paddingHorizontal: 3,
                                                        borderRadius: 4,
                                                        marginRight: 5,
                                                        marginVertical: 3,
                                                      },
                                                    ]}>
                                                    {innerItem?.Designation.toLowerCase().trim() ===
                                                    'department head'
                                                      ? 'Depart. Head'
                                                      : innerItem?.Designation}
                                                  </Text>
                                                )}
                                              </View> */}
                                            <Progressbar
                                              title={formattedDesignation}
                                              isComplete={
                                                innerItem?.SignatureYesNo === 1
                                              }
                                              borderWidth={2}
                                              borderColor={
                                                innerItem?.SignatureYesNo === 1
                                                  ? COLORS.snowColor
                                                  : COLORS.errorLight90
                                              }
                                              height={20}
                                              isNext={!isLastUser && true}
                                              nextWidth={
                                                screenWidth > 550
                                                  ? screenWidth / 10
                                                  : screenWidth / 9
                                              }
                                              nextHeight={4}
                                              nextColor={
                                                innerItem?.SignatureYesNo === 1
                                                  ? COLORS.snowColor
                                                  : COLORS.errorLight90
                                              }
                                            />
                                          </View>
                                        );
                                      },
                                    )}
                                </ScrollView>
                              </View>
                              <View style={leaveInfoStyle.rightTxtContainer}>
                                <Text style={[leaveInfoStyle.txtStyle]}>
                                  {item?.ApprovedStatus.toLowerCase().trim() ===
                                  'approved'
                                    ? 'Approved'
                                    : item?.ApprovedStatus.toLowerCase().trim() ===
                                      'post approve'
                                    ? 'Post'
                                    : 'Pre'}
                                </Text>
                              </View>
                            </View>

                            <TblComView
                              title={
                                item?.FromDate ? formatDate(item.FromDate) : ''
                              }
                              getWidth={screenWidth / 3.5}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />
                            <TblComView
                              title={
                                item?.ToDate ? formatDate(item.ToDate) : ''
                              }
                              getWidth={screenWidth / 3.5}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />
                            <TblComView
                              title={
                                item?.TransactionDate
                                  ? formatDate(item.TransactionDate)
                                  : ''
                              }
                              getWidth={screenWidth / 3.5}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />

                            <TblComView
                              title={item?.Reason}
                              getWidth={screenWidth / 2.5}
                              customViewStyle={{
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                              }}
                            />
                            <View
                              style={{
                                width: screenWidth / 2,
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderColor: COLORS.snowColor,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              {leaveDocuments &&
                                leaveDocuments?.length > 0 &&
                                leaveDocuments?.map(
                                  (doc: any, docIndex: number) => {
                                    const isFileLast =
                                      docIndex === leaveDocuments?.length - 1;
                                    const sickFile = `data:image/png;base64,${doc?.AttestedFilesBase64}`;

                                    return (
                                      <View
                                        key={docIndex}
                                        style={{
                                          marginRight: !isFileLast ? 10 : 0,
                                          marginVertical: 5,
                                        }}>
                                        {doc?.FileExtension.toLowerCase() ===
                                        'pdf' ? (
                                          <PdfModal
                                            base64Pdf={doc.AttestedFilesBase64}
                                            thumbnailStyle={{
                                              height:
                                                screenWidth > 550
                                                  ? screenWidth / 10
                                                  : screenWidth / 10,
                                              width:
                                                screenWidth > 550
                                                  ? screenWidth / 13
                                                  : screenWidth / 13,
                                              borderColor: COLORS.white50,
                                              borderWidth: 1,
                                              borderRadius: 5,
                                            }}
                                            closeButtonStyle={{
                                              backgroundColor:
                                                COLORS.errorColor,
                                            }}
                                            closeButtonTextStyle={{
                                              color: COLORS.black,
                                              fontSize:
                                                screenWidth > 550
                                                  ? screenWidth / 35
                                                  : screenWidth / 28,
                                            }}
                                          />
                                        ) : (
                                          <ImageModal
                                            resizeMode="stretch"
                                            style={[
                                              styles.proImgStyle,
                                              {
                                                marginRight:
                                                  item?.FileList?.length > 1 &&
                                                  !isFileLast
                                                    ? 3
                                                    : 0,
                                                marginBottom:
                                                  item?.FileList?.length > 1 &&
                                                  !isFileLast
                                                    ? 4
                                                    : 0,
                                              },
                                            ]}
                                            source={{uri: sickFile}}
                                          />
                                        )}
                                      </View>
                                    );
                                  },
                                )}
                            </View>
                          </View>
                        );
                      })}
                </ScrollView>
              </View>
            </ScrollView>
          )}
      </View>

      {(!rtkLeaveHistoryData ||
        (rtkLeaveHistoryData?.length <= 0 &&
          !leaveHistoryLoading &&
          !leaveHistoryError &&
          !leaveHistoryRefreshing)) && (
        <RefreshBtn
          refreshOnPress={() => {
            leaveHistoryRefetch();
          }}
        />
      )}

      <ConfirmModal
        isVisible={deleteStatus?.isModalOpen}
        modalWidth={screenWidth > 550 ? screenWidth / 1.8 : screenWidth / 1.5}
        modalAnimationIn="zoomIn"
        modalAnimationOut="zoomOut"
        onClose={hideModal}>
        <View style={confirmModalStyle.modalContainer}>
          <Text style={confirmModalStyle.headerStyle}>Are your sure ?</Text>
          <Text style={confirmModalStyle.messageStyle}>
            You want to Delete this Leave !
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
              <Text style={[punchEntryStyle.txtStyle, {color: COLORS.black}]}>
                No
              </Text>
            </Button>
            <Button
              style={confirmModalStyle.deleteBtnStyle}
              onPress={async () => {
                LeaveDeleteFunc(deleteStatus?.deleteId, props.getToken);
              }}>
              {deleteStatus?.isDeleting ? (
                <ActivityIndicator
                  size={screenWidth > 550 ? 30 : 25}
                  color={COLORS.white}
                />
              ) : (
                <Text style={[punchEntryStyle.txtStyle, {color: COLORS.black}]}>
                  Yes, Delete !
                </Text>
              )}
            </Button>
          </View>
        </View>
      </ConfirmModal>
    </View>
  );
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const styles = StyleSheet.create({
  headerMainContainer: {
    width: screenWidth / 1.5,
    borderRightWidth: 1,
    borderColor: COLORS.white,
    alignItems: 'center',
  },
  headerInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  stepContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  stepText: {
    fontSize: 16,
    marginVertical: 5,
  },
  proImgStyle: {
    height: screenWidth > 550 ? screenWidth / 10 : screenWidth / 10,
    width: screenWidth > 550 ? screenWidth / 13 : screenWidth / 13,
    borderColor: COLORS.white50,
    borderWidth: 1,
    borderRadius: 5,
    // alignSelf: 'center',
  },
});

export default LeaveHistoryScreen;
