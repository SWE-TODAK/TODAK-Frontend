// src/components/Mycare/MycareRecordSection.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

type Props = {
  dateLabel: string;       // 상단 날짜 (예: '2025.10.26')
  clinicName: string;      // 토닥 안과
  doctorName: string;      // 최홍서 원장님
  summary: string;         // 진료 내용 요약 텍스트
  prescription: string;    // 처방약 텍스트
  onPressDetail?: () => void; // '진료 내역 상세 보기' 눌렀을 때
};

const MycareRecordSection: React.FC<Props> = ({
  dateLabel,
  clinicName,
  doctorName,
  summary,
  prescription,
  onPressDetail,
}) => {
  return (
    <View style={styles.sectionWrapper}>
      {/* 날짜 + 상세 보기 */}
      <View style={styles.dateRow}>
        <Text style={styles.dateText}>{dateLabel}</Text>

        <TouchableOpacity
          style={styles.detailButton}
          activeOpacity={0.8}
          onPress={onPressDetail}
        >
          <Text style={styles.detailText}>진료 내역 상세 보기</Text>
          <Text style={styles.detailArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 진료 카드 */}
      <View style={styles.card}>
        {/* 병원명 + 의사명 */}
        <View style={styles.titleRow}>
          <Text style={styles.clinicName}>{clinicName}</Text>
          <Text style={styles.titleDivider}> | </Text>
          <Text style={styles.doctorName}>{doctorName}</Text>
        </View>

        {/* 진료 내용 요약 */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>진료 내용 요약</Text>
          <Text style={styles.infoValue}>{summary}</Text>
        </View>

        {/* 처방약 */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>처방약</Text>
          <Text style={styles.infoValue}>{prescription}</Text>
        </View>
      </View>
    </View>
  );
};

export default MycareRecordSection;

const styles = StyleSheet.create({
  sectionWrapper: {
    marginBottom: 28,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
    marginLeft:10,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#4169E1',
    fontWeight: '500',
  },
  detailArrow: {
    fontSize: 14,
    color: '#4169E1',
    marginLeft: 2,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  titleDivider: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 4,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    width: 90, // '진료 내용 요약', '처방약' 라벨 고정 폭
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    lineHeight: 19,
  },
});
