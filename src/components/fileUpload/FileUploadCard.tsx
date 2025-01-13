import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';

import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import MCIcon from '@components/icon/MCIcon';
import {COLORS} from '@utils/COLORS';

interface FileUploadCardProps {
  uploadMsg?: string;
  isRequired?: boolean;
  requiredTextColor?: any;
  requiredTextSize?: any;
  inputLabel?: any;
  inputContainerVerticallyMargin?: any;
  inputContainerMarginTop?: any;
  labelFontSize?: any;
  fileUploadOnPress?: any;
  pickedFiles?: any;
  setPickedSLDocuments?: React.Dispatch<
    React.SetStateAction<{documents: any[]}>
  >; // Add type for setter
}

const FileUploadCard: React.FC<FileUploadCardProps> = ({
  uploadMsg = 'Uplaod required files',
  isRequired,
  requiredTextColor,
  requiredTextSize,
  inputLabel,
  inputContainerVerticallyMargin,
  inputContainerMarginTop,
  labelFontSize,
  fileUploadOnPress,
  pickedFiles,
  setPickedSLDocuments, // Receive setter function
}) => {
  const handleDeleteFile = (index: number) => {
    if (setPickedSLDocuments) {
      setPickedSLDocuments(prevState => ({
        ...prevState,
        documents: prevState.documents.filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <View
      // onPress={fileUploadOnPress}
      style={[
        styles.inputContainer,
        {
          marginVertical: inputContainerVerticallyMargin || 5,
          marginTop: inputContainerMarginTop,
        },
      ]}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.labelStyle, {fontSize: labelFontSize}]}>
          {inputLabel}
        </Text>
        {isRequired && (
          <Text
            style={[
              styles.requiredStyle,
              {color: requiredTextColor, fontSize: requiredTextSize},
            ]}>
            *
          </Text>
        )}
      </View>
      <View style={[styles.uploadContainerStyle, {paddingHorizontal: 5}]}>
        {pickedFiles && pickedFiles?.length <= 0 ? (
          <Pressable
            onPress={fileUploadOnPress}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}>
            <MCIcon
              name="cloud-upload"
              size={width / 10}
              color={COLORS.snowLight60}
            />
            <Text style={styles.textStyle}>{uploadMsg}</Text>
          </Pressable>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: 'red',
                width: '100%',
                height: '100%',
              }}>
              {pickedFiles &&
                pickedFiles?.length > 0 &&
                pickedFiles.map((file: any, index: number) => {
                  const sickFile = `data:image/png;base64,${file?.AttestedFilesBase64}`;
                  const isLastFile = index === pickedFiles.length - 1;
                  return (
                    <View
                      key={index}
                      style={{
                        marginRight: isLastFile ? 0 : 10,
                        borderRadius: 10,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        height: width / 6,
                        width: width / 6,
                      }}>
                      <Image
                        resizeMode="stretch"
                        // resizeMode="cover"
                        style={[
                          {
                            height: width / 6,
                            width: width / 6,
                            borderRadius: 10,
                            opacity: 0.7,
                          },
                        ]}
                        source={{uri: sickFile}}
                      />

                      <Pressable
                        onPress={() => handleDeleteFile(index)}
                        style={{
                          position: 'absolute',
                          top: width > 550 ? '35%' : '30%',
                          left: width > 550 ? '35%' : '30%',
                          backgroundColor: COLORS.errorLight90,
                          borderRadius: 100,
                          padding: 3,
                        }}>
                        <MCIcon
                          name="delete"
                          size={width > 550 ? width / 25 : width / 20}
                          color={COLORS.red}
                        />
                      </Pressable>
                    </View>
                  );
                })}
            </View>
          </ScrollView>
        )}
        {pickedFiles && pickedFiles?.length > 0 && (
          <Pressable
            onPress={fileUploadOnPress}
            style={styles.fileChangeIconStyle}>
            <MCIcon
              // name="cloud-upload-outline"
              name="pencil-box-multiple"
              size={width / 15}
              color={COLORS.snowColor}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default FileUploadCard;
const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  labelStyle: {
    color: COLORS.black,
    fontFamily: 'WorkSans-Regular',
  },
  requiredStyle: {
    marginLeft: 3,
  },
  uploadContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.snowLight60,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: 'dashed',
    height: width / 4,
    width: '100%',
  },
  textStyle: {
    color: COLORS.black,
    fontFamily: 'WorkSans-Regular',
    fontSize: width > 550 ? width / 36 : width / 30,
  },
  fileChangeContainer: {
    // backgroundColor: 'gray',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileChangeIconStyle: {
    position: 'absolute',
    zIndex: 1000,
    top: 0,
    right: 0,
  },
  fileNameContainerStyle: {width: '100%', alignItems: 'center', padding: 20},
});
