// src/screens/Setting.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SettingMenuList from '../../components/Setting/SettingMenuList';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import ConfirmModal from '../../components/common/ConfirmModal';
import Toast from '../../components/common/Toast';
import FeedbackInputModal from '../../components/Setting/FeedbackInputModal';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const Setting: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();

  // 지금은 더미 데이터
  const dummyUser = {
    name: '토닥',
    email: 'todak@example.com',
    profileImage: '', // 있으면 uri 넣기
  };

  // 토스트
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1400);
  };

  // 피드백 모달 상태
  const [satisfactionVisible, setSatisfactionVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [isSatisfied, setIsSatisfied] = useState<boolean | null>(null);

  const onPressFeedback = () => {
    setIsSatisfied(null);
    setSatisfactionVisible(true);
  };

  const closeSatisfactionOnly = () => {
    // 바깥 눌렀을 때: 닫기만 (의견모달/선택처리 X)
    setSatisfactionVisible(false);
    setIsSatisfied(null);
  };

  const chooseSatisfied = async (v: boolean) => {
    // 만족/불만족 둘 다 "선택"이므로 여기서 둘 다 API 기록
    try {
      // TODO: 서버로 "만족/불만족 선택" 기록
      // await api.reportSatisfaction({ satisfied: v });

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
      // TODO: 서버 전송
      // await api.submitFeedback({ satisfied: isSatisfied, content: text });

      setInputVisible(false);
      setIsSatisfied(null);
      showToast('제출됐어요');
    } catch (e) {
      showToast('제출에 실패했어요');
    }
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
        onPressFeedback={onPressFeedback}
        onPressPrivacyHistory={() => navigation.navigate('PrivacyHistory' as any)}
      />

      {/* 1) 만족/불만족 모달: ConfirmModal 사용 */}
      <ConfirmModal
        visible={satisfactionVisible}
        title="토닥 이용에 만족하셨나요?"
        message="남겨주신 의견으로 더 나은 서비스를 제공하겠습니다"
        cancelText="불만족해요"
        confirmText="만족해요"
        onCancel={() => chooseSatisfied(false)}   // 왼쪽 버튼 = 불만족
        onConfirm={() => chooseSatisfied(true)}   // 오른쪽 버튼 = 만족
        onBackdropPress={closeSatisfactionOnly}   // 바깥 터치 = 그냥 닫기만
      />

      {/* 2) 의견 입력 모달 */}
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
  root: {
    flex: 1,
    backgroundColor: 'rgba(236, 242, 252, 1)',
  },

  profileRow: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 36,
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