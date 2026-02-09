// MainScreen.tsx
import React ,{useEffect,useState} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Hospital_Record from '../components/Home/Hospital_Record';
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
      <View style={styles.Logocenter}>
        <Image
          source={require('../assets/photo/todak_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>토닥</Text>
      </View>

      {/* ✅ 사용자 정보 표시 */}
      <View style={styles.userBox}>
        <Text style={styles.welcomeText}>
          {user?.name ? `${user.name}님, 안녕하세요!` : '안녕하세요!'}
        </Text>
        {!!user?.email && <Text style={styles.subText}>{user.email}</Text>}
      </View>

      {/* ✅ 메인에 녹음 버튼 */}
      <View style={styles.recordArea}>
        <Hospital_Record />
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(236, 242, 252, 0.9)',
    alignItems: 'center',
  },
  Logocenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
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
    userBox: {
      marginTop: 12,
      width: '100%',
      paddingHorizontal: 20,
    },
    welcomeText: { fontSize: 16, fontWeight: '700' },
    subText: { marginTop: 4, fontSize: 12, color: '#555' },


  recordArea: {
    marginTop: 28,
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center', // 가운데
  },
});
