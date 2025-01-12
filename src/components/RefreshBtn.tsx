import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import refreshStyle from '@utils/comStyle/refreshStyle';
import MCIcon from './icon/MCIcon';
import {COLORS} from '@utils/COLORS';
import punchEntryStyle from '@utils/comStyle/punchEntryStyle';

interface Props {
  refreshOnPress?: () => void;
}

const RefreshBtn: FC<Props> = props => {
  return (
    <Pressable onPress={props.refreshOnPress} style={refreshStyle.btnContainer}>
      <MCIcon name="refresh" color={COLORS.snowColor} size={17} />
      <Text
        style={[
          punchEntryStyle.txtStyle,
          {color: COLORS.snowColor, marginLeft: 3},
        ]}>
        Refresh
      </Text>
    </Pressable>
  );
};

export default RefreshBtn;
