// src/screens/setting/ChangePassword.tsx
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import instance from '../../api/axios';
import { clearAllTokens } from '../../utils/authStorage';
import Toast from '../../components/common/Toast';
import PasswordFormTemplate, { PasswordSubmitData } from '../../components/Login/PasswordFormTemplate';
import { View } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

export default function ChangePassword({ navigation }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = async (data: PasswordSubmitData) => {
    setIsSubmitting(true);
    try {
      // 1. API 호출 (명세서 적용)
      await instance.patch('/users/me/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        newPasswordConfirm: data.newPasswordConfirm,
      });

      // 2. 토큰 날리기
      await clearAllTokens();

      // 3. 성공 토스트 띄우고 로그인으로 이동
      setToastMessage('비밀번호 변경 완료! 다시 로그인해주세요.');
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        navigation.reset({ index: 0, routes: [{ name: 'Login' as any }] });
      }, 1500);

    } catch (e: any) {
      setErrorMsg(e.response?.data?.message || '비밀번호 변경에 실패했어요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <PasswordFormTemplate
        title="비밀번호 변경"
        requireCurrentPassword={true} // 현재 비밀번호 필수
        isSubmitting={isSubmitting}
        serverError={errorMsg}
        onClearError={() => setErrorMsg(null)}
        onBack={() => navigation.goBack()}
        onSubmit={handleSubmit}
      />
      <Toast visible={toastVisible} message={toastMessage} />
    </View>
  );
}