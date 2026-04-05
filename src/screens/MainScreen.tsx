import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecordPanel from '../components/Home/Record/RecordPanel';
import RecentRecordsSection from '../components/Home/recentRecords/RecentRecordsSection';
import { getUser } from '../utils/authStorage';
import { getRecentRecordings } from '../api/recordingApi';

const MainScreen: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
    })();
  }, []);

  useEffect(() => {
    const fetchRecentRecords = async () => {
      try {
        const data = await getRecentRecordings();

        console.log('🔥 최근 기록 데이터:', data);

        setRecords(data);
      } catch (error) {
        console.error('❌ 최근 진료 기록 조회 실패:', error);
        setRecords([]);
      }
    };

    fetchRecentRecords();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.Logocenter}>
        <Image
          source={require('../assets/photo/todak_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>토닥</Text>
      </View>

      <RecentRecordsSection records={records} />

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