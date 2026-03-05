import React, { forwardRef } from 'react';
import { TouchableOpacity, TouchableOpacityProps, Image, StyleSheet } from 'react-native';

type Props = {
  onPress?: () => void;
} & Omit<TouchableOpacityProps, 'onPress'>;

const InfoButton = forwardRef<React.ElementRef<typeof TouchableOpacity>, Props>(
  ({ onPress, ...rest }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        {...({ collapsable: false } as any)} // ✅ 여기만 바꿈 (TS 에러 해결)
        style={styles.btn}
        onPress={onPress}
        activeOpacity={0.7}
        {...rest}
      >
        <Image source={require('../../../assets/icons/info.png')} style={styles.icon} />
      </TouchableOpacity>
    );
  }
);

export default InfoButton;

const styles = StyleSheet.create({
  btn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  icon: { width: 22, height: 22, resizeMode: 'contain' },
});