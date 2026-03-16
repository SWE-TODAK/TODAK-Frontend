// components/Home/recentRecords/RecentRecordsSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RecentRecordsCard from './RecentRecordsCard';

type RecordItem = {
  id: string;
  date: string;
  description: string;
};

type Props = {
  records: RecordItem[];
};

const RecentRecordsSection: React.FC<Props> = ({ records }) => {
  const isEmpty = records.length === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>최근 진료 기록</Text>

      {isEmpty ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyMain}>
            아직 진료 기록이 없어요{'\n'}
            진료 중 녹음을 시작해보세요
          </Text>
          <Text style={styles.emptySub}>
            의사의 동의를 받고 녹음해주세요
          </Text>
        </View>
      ) : (
        <RecentRecordsCard records={records} />
      )}
    </View>
  );
};

export default RecentRecordsSection;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 18,
  },
  title: {
    fontSize: 18,
    marginLeft:10,
    fontWeight: '800',
    marginBottom: 10,
    color: '#111',
  },

  // ✅ empty 상태에서도 섹션이 "길게" 보이도록
  emptyCard: {
    minHeight: 400,            // ✅ 원하는 느낌으로 260~340 사이 조절
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 44,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMain: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111',
    lineHeight: 26,
  },
  emptySub: {
    marginTop: 12,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
});