import {COLORS} from '@utils/COLORS';
import treeReqStyle from '@utils/comStyle/treeReqStyle';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

interface tblComViewInterface {
  title?: any;
  getWidth?: any;
  customStyle?: object;
  customViewStyle?: object;
}

const TblComView: React.FC<tblComViewInterface> = ({
  title,
  getWidth,
  customStyle,
  customViewStyle,
}) => {
  return (
    <View
      style={[
        treeReqStyle.tableViewStyle,
        customViewStyle,
        {width: getWidth, paddingHorizontal: 2},
      ]}>
      <Text style={[styles.textStyle, customStyle]}>{title}</Text>
    </View>
  );
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
  textStyle: {
    fontSize: screenWidth > 550 ? screenWidth / 40 : screenWidth / 35,
    color: COLORS.black,
    paddingVertical: 2,
    fontFamily: 'WorkSans-Regular',
  },
});

export default TblComView;
