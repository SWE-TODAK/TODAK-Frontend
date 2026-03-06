// src/components/Mycare/MycareDetailTopCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function MycareDetailTopCard({
  clinicName,
  timeLabel,
  deptName,
  doctorName,
  diseaseName,
}: {
  clinicName: string;
  timeLabel: string;
  deptName: string;
  doctorName: string;
  diseaseName: string;
}) {
  const hasDoctor = !!doctorName?.trim();
  const hasDisease = !!diseaseName?.trim();

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        {/* 상단 중앙 아이콘 */}
        <View style={styles.heartWrap}>
          <Image source={require('../../assets/photo/todak_logo.png')} style={styles.heartIcon} resizeMode="contain" />
        </View>

        <View style={styles.row}>
          <View style={styles.leftCol}>
            <Text style={styles.labelBlue}>병원명</Text>
            <Text style={[styles.labelBlue, { marginTop: 6 }]}>진료 시간</Text>
          </View>

          <View style={styles.rightCol}>
            <Text style={styles.valueBlue} numberOfLines={1}>{clinicName}</Text>
            <Text style={[styles.valueBlue, { marginTop: 6 }]}>{timeLabel}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.bottomRow}>
          {/* 진료과 */}
          <View style={styles.bottomItem}>
            <Image source={require('../../assets/icons/plus-search.png')} style={styles.bottomIcon} resizeMode="contain" />
            <Text style={styles.bottomLabel}>진료과</Text>
            <Text style={styles.bottomValue}>{deptName}</Text>
          </View>

          {/* 의사명 */}
          <View style={styles.bottomItem}>
            <Image source={require('../../assets/icons/doctor.png')} style={[styles.bottomIcon, !hasDoctor && styles.iconMuted]} resizeMode="contain" />
            <Text style={[styles.bottomLabel, !hasDoctor && styles.textMuted]}>의사명</Text>
            <Text style={[styles.bottomValue, !hasDoctor && styles.textMuted]}>{hasDoctor ? doctorName : ''}</Text>
          </View>

          {/* 병명 */}
          <View style={styles.bottomItem}>
            <Image source={require('../../assets/icons/file-medical.png')} style={[styles.bottomIcon, !hasDisease && styles.iconMuted]} resizeMode="contain" />
            <Text style={[styles.bottomLabel, !hasDisease && styles.textMuted]}>병명</Text>
            <Text style={[styles.bottomValue, !hasDisease && styles.textMuted]}>{hasDisease ? diseaseName : ''}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 24, paddingTop: 0 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    paddingHorizontal: 25,
    paddingTop: 14,
    paddingBottom: 14,
  },

  heartWrap: { alignItems: 'center', marginBottom: 8 },
  heartIcon: { width: 26, height: 26 },

  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  leftCol: { width: 90 },
  rightCol: { flex: 1, alignItems: 'flex-end' },

  labelBlue: { color: '#327AEE', fontSize: 16, fontWeight: '500' },
  valueBlue: { color: '#327AEE', fontSize: 16, fontWeight: '500' },

  divider: { height: 1, backgroundColor: '#E5E7EB', marginTop: 12, marginBottom: 10 },

  bottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bottomItem: { width: '30%', alignItems: 'center' },
  bottomIcon: { width: 18, height: 18, tintColor: '#3B82F6E6' },
  bottomLabel: { marginTop: 4, fontSize: 11.5, color: '#A2B5D8', fontWeight: '400' },
  bottomValue: { marginTop: 4, fontSize: 15, color: '#327AEE', fontWeight: '400' },

  textMuted: { color: '#A0A8B6' },
  iconMuted: { tintColor: '#A0A8B6' },
});