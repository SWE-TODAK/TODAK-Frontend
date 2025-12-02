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
import { clearAllTokens } from '../utils/authStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const Setting: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();

  // 🔹 지금은 더미 데이터
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

      {/* 메뉴 리스트 */}
      <SettingMenuList
        onPressFamily={() => navigation.navigate('Family')}
        onPressReservation={() => navigation.navigate('ReservationHistory')}
        onPressAppSetting={() => navigation.navigate('AppSetting')}
        onPressNotification={() => navigation.navigate('NotificationSetting')}
        onPressLogout={async () => {
          await clearAllTokens();
          navigation.replace('Login'); // 🔥 로그아웃 후 Login 이동
        }}
      />
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(236, 242, 252, 1)',
  },

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

  profileTextBox: { flex: 1 },
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
