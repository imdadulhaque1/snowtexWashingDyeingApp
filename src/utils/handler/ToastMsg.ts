import Toast from 'react-native-toast-message';

export interface props {
  type: string;
  text1?: string;
  text2?: string | any;
  position?: 'top' | 'bottom';
  time?: number;
}

const ToastMsg = ({type, text1, text2, position, time}: props) => {
  return Toast.show({
    type: type || 'success',
    text1: text1 || 'Success',
    text2: text2 || '',
    position: position || 'top',
    visibilityTime: time || 3000,
  });
};

export default ToastMsg;
