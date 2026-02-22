// MainScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecordPanel from '../components/Home/RecordPanel';
import { getUser } from '../utils/authStorage';

const MainScreen: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
    })();
  }, []);

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

      {/* ✅ 탭바 바로 위에 "붙는" 녹음 패널 */}
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

  // ✅ 여기! 탭바 위에 딱 붙게 고정
  recordDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom:0,
  },
});