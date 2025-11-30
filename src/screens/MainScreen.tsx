// MainScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Today_Reservation from '../components/Home/Today_Reservation';
import Hospital_List from '../components/Home/Hospital_List';



const MainScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.Logocenter}>
      <Image
            source={require('../assets/photo/토닥 로고.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>토닥</Text>
      </View>
      <Today_Reservation
        dateText="2025년 10월 07일 금요일"
        timeText="8:00 AM"
        hospitalName="바른이치과의원"
        department="치과"
      />
      <Hospital_List />
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(236, 242, 252, 0.9)',
    //justifyContent: 'center',
    alignItems: 'center',
  },
  Logocenter: {
    // flex: 1,                 // ⛔ 이거 때문에 남은 공간 다 먹고 중간으로 밀림
    flexDirection: 'row',
    alignItems: 'center',
    // 선택: 살짝 아래로 내리고 싶으면
    marginTop: 16,              // 숫자는 취향대로
  },
  logo: {
    width: 58,   // 필요하면 조절 가능
    height: 69,
    marginRight: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },

});
