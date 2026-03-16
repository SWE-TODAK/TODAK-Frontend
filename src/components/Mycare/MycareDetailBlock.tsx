// src/components/Mycare/MycareDetailBlock.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function MycareDetailBlock({
  title,
  subtitle,
  subtitleColor,
  onPressSubtitle,
  rightIcon,
  children,
}: {
  title: string;
  subtitle?: string;
  subtitleColor?: string;
  onPressSubtitle?: () => void;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <View style={styles.dot} />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.dot} />
      </View>

      {!!subtitle && (
        <Pressable disabled={!onPressSubtitle} onPress={onPressSubtitle} style={styles.subtitleWrap}>
          <Text style={[styles.subtitle, subtitleColor ? { color: subtitleColor } : null]}>{subtitle}</Text>
        </Pressable>
      )}

      {!!rightIcon && <View style={styles.rightIconWrap}>{rightIcon}</View>}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: '#000000', fontSize: 16, fontWeight: '500' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#DEE9FB'},

  subtitleWrap: { alignItems: 'center', marginTop: 4, marginBottom: 8 },
  subtitle: { fontSize: 14, fontWeight: '500' },

  rightIconWrap: { position: 'absolute', right: 16, top: 0 },
});