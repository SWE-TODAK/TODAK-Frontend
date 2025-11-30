// src/screens/Health.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const Health: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      {/* 🔼 상태바 높이만큼 흰색으로 덮기 */}
      <View style={{ height: insets.top, backgroundColor: '#FFFFFF' }} />

      {/* 🔹 상단 헤더 (흰색 + 구분선) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Image
            source={require('../assets/icons/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>내진료</Text>

        <View style={{ width: 32 }} />
      </View>

      {/* 🔹 헤더 아래부터 전체 연파랑 영역 */}
      <View style={styles.content}>
        <View style={styles.tempArea}>
          <Text style={{ color: '#999' }}>여기에 다음 내용 들어갈 예정</Text>
        </View>
      </View>
    </View>
  );
};

export default Health;

const styles = StyleSheet.create({
  // 화면 전체 배경 = 연파랑
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
    flex: 1, // 탭바 위까지 연파랑으로 쭉
  },

  tempArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
