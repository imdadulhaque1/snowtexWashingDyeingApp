import {StyleSheet, View, Dimensions} from 'react-native';
import React, {ReactNode} from 'react';
import Modal from 'react-native-modal';
import {COLORS} from '@utils/COLORS';

interface ConfirmModalProps {
  isVisible: boolean;
  onClose: () => void;
  modalAnimationIn: any;
  modalAnimationOut: any;
  modalWidth?: any;
  children: ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  onClose,
  modalAnimationIn,
  modalAnimationOut,
  children,
  modalWidth,
}) => {
  return (
    <Modal
      statusBarTranslucent={true}
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn={modalAnimationIn}
      animationOut={modalAnimationOut}
      animationInTiming={1000}
      animationOutTiming={1000}
      backdropOpacity={0.6}>
      <View style={[styles.modalView, {width: modalWidth}]}>{children}</View>
    </Modal>
  );
};

export default ConfirmModal;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    // padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
