import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Pdf from 'react-native-pdf';

interface PdfViewerProps {
  base64Pdf: string;
  thumbnailStyle?: StyleProp<ViewStyle>;
  modalPdfStyle?: StyleProp<ViewStyle>;
  closeButtonStyle?: StyleProp<ViewStyle>;
  closeButtonTextStyle?: StyleProp<TextStyle>;
}

const PdfModal: React.FC<PdfViewerProps> = ({
  base64Pdf,
  thumbnailStyle,
  modalPdfStyle,
  closeButtonStyle,
  closeButtonTextStyle,
}) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleModal}>
        <Pdf
          trustAllCerts={false}
          source={{
            uri: `data:application/pdf;base64,${base64Pdf}`,
            cache: true,
          }}
          style={[styles.pdfThumbnail, thumbnailStyle]}
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        onRequestClose={toggleModal}
        animationType="slide"
        transparent={false}>
        <View style={styles.modalContainer}>
          <Pdf
            trustAllCerts={false}
            source={{
              uri: `data:application/pdf;base64,${base64Pdf}`,
              cache: true,
            }}
            style={[styles.fullPdf, modalPdfStyle]}
            onError={error => {
              console.log('PDF Load Error:', error);
            }}
          />
          <TouchableOpacity
            style={[styles.closeButton, closeButtonStyle]}
            onPress={toggleModal}>
            <Text style={[styles.closeButtonText, closeButtonTextStyle]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pdfThumbnail: {
    height: 55,
    width: 55,
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  fullPdf: {
    flex: 1,
    width: '100%',
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
    minWidth: '30%',
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'WorkSans-Regular',
  },
});

export default PdfModal;
