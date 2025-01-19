import {
  Dimensions,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {FC, useState} from 'react';
import VersionNumber from 'react-native-version-number';
// import BottomHalfModal from '../../components/modal/ButtomHalfModal';
// import MCIcon from '../../components/MCIcon';
// import {COLORS} from '../../theme/Index';
import {useAppContext} from '../../stateManagements/contextApi';
import BottomHalfModal from './BottomHalfModal';
import {COLORS} from '@utils/COLORS';
import MCIcon from '@components/icon/MCIcon';

interface Props {
  isAvailableUpdate?: boolean;
}

const AppVersionUpdateModal: FC<Props> = ({isAvailableUpdate}) => {
  const {getVersionInfo} = useAppContext();
  let currentVersion = VersionNumber.appVersion;

  const downloadHandler = async () => {
    const apkUrl = getVersionInfo?.apkLink;

    try {
      if (apkUrl) {
        await Linking.openURL(apkUrl);
        console.log('APK download started.');
      } else {
        console.error('No download link provided.');
      }
    } catch (err) {
      console.error('Failed to open URL:', err);
    }
  };

  return (
    <BottomHalfModal
      isVisible={isAvailableUpdate ? isAvailableUpdate : false}
      onClose={() => {}}
      modalAnimationIn="slideInUp"
      modalAnimationOut="slideOutDown"
      bgCOLOR={COLORS.errorLight80}
      modalHeight="30%">
      <View
        style={{
          // backgroundColor: COLORS.snowLight100,
          width: screenWidth,
          alignItems: 'center',
          top: 20,
          position: 'absolute',
        }}>
        <MCIcon
          name={'alert-circle-outline'}
          size={screenWidth > 550 ? screenWidth / 10 : screenWidth / 8}
          color={COLORS.errorLight85}
        />
      </View>
      <Text
        style={[
          styles.wifiTxtStyle,
          {
            color: COLORS.snowColor,
            marginBottom: 10,
          },
        ]}>
        Snowtex FPC Version Updated !
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: getVersionInfo?.version ? 'space-between' : 'center',
          width: '90%',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              color: COLORS.black,
              fontSize: screenWidth > 550 ? screenWidth / 40 : screenWidth / 28,
              fontFamily: 'WorkSans-SemiBold',
            }}>
            {`Current version: `}
          </Text>
          <Text
            style={{
              color: COLORS.black,
              fontSize: screenWidth > 550 ? screenWidth / 40 : screenWidth / 28,
              fontFamily: 'WorkSans-Regular',
            }}>
            {currentVersion}
          </Text>
        </View>
        {getVersionInfo?.version && (
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: COLORS.black,
                fontSize:
                  screenWidth > 550 ? screenWidth / 40 : screenWidth / 28,
                fontFamily: 'WorkSans-SemiBold',
              }}>
              {`Updated version: `}
            </Text>
            <Text
              style={{
                color: COLORS.black,
                fontSize:
                  screenWidth > 550 ? screenWidth / 40 : screenWidth / 28,
                fontFamily: 'WorkSans-Regular',
              }}>
              {getVersionInfo?.version}
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: screenWidth,
          paddingHorizontal: 20,
          position: 'absolute',
          bottom: 20,
        }}>
        <Pressable
          style={{
            backgroundColor: COLORS.snowLight90,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: screenWidth > 550 ? screenWidth / 15 : screenWidth / 9,
            minWidth: screenWidth > 550 ? screenWidth / 4 : screenWidth / 2,
            borderRadius: 50,
          }}
          onPress={async () => {
            await downloadHandler();
            console.log('Snowtex FPC version Updated !');
          }}>
          <MCIcon
            name={'download'}
            size={screenWidth > 550 ? screenWidth / 20 : screenWidth / 15}
            color={COLORS.darkInactiveColor}
          />
          <Text
            style={[
              styles.wifiTxtStyle,
              {fontFamily: 'WorkSans-Medium', marginLeft: 3},
            ]}>
            Download
          </Text>
        </Pressable>
      </View>
    </BottomHalfModal>
  );
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const styles = StyleSheet.create({
  wifiTxtStyle: {
    color: COLORS.black,
    fontFamily: 'WorkSans-Regular',
    fontSize: screenWidth > 550 ? screenWidth / 35 : screenWidth / 25,
    textAlign: 'center',
  },
});

export default AppVersionUpdateModal;
