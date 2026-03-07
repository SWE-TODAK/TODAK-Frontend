// MainScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecordPanel from '../components/Home/Record/RecordPanel';
import RecentRecordsSection from '../components/Home/recentRecords/RecentRecordsSection';
import { getUser } from '../utils/authStorage';

const MainScreen: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
    })();
  }, []);

  // Mycare.tsx의 더미 데이터와 완벽 통일
  const mockRecords = [
    {
      id: '1',
      dateLabel: '2025.05.27.금',
      clinicName: '밝은 눈 안과',
      timeLabel: '10:00 AM',
      deptName: '안과',
      doctorName: '최홍서',
      diseaseName: '',
      summary: '시력검사 결과 큰 변화는 없으며, 현재 상태는 안정적인 편입니다. 다만 예방 차원에서 정기적인 검진만 권장됩니다.',
      fullText: '검사 결과를 종합해 보면 ... (전체 텍스트 더미)\n\n향후에도 정기 검진 권장...',
      memo: '다음 검진: 6개월 뒤\n인공눈물 챙기기',
      hasAudio: true,
    },
    {
      id: '2',
      dateLabel: '2025.04.23.수',
      clinicName: '참 좋은병원',
      timeLabel: '2:00 PM',
      deptName: '내과',
      doctorName: '',
      diseaseName: '',
      summary: '현재까지 검사상 유의미한 변화는 관찰되지 않으며, 전반적인 상태는 안정적입니다. 향후 상태 유지를 위해 정기적인 내과적 검진을 권장드립니다.',
      fullText: '검사 결과를 종합해 보면, 현재까지 이전과 비교하여 의미 있는 변화는 보이지 않으며 ...\n\n평소와 다른 증상이 새로 나타나거나 불편감이 있을 경우...',
      memo: '이번 진료: 이상 없음\n예방 차원 정기 검진 권장',
      hasAudio: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 로고 */}
      <View style={styles.Logocenter}>
        <Image
          source={require('../assets/photo/todak_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>토닥</Text>
      </View>

      {/* 통일된 데이터를 넘겨줌 */}
      <RecentRecordsSection records={mockRecords} />

      {/* 탭바 바로 위에 "붙는" 녹음 패널 */}
      <View style={styles.recordDock}>
        <RecordPanel />
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(236, 242, 252, 0.9)',
  },
  Logocenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'center',
  },
  logo: {
    width: 58,
    height: 69,
    marginRight: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  recordDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});