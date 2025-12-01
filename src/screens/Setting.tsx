// src/screens/Setting.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SettingMenuList from '../components/Setting/SettingMenuList';

const Setting: React.FC = () => {
  const insets = useSafeAreaInsets();

  // 🔹 지금은 더미 데이터 (나중에 API 연동하면 여기만 바꾸면 됨)
  const dummyUser = {
    name: '토닥 님',
    email: 'todak@example.com',
  };

  return (
    <View style={styles.root}>

      {/* 상태바 영역 */}
      <View style={{ height: insets.top, backgroundColor: 'rgba(236, 242, 252, 1)' }} />

      {/* 상단 아이콘 영역 */}
      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconButton}>
          <Image
            source={require('../assets/icons/help.png')}
            style={styles.iconImg}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Image
            source={require('../assets/icons/setting-circle.png')}
            style={styles.iconImg}
          />
        </TouchableOpacity>
      </View>

      {/* 프로필 영역 */}
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>토</Text>
        </View>

        <View style={styles.profileTextBox}>
          <Text style={styles.profileName}>{dummyUser.name}</Text>
          <Text style={styles.profileEmail}>이메일: {dummyUser.email}</Text>
        </View>
      </View>

      {/* 아래 영역은 일단 비워둠 */}
      <SettingMenuList
        onPressFamily={() => {
          console.log('가족관리 눌림');
        }}
        onPressReservation={() => {
          console.log('예약 내역 눌림');
        }}
        onPressAppSetting={() => {
          console.log('앱 설정 눌림');
        }}
        onPressNotification={() => {
          console.log('알림 설정 눌림');
        }}
      />

    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(236, 242, 252, 1)', // 전체 연파랑
  },

  /* ---------- 상단 아이콘 행 ---------- */
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 27,
    paddingTop: 12,
    marginBottom: 24,
  },
  iconButton: {
    marginLeft: 15,
  },
  iconImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },

  /* ---------- 프로필 영역 ---------- */
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 27,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#9CA3AF',
  },

  profileTextBox: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: '#6B7280',
  },
});
