// src/components/Mycare/MycareRecordSection.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

type Props = {
  clinicName: string;
  timeLabel: string;
  deptName: string;
  doctorName: string;
  diseaseName: string;
  summary: string;
  onPressDetail?: () => void;
};

const MycareRecordSection: React.FC<Props> = ({
  clinicName,
  timeLabel,
  deptName,
  doctorName,
  diseaseName,
  summary,
  onPressDetail,
}) => {
  const hasDept = !!deptName?.trim();
  const hasDoctor = !!doctorName?.trim();
  const hasDisease = !!diseaseName?.trim();

  const labelColor = (hasValue: boolean) => (hasValue ? '#000000' : '#BBBEC3');
  const valueColor = (hasValue: boolean) => (hasValue ? '#000000' : '#BBBEC3');

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* 상단: 병원/시간 + 우측 정보(진료과/의사명/병명) */}
        <View style={styles.topRow}>
          {/* 좌측 */}
          <View style={styles.leftCol}>
            <View style={styles.leftItem}>
              <Image
                source={require('../../assets/icons/mycare-hospital.png')}
                style={styles.leftIcon}
                resizeMode="contain"
              />
              <Text style={styles.leftBlueText} numberOfLines={1}>
                {clinicName}
              </Text>
            </View>

            <View style={[styles.leftItem, { marginTop: 6 }]}>
              <Image
                source={require('../../assets/icons/clock-filled.png')}
                style={styles.leftIcon}
                resizeMode="contain"
              />
              <Text style={styles.leftBlueText} numberOfLines={1}>
                {timeLabel}
              </Text>
            </View>
          </View>

          {/* 가운데 세로 구분선 */}
          <View style={styles.vDivider} />

          {/* 우측 */}
          <View style={styles.rightCol}>
            <View style={styles.rRow}>
              <Text style={[styles.rLabel, { color: labelColor(hasDept) }]}>진료과</Text>
              <Text style={[styles.rValue, { color: valueColor(hasDept) }]} numberOfLines={1}>
                {hasDept ? deptName : ''}
              </Text>
            </View>

            <View style={styles.rRow}>
              <Text style={[styles.rLabel, { color: labelColor(hasDoctor) }]}>의사명</Text>
              <Text style={[styles.rValue, { color: valueColor(hasDoctor) }]} numberOfLines={1}>
                {hasDoctor ? doctorName : ''}
              </Text>
            </View>

            <View style={styles.rRow}>
              <Text style={[styles.rLabel, { color: labelColor(hasDisease) }]}>병명</Text>
              <Text style={[styles.rValue, { color: valueColor(hasDisease) }]} numberOfLines={1}>
                {hasDisease ? diseaseName : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* 진료 요약 */}
        <View style={styles.summaryArea}>
          <Text style={styles.summaryTitle}>진료 요약</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        </View>


      </View>
    </View>
  );
};

export default MycareRecordSection;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginTop: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBBEC366',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  leftCol: {
    flex: 1,
    paddingRight: 10,
  },
  leftItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  leftBlueText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6E6',
  },

  vDivider: {
    width: 1,
    backgroundColor: '#BBBEC366',
    marginHorizontal: 10,
  },

  rightCol: {
    flex: 1,
    justifyContent: 'center',
  },
  rRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  rLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  rValue: {
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 90,
    textAlign: 'right',
  },

  summaryArea: {
    marginTop: 12,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  summaryBox: {
    backgroundColor: 'rgba(236, 242, 252, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 18,
  },

  detailBtn: {
    marginTop: 10,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  detailIcon: {
    width: 14,
    height: 14,
    marginLeft: 4,
  },
});