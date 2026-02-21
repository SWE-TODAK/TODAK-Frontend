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
import SettingMenuList from '../../components/Setting/SettingMenuList';
import { clearAllTokens } from '../../utils/authStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const Setting: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();

  // 지금은 더미 데이터
  const dummyUser = {
    name: '토닥',
    email: 'todak@example.com',
  };

  return (
    <View style={styles.root}>
      {/* 상태바 영역 */}
      <View style={{ height: insets.top, backgroundColor: 'rgba(236, 242, 252, 1)' }} />

      {/* 프로필 영역 */}
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Image
            source={
              dummyUser.profileImage
                ? { uri: dummyUser.profileImage }
                : require('../../assets/icons/profilePic-default.png')
            }
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.profileName}>{dummyUser.name} 님</Text>
      </View>

      {/* 메뉴 리스트 */}
      <SettingMenuList
        onPressProfile={() => navigation.navigate('ProfileSetting' as any)}
        onPressFeedback={() => navigation.navigate('Feedback' as any)}
        onPressPrivacyHistory={() => navigation.navigate('PrivacyHistory' as any)}
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

  profileRow: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 36
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },

  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
});
