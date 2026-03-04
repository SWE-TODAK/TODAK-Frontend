import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

type Props = {
  onPress?: () => void;
};

export default function InfoButton({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={require('../../../assets/icons/info.png')}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  icon: { width: 22, height: 22, resizeMode: 'contain' },
});