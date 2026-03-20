// src/screens/setting/Setting.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SettingMenuList from '../../components/Setting/SettingMenuList';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import ConfirmModal from '../../components/common/ConfirmModal';
import Toast from '../../components/common/Toast';
import FeedbackInputModal from '../../components/Setting/FeedbackInputModal';

import instance from '../../api/axios';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const Setting: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();

  const [user, setUser] = useState<{ name: string; email: string; profileImage: string }>({
    name: '',
    email: '',
    profileImage: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1400);
  };

  const [satisfactionVisible, setSatisfactionVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [isSatisfied, setIsSatisfied] = useState<boolean | null>(null);

  // 화면에 포커스 될 때마다 기본 정보 조회 API 호출
  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  const fetchUserInfo = async () => {
    try {
      // ✅ 1. 마이페이지 기본 정보 조회 (GET /users/me)
      const response = await instance.get('/users/me');
      const data = response.data?.data || response.data;

      // ✅ 명세서 키값 매핑 (nickname, profileImageUrl)
      setUser({
        name: data.nickname || '이름 없음',
        email: data.email || '',
        profileImage: data.profileImageUrl || '',
      });
    } catch (error) {
      console.log('유저 정보 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPressFeedback = () => {
    setIsSatisfied(null);
    setSatisfactionVisible(true);
  };

  const closeSatisfactionOnly = () => {
    setSatisfactionVisible(false);
    setIsSatisfied(null);
  };

  const chooseSatisfied = async (v: boolean) => {
    try {
      // TODO: 피드백 API 명세가 확정되면 URL 수정
      await instance.post('/feedbacks/satisfaction', { isSatisfied: v });
      setIsSatisfied(v);
      setSatisfactionVisible(false);
      setInputVisible(true);
    } catch (e) {
      showToast('처리 중 오류가 발생했어요');
    }
  };

  const onCancelInput = () => {
    setInputVisible(false);
    setIsSatisfied(null);
  };

  const onSubmitInput = async (text: string) => {
    if (!text.trim()) {
      showToast('의견을 입력해주세요');
      return;
    }

    try {
      // TODO: 피드백 API 명세가 확정되면 URL 수정
      await instance.post('/feedbacks', {
        isSatisfied: isSatisfied,
        content: text,
      });

      setInputVisible(false);
      setIsSatisfied(null);
      showToast('제출됐어요');
    } catch (e) {
      showToast('제출에 실패했어요');
    }
  };

  return (
    <View style={styles.root}>
      <View style={{ height: insets.top, backgroundColor: 'rgba(236, 242, 252, 1)' }} />

      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <Image
              source={
                user.profileImage
                  ? { uri: user.profileImage }
                  : require('../../assets/icons/profilePic-default.png')
              }
              style={styles.avatarImage}
              resizeMode="cover"
            />
          )}
        </View>
        <Text style={styles.profileName}>{isLoading ? '로딩중...' : `${user.name} 님`}</Text>
      </View>

      <SettingMenuList
        onPressProfile={() => navigation.navigate('ProfileSetting' as any)}
        onPressFeedback={onPressFeedback}
        onPressPrivacyHistory={() => navigation.navigate('PrivacyHistory' as any)}
      />

      <ConfirmModal
        visible={satisfactionVisible}
        title="토닥 이용에 만족하셨나요?"
        message="남겨주신 의견으로 더 나은 서비스를 제공하겠습니다"
        cancelText="불만족해요"
        confirmText="만족해요"
        onCancel={() => chooseSatisfied(false)}
        onConfirm={() => chooseSatisfied(true)}
        onBackdropPress={closeSatisfactionOnly}
      />

      <FeedbackInputModal
        visible={inputVisible}
        onCancel={onCancelInput}
        onSubmit={onSubmitInput}
      />

      <Toast visible={toastVisible} message={toastMessage} />
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'rgba(236, 242, 252, 1)' },
  profileRow: { flexDirection: 'column', alignItems: 'center', paddingTop: 36 },
  avatar: { width: 60, height: 60, borderRadius: 28, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  profileName: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 12 },
});