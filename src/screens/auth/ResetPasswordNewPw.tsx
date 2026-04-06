// src/screens/setting/ResetPasswordNewPw.tsx
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import PasswordFormTemplate, { PasswordSubmitData } from '../../components/Login/PasswordFormTemplate';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPasswordNewPw'>;

export default function ResetPasswordNewPw({ navigation, route }: Props) {
  const email = route.params?.email ?? '';
  const code = route.params?.code ?? '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PasswordSubmitData) => {
    setIsSubmitting(true);
    try {
      // TODO: 비밀번호 찾기(Reset) 서버 API 호출
      // await axios.post('/auth/password/reset', { email, code, newPassword: data.newPassword });
      await new Promise((r) => setTimeout(r, 600)); // MOCK

      navigation.replace('ResetPasswordSuccess', { email });
    } catch (e: any) {
      setError('비밀번호 변경에 실패했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PasswordFormTemplate
      title="비밀번호 찾기" // 타이틀 변경
      requireCurrentPassword={false} // 현재 비밀번호 숨김
      isSubmitting={isSubmitting}
      serverError={error}
      onClearError={() => setError(null)}
      onBack={() => navigation.goBack()}
      onSubmit={handleSubmit}
    />
  );
}