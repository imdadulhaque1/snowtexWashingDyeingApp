import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {FC, ReactNode, useEffect} from 'react';
import {Divider} from 'react-native-paper';
import {AnimatePresence, MotiView} from 'moti';
import {useAppContext} from '@contextApi/index';
import {useGetLeaveBalanceDataQuery} from '@rtk/features/api/apiSlice';
import leaveInfoStyle from '@utils/comStyle/leaveInfoStyle';
import TreeReqSkeleton from '@components/skeleton/nurseryManagements/RequisitionListSkeleton';
import {COLORS} from '@utils/COLORS';
import treeReqStyle from '@utils/comStyle/treeReqStyle';
import drawerStyle from '@utils/comStyle/drawerStyle';
import RefreshBtn from '@components/RefreshBtn';

interface Props {
  getToken: string;
}

const LeaveBalanceScreen: FC<Props> = props => {
  const {getAccessableInfo, isLeaveApply, setIsLeaveApply} = useAppContext();
  const {
    data: rtkLeaveBalance,
    isLoading: leaveHistoryLoading,
    isError: leaveHistoryError,
    isFetching: leaveHistoryRefreshing,
    refetch: leaveHistoryRefetch,
  } = useGetLeaveBalanceDataQuery({
    baseURL: `${getAccessableInfo?.loginInfo?.loginBaseURL}`,
    token: props.getToken,
  });

  console.log(`${getAccessableInfo?.loginInfo?.loginBaseURL}`);
  console.log(props.getToken);

  const handleRefresh = () => {
    leaveHistoryRefetch();
  };

  useEffect(() => {
    if (isLeaveApply) {
      leaveHistoryRefetch().then(res => setIsLeaveApply(false));
    }
  }, [isLeaveApply]);

  return (
    <View style={leaveInfoStyle.containerStyle}>
      {!leaveHistoryError &&
        (leaveHistoryLoading || leaveHistoryRefreshing) && <TreeReqSkeleton />}
      {!leaveHistoryError &&
        !leaveHistoryLoading &&
        !leaveHistoryRefreshing &&
        rtkLeaveBalance &&
        rtkLeaveBalance?.length > 0 && (
          <ScrollView
            style={{
              maxHeight: screenHeight / 1.1,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                tintColor={COLORS.snowColor}
                refreshing={leaveHistoryRefreshing}
                onRefresh={handleRefresh}
              />
            }>
            <View
              style={[treeReqStyle.wrapperContainerStyle, {paddingBottom: 30}]}>
              {rtkLeaveBalance.map((item: any, index: number) => {
                return (
                  <View
                    key={index}
                    style={{
                      width:
                        screenWidth > 550
                          ? screenWidth / 3.3
                          : screenWidth / 2.3,
                      marginHorizontal: 5,
                    }}>
                    <AnimatePresence>
                      <MotiView
                        from={{scale: 1, opacity: 0.5}}
                        animate={{
                          scale: 1,
                          opacity: 1,
                        }}
                        // @ts-ignore
                        transition={{type: 'timing', duration: 500}}
                        style={[
                          drawerStyle.btnContainerStyle,
                          {
                            borderRadius: 10,
                            marginTop: 10,
                            paddingTop: 5,
                            borderWidth: 1,
                            borderColor: COLORS.snowLight90,
                            backgroundColor: COLORS.snowLight105,
                          },
                        ]}>
                        <ComView label="Allocated" value={item?.Allocated}>
                          <Divider
                            style={[
                              styles.dividerStyle,
                              {borderWidth: 0.25, marginVertical: 3},
                            ]}
                          />
                        </ComView>
                        <ComView label="Availed" value={item?.Allocated}>
                          <Divider
                            style={[
                              styles.dividerStyle,
                              {borderWidth: 0.25, marginVertical: 3},
                            ]}
                          />
                        </ComView>
                        <ComView label="Adjust" value={item?.Allocated}>
                          <Divider
                            style={[
                              styles.dividerStyle,
                              {borderWidth: 0.25, marginVertical: 3},
                            ]}
                          />
                        </ComView>
                        <ComView label="Deducted" value={item?.Allocated}>
                          <Divider
                            style={[
                              styles.dividerStyle,
                              {borderWidth: 0.25, marginVertical: 3},
                            ]}
                          />
                        </ComView>
                        <ComView label="Balance" value={item?.Allocated} />
                        <View
                          style={{
                            backgroundColor: COLORS.snowLight95,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 40,
                            marginTop: 8,
                          }}>
                          <Text
                            style={[
                              styles.textStyle,
                              {
                                color: COLORS.black,
                                textAlign: 'center',
                                fontFamily: 'WorkSans-Medium',
                              },
                            ]}>
                            {item?.LeaveName}
                          </Text>
                        </View>
                      </MotiView>
                    </AnimatePresence>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}

      {(!rtkLeaveBalance ||
        (rtkLeaveBalance?.length <= 0 &&
          leaveHistoryError &&
          !leaveHistoryLoading &&
          !leaveHistoryRefreshing)) && (
        <RefreshBtn
          refreshOnPress={() => {
            leaveHistoryRefetch();
          }}
        />
      )}
    </View>
  );
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'WorkSans-Regular',
    fontSize: screenWidth > 550 ? screenWidth / 35 : screenWidth / 27,
    color: COLORS.black,
  },
  dividerStyle: {
    borderColor: COLORS.snowLight90,
    borderWidth: 0.1,
    width: '100%',
    alignSelf: 'center',
  },
  innerContainerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});

export default LeaveBalanceScreen;

interface ComViewInterface {
  label?: string;
  value?: any;
  children?: ReactNode;
}

const ComView: React.FC<ComViewInterface> = ({label, value, children}) => {
  return (
    <View>
      <View style={styles.innerContainerStyle}>
        <View style={{width: '70%'}}>
          <Text style={styles.textStyle}>{label}</Text>
        </View>
        <View style={{width: '30%', alignItems: 'center'}}>
          <Text style={styles.textStyle}>{value}</Text>
        </View>
      </View>
      {children}
    </View>
  );
};
