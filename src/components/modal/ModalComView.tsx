import {COLORS} from '@utils/COLORS';
import modalStyle from '@utils/comStyle/modalStyle';
import {Dimensions, Text, View} from 'react-native';
import {Divider} from 'react-native-paper';

interface ModalComViewInterface {
  label: string;
  value: any;
  borderTopColor?: any;
  borderTopWidth?: any;
  borderBottomColor?: any;
  borderBottomWidth?: any;
  borderTopLeftRadius?: any;
  borderTopRightRadius?: any;
  borderBottomLeftRadius?: any;
  borderBottomRightRadius?: any;
}

export const ModalComView: React.FC<ModalComViewInterface> = ({
  label,
  value,
  borderTopColor,
  borderTopWidth = 0,
  borderBottomColor,
  borderBottomWidth = 0,
  borderTopLeftRadius = 0,
  borderTopRightRadius = 0,
  borderBottomLeftRadius = 0,
  borderBottomRightRadius = 0,
}) => {
  return (
    <View
      style={{
        borderTopColor: borderTopColor,
        borderTopWidth: borderTopWidth,
        borderBottomColor: borderBottomColor,
        borderBottomWidth: borderBottomWidth,
        borderLeftColor: COLORS.snowLight60,
        borderLeftWidth: 1,
        borderRightColor: COLORS.snowLight60,
        borderRightWidth: 1,
        borderTopLeftRadius: borderTopLeftRadius,
        borderTopRightRadius: borderTopRightRadius,
        borderBottomLeftRadius: borderBottomLeftRadius,
        borderBottomRightRadius: borderBottomRightRadius,
        paddingVertical: 4,
        flexDirection: 'row',
        width: width / 1.2,
      }}>
      <Text style={[modalStyle.txtStyle, {width: '50%'}]}>{label}</Text>
      <Divider style={modalStyle.proDividerStyle} />
      <Text style={[modalStyle.txtStyle, {width: '48%'}]}>{value}</Text>
    </View>
  );
};

const {width, height} = Dimensions.get('window');
