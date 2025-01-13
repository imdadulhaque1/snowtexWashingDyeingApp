import treeReqStyle from '@utils/comStyle/treeReqStyle';
import {Pressable, Text} from 'react-native';

interface activeStatusBarInterface {
  title?: any;
  width?: any;
  bBottomLeftRadius?: number;
  bBottomEndRadius?: number;
  bgColor?: string;
  txtColor?: string;
  txtSize?: number;
  onPress?(): void;
}

const ActivebarStatus: React.FC<activeStatusBarInterface> = ({
  title,
  width,
  bBottomEndRadius,
  bBottomLeftRadius,
  bgColor,
  txtColor,
  onPress,
  txtSize,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        treeReqStyle.btnContainerStyle,
        {
          width: width,
          borderBottomLeftRadius: bBottomLeftRadius,
          borderBottomEndRadius: bBottomEndRadius,
          backgroundColor: bgColor,
        },
      ]}>
      <Text
        style={{
          color: txtColor,
          fontFamily: 'WorkSans-Regular',
          fontSize: txtSize,
        }}>
        {title}
      </Text>
    </Pressable>
  );
};

export default ActivebarStatus;
