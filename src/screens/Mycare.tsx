// src/screens/Mycare.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeptCategoryTabs, { DeptItem } from '../components/Mycare/DeptCategoryTabs';
import MycareRecordSection from '../components/Mycare/MycareRecordSection';

type MycareRecord = {
  id: string;
  deptId: string;       // 'internal' | 'eye' | 'ent' ...
  dateLabel: string;    // '2025.10.26'
  clinicName: string;
  doctorName: string;
  summary: string;
  prescription: string;
};

const Health: React.FC = () => {
  const insets = useSafeAreaInsets();

  const deptItems: DeptItem[] = useMemo(
    () => [
      { id: 'internal', label: '내과' },
      { id: 'eye', label: '안과' },
      { id: 'ent', label: '이비인후과' },
    ],
    [],
  );

  const [selectedDeptId, setSelectedDeptId] = useState<string>('eye');

  // 🔹 진료 데이터 (지금은 하드코딩, 나중에 API로 교체 가능)
  const records: MycareRecord[] = [
    {
      id: '1',
      deptId: 'eye',
      dateLabel: '2025.10.26',
      clinicName: '토닥 안과',
      doctorName: '최홍서 원장님',
      summary: '시력검사 결과 큰 변화는 없어요.\n정기검진만 권장돼요.',
      prescription: '인공눈물(히알루론산 점안액)',
    },
    {
      id: '2',
      deptId: 'eye',
      dateLabel: '2025.10.19',
      clinicName: '토닥 안과',
      doctorName: '최홍서 원장님',
      summary: '결막염 진단 후 점안약 처방을 받았어요.',
      prescription:
        '항생제 점안제(토브렉스),\n항생제·스테로이드 복합제(토브라덱스)',
    },
    // 필요하면 다른 deptId 데이터도 추가
  ];

  const filteredRecords = records.filter(
    r => r.deptId === selectedDeptId,
  );

  return (
    <View style={styles.root}>
      <View style={{ height: insets.top, backgroundColor: '#FFFFFF' }} />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Image
            source={require('../assets/icons/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>내 진료</Text>

        <View style={{ width: 32 }} />
      </View>

      {/* 내용 */}
      <View style={styles.content}>
        {/* 카테고리 탭 */}
        <DeptCategoryTabs
          items={deptItems}
          selectedId={selectedDeptId}
          onSelect={setSelectedDeptId}
        />

        {/* 진료 내역 리스트 */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredRecords.map(record => (
            <MycareRecordSection
              key={record.id}
              dateLabel={record.dateLabel}
              clinicName={record.clinicName}
              doctorName={record.doctorName}
              summary={record.summary}
              prescription={record.prescription}
              onPressDetail={() => {
                // TODO: 상세 페이지 네비게이션 연결
                console.log('상세 보기:', record.id);
              }}
            />
          ))}

          {filteredRecords.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                선택한 진료과의 진료 내역이 없습니다.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Health;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(236, 242, 252, 0.8)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.8,
    borderBottomColor: '#AEAEAE',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyBox: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
