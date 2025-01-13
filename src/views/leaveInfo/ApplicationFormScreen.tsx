import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import {useIsFocused} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {Snackbar} from 'react-native-paper';
import {useAppContext} from '@contextApi/index';
import {LeaveCategoriesInterface} from '@interface/leaveInformation/LeaveCategoriesInterface';
import AppURL from '@restApi/AppURL';
import {
  calculateDate,
  formatDate,
  formatDateTime,
} from '@utils/handler/formatDate';
import ToastMsg from '@utils/handler/ToastMsg';
import leaveInfoStyle from '@utils/comStyle/leaveInfoStyle';
import {COLORS} from '@utils/COLORS';
import profileStyle from '@utils/comStyle/profileStyle';
import MCIcon from '@components/icon/MCIcon';
import FileUploadCard from '@components/fileUpload/FileUploadCard';
import Button from '@components/button/Button';

interface Props {
  getToken: string;
}

const ApplicationFormScreen: FC<Props> = ({getToken}) => {
  const isFocused = useIsFocused();
  const {getAccessableInfo, setIsLeaveApply} = useAppContext();
  const [leaveCategories, setLeaveCategories] = useState<
    LeaveCategoriesInterface[] | null
  >(null);
  const [leaveCategoriesOpen, setLeaveCategoriesOpen] = useState(false);
  const [leaveCategoryValue, setLeaveCategoryValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
    reason: '',
    leavePlace: '',
    shortExplanation: '',
  });
  const [pickedSLDocuments, setPickedSLDocuments] = useState({
    base64Documents: '',
    documentsExtension: '',
    documents: [],
    uri: '',
  });

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarTxt, setSnackbarTxt] = useState({
    leaveSubmit: '',
    notSubmit: '',
  });
  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);

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

      setPickedDate((prevTree: any) => ({
        ...prevTree,
        from: currentDate,
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

      setPickedDate((prevTree: any) => ({
        ...prevTree,
        to: currentDate,
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

  const getLeaveCategoriesFunc = async (token: string) => {
    console.log(
      'Get leave categories: ',
      AppURL.getLeaveCategories(
        `${getAccessableInfo?.loginInfo?.loginBaseURL}`,
        token,
      ),
    );

    try {
      const res = await axios.get(
        AppURL.getLeaveCategories(
          `${getAccessableInfo?.loginInfo?.loginBaseURL}`,
          token,
        ),
      );
      const resResult = res?.data;

      console.log('Leave Categories: ', JSON.stringify(resResult, null, 2));

      const formattedLeaveCategories =
        resResult?.map((item: any) => ({
          value: item.Id,
          label: item.Name,
        })) || [];

      setLeaveCategories(formattedLeaveCategories);
    } catch (error) {
      console.log('getLeaveCategoriesFunc Error:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getLeaveCategoriesFunc(getToken);
    }
  }, [isFocused, getToken]);

  // Function to strip time from date
  // console.log('getToken: ', getToken);

  const totalLeaveDays =
    // @ts-ignore
    (calculateDate(pickedDate.to) - calculateDate(pickedDate.from)) /
      (1000 * 60 * 60 * 24) +
    1;

  const requiredleaveApply =
    leaveCategoryValue &&
    pickedDate.from &&
    pickedDate.to &&
    inputValue?.reason.trim() &&
    totalLeaveDays >= 1;

  // console.log(
  //   'leave category value: ',
  //   JSON.stringify(leaveCategories, null, 2),
  // );
  // console.log('leave category value: ', leaveCategoryValue);

  const leaveApplyFunc = async (noOfDays: number, token: any) => {
    setIsLoading(true);
    setSnackbarTxt({
      leaveSubmit: '',
      notSubmit: '',
    });

    const fromdate = formatDateTime(pickedDate.from);
    const todate = formatDateTime(pickedDate.to);
    try {
      const applyData = await {
        FromDate: fromdate,
        ToDate: todate,
        Reason: inputValue?.reason,
        LeavePlace: inputValue?.leavePlace,
        Remarks: inputValue?.shortExplanation,
        LeaveId: leaveCategoryValue,
        TotalDays: noOfDays,
        FileArray: pickedSLDocuments?.documents,
        Token: token,
      };
      //console.log('ApplyData', JSON.stringify(applyData, null, 2));

      const {data} = await axios.post(
        AppURL.leaveApply(`${getAccessableInfo?.loginInfo?.loginBaseURL}`),
        applyData,
      );

      // console.log('data: ', JSON.stringify(data, null, 2));

      if (data?.Id === 11) {
        setIsLeaveApply(true);
        setSnackbarVisible(true);

        setSnackbarTxt(prevTxt => ({
          ...prevTxt,
          leaveSubmit: 'Successfully submitted !',
        }));

        setIsLoading(false);
        setLeaveCategoryValue(null);
        setPickedDate({
          from: '',
          to: '',
        });
        setInputValue({
          reason: '',
          leavePlace: '',
          shortExplanation: '',
        });
      } else {
        setSnackbarVisible(true);
        setSnackbarTxt(prevTxt => ({
          ...prevTxt,
          leaveSubmit: 'Failed to submit your leave !',
        }));
        // console.log('Failed to submit your leave. Try again !');

        setIsLoading(false);
        ToastMsg({
          text1: 'Failed to submit your leave. Try again !',
          type: 'error',
        });
      }
    } catch (error) {
      // @ts-ignore
      console.log('leaveApplyFunc Error: ', error?.message);
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
  };

  //   console.log('leaveCategories: ', JSON.stringify(leaveCategories, null, 2));

  return (
    <View
      style={[
        leaveInfoStyle.containerStyle,
        {padding: 15, alignItems: 'center'},
      ]}>
      <View>
        <View style={styles.innerContainerStyle}>
          {leaveCategories && (
            <DropDownPicker
              open={leaveCategoriesOpen}
              setOpen={setLeaveCategoriesOpen}
              value={leaveCategoryValue}
              setValue={setLeaveCategoryValue}
              items={leaveCategories}
              searchable={false}
              zIndex={2000}
              zIndexInverse={2000}
              placeholder="Select a Leave Category"
              style={{
                minHeight:
                  screenWidth > 650 ? screenWidth / 14 : screenWidth / 10,
                backgroundColor: COLORS.white,
                borderColor: COLORS.snowColor,
                borderWidth: 0.5,
              }}
              containerStyle={{
                width: '100%',
              }}
              textStyle={[
                profileStyle.txtStyle,
                {
                  textAlign: 'left',
                  color: leaveCategoryValue ? COLORS.black : COLORS.white60,
                },
              ]}
              dropDownContainerStyle={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.snowColor,
                borderWidth: 0.5,
              }}
              selectedItemLabelStyle={{
                color: COLORS.snowColor,
              }}
            />
          )}
          <View style={styles.dateMainContainer}>
            <Pressable
              style={styles.datePickerContainer}
              onPress={showFromDatepicker}>
              <Text
                style={[
                  profileStyle.txtStyle,
                  {
                    color: pickedDate?.from ? COLORS.black : COLORS.white60,
                  },
                ]}>
                {pickedDate?.from
                  ? formatDate(pickedDate?.from)
                  : 'Select From Date'}
              </Text>
              <MCIcon
                name="calendar-month-outline"
                size={screenWidth > 550 ? screenWidth / 25 : screenWidth / 20}
                color={pickedDate?.to ? COLORS.snowColor : COLORS.white60}
              />
            </Pressable>

            <Pressable
              style={styles.datePickerContainer}
              onPress={showToDatepicker}>
              <Text
                style={[
                  profileStyle.txtStyle,
                  {
                    color: pickedDate?.to ? COLORS.black : COLORS.white60,
                  },
                ]}>
                {pickedDate?.to ? formatDate(pickedDate?.to) : 'Select To Date'}
              </Text>
              <MCIcon
                name="calendar-month-outline"
                size={screenWidth > 550 ? screenWidth / 25 : screenWidth / 20}
                color={pickedDate?.to ? COLORS.snowColor : COLORS.white60}
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
          <View style={styles.totalLeaveContainer}>
            <Text
              style={[
                profileStyle.txtStyle,
                {
                  textAlign: 'left',
                  color: totalLeaveDays > 0 ? COLORS.black : COLORS.white60,
                },
              ]}>
              Total Days:
            </Text>
            <Text
              style={[
                styles.txtStyle,
                {
                  color: totalLeaveDays > 0 ? COLORS.black : COLORS.white60,
                },
              ]}>
              {totalLeaveDays ? totalLeaveDays : 0}
            </Text>
          </View>

          {leaveCategoryValue &&
            parseInt(leaveCategoryValue) === 498529 &&
            // @ts-ignore
            parseInt(totalLeaveDays) >= 2 && (
              <View style={{width: '100%'}}>
                <FileUploadCard
                  uploadMsg="Upload Your Sick Leave Documents"
                  fileUploadOnPress={async () => {
                    try {
                      const pickerResults = await DocumentPicker.pick({
                        presentationStyle: 'fullScreen',
                        copyTo: 'cachesDirectory',
                        allowMultiSelection: true,
                      });

                      console.log(
                        'pickerResults: ',
                        JSON.stringify(pickerResults, null, 2),
                      );

                      const updatedDocuments = await Promise.all(
                        pickerResults.map(async (file: any) => {
                          const base64Data = await RNFS.readFile(
                            file.uri,
                            'base64',
                          );

                          return {
                            AttestedFilesBase64: base64Data,
                            // @ts-ignore
                            FileExtension: file.type.split('/').pop(),
                          };
                        }),
                      );

                      setPickedSLDocuments((prevState: any) => ({
                        ...prevState,
                        documents: [
                          ...prevState.documents,
                          ...updatedDocuments,
                        ],
                      }));
                    } catch (error) {
                      if (DocumentPicker.isCancel(error)) {
                        console.log('Please select files to upload!');
                      } else {
                        console.error(error);
                      }
                    }
                  }}
                  pickedFiles={pickedSLDocuments.documents}
                  // @ts-ignore
                  setPickedSLDocuments={setPickedSLDocuments} // Pass the setter function
                  inputContainerMarginTop={5}
                  inputLabel="Attached Sick Documents"
                  isRequired={false}
                  requiredTextColor={COLORS.red}
                  requiredTextSize={screenWidth / 20}
                  labelFontSize={
                    screenWidth > 550 ? screenWidth / 35 : screenWidth / 30
                  }
                />
              </View>
            )}

          <TextInput
            style={styles.inputStyle}
            placeholder="Attach Your Leave Reason"
            placeholderTextColor={COLORS.white60}
            value={inputValue.reason}
            onChangeText={txt =>
              setInputValue((prev: any) => ({...prev, reason: txt}))
            }
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="Leave Place (Optional)"
            placeholderTextColor={COLORS.white60}
            value={inputValue.leavePlace}
            onChangeText={txt =>
              setInputValue((prev: any) => ({...prev, leavePlace: txt}))
            }
          />
          <TextInput
            multiline
            numberOfLines={4}
            style={[
              styles.inputStyle,
              {
                minHeight:
                  screenWidth > 650 ? screenWidth / 5 : screenWidth / 4,
                textAlign: 'left',
              },
            ]}
            textAlignVertical="top"
            placeholder="Shortly Explain Your Leave Reason (Optional)"
            placeholderTextColor={COLORS.white60}
            value={inputValue.shortExplanation}
            onChangeText={txt =>
              setInputValue((prev: any) => ({...prev, shortExplanation: txt}))
            }
          />
          <Button
            style={[
              styles.applyContainer,
              {
                marginVertical: 10,
                backgroundColor: requiredleaveApply
                  ? COLORS.snowColor
                  : COLORS.snowLight80,
              },
            ]}
            onPress={async () => {
              requiredleaveApply
                ? leaveApplyFunc(totalLeaveDays, getToken)
                : ToastMsg({
                    text1: 'Please complete the requied fields',
                    type: 'info',
                  });
            }}>
            {isLoading ? (
              <ActivityIndicator
                size={screenWidth > 550 ? 30 : 20}
                color={COLORS.white}
              />
            ) : (
              <Text
                style={[
                  profileStyle.txtStyle,
                  {
                    color: requiredleaveApply ? COLORS.white : COLORS.white60,
                  },
                ]}>
                Apply
              </Text>
            )}
          </Button>
        </View>
      </View>

      <Snackbar
        duration={2000}
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        style={[
          styles.snackbarContainer,
          {
            backgroundColor: snackbarTxt?.leaveSubmit
              ? COLORS.errorLight95
              : COLORS.successColor,
          },
        ]}>
        <Text style={styles.snackbarTxtStyle}>
          {snackbarTxt?.leaveSubmit
            ? snackbarTxt?.leaveSubmit
            : snackbarTxt?.notSubmit}
        </Text>
      </Snackbar>
    </View>
  );
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const styles = StyleSheet.create({
  innerContainerStyle: {
    // width: '100%',
    padding: 10,
    backgroundColor: COLORS.snowLight100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.snowLight80,
    shadowColor: COLORS.snowColor,
    shadowOffset: {
      width: 10,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  dateMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    // zIndex: -1000,
  },
  datePickerContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 7,
    paddingHorizontal: 10,
    width: '48%',
    borderColor: COLORS.snowColor,
    minHeight: screenWidth > 650 ? screenWidth / 14 : screenWidth / 10,
    borderRadius: 5,
    borderWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtStyle: {
    marginLeft: 5,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.black,
    fontSize: screenWidth > 550 ? screenWidth / 35 : screenWidth / 30,
  },
  totalLeaveContainer: {
    // zIndex: -1000,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  inputStyle: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: COLORS.snowColor,
    height: screenWidth > 650 ? screenWidth / 14 : screenWidth / 10,
    fontFamily: 'WorkSans-Regular',
    color: COLORS.black,
    fontSize: screenWidth > 550 ? screenWidth / 35 : screenWidth / 30,
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
  },
  applyContainer: {
    width: screenWidth > 550 ? '40%' : '50%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 10,
    minHeight: screenWidth > 650 ? screenWidth / 14 : screenWidth / 10,
  },
  snackbarContainer: {
    alignSelf: 'center',
    zIndex: 1000,
    bottom: 100,
    position: 'absolute',
    width: '70%',
    borderRadius: 30,
  },
  snackbarTxtStyle: {
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: 'WorkSans-Regular',
    // textTransform: 'capitalize',
  },
});

export default ApplicationFormScreen;
