import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {ReactNode} from 'react';
import Modal from 'react-native-modal';
import MCIcon from '@components/icon/MCIcon';
import {COLORS} from '@utils/COLORS';

interface CustomizedModalProps {
  isVisible: boolean;
  onClose: () => void;
  modalAnimationIn: any;
  modalAnimationOut: any;
  children: ReactNode;
}

const CustomizedModal: React.FC<CustomizedModalProps> = ({
  isVisible,
  onClose,
  modalAnimationIn,
  modalAnimationOut,
  children,
}) => {
  return (
    <Modal
      statusBarTranslucent={true}
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn={modalAnimationIn}
      animationOut={modalAnimationOut}
      animationInTiming={2000}
      animationOutTiming={2000}
      backdropOpacity={0.6}>
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -50}>
        <View style={styles.modalView}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <MCIcon name="close" size={width / 15} color={COLORS.red} />
          </Pressable>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CustomizedModal;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
