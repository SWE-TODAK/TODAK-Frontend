import React, { useMemo, useState } from 'react';
import EmailAuthConsentModal from '../../components/Login/EmailAuthConsentModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Toast from '../../components/common/Toast';

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); // 이메일 오류 판단 기준
type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetting'>;

export default function ProfileSetting({ navigation }: Props) {

  // ✅ TODO: 나중에 API/스토리지에서 가져오면 됨
  const user = {
    nickname: '토닥',
    email: 'todak@gmail.com',
    birth: '2004-06-12', // YYYY-MM-DD
    sex: 'F' as 'M' | 'F',
    profileImageUrl: '', // 있으면 { uri: ... } 로 렌더
  };

  const [kakaoEasyLogin, setKakaoEasyLogin] = useState(true);

  const [consentVisible, setConsentVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [editing, setEditing] = useState<null | 'nickname' | 'email'>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nicknameDraft, setNicknameDraft] = useState(user.nickname);
  const [emailDraft, setEmailDraft] = useState(user.email);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);

    // 토스트가 "보였다가 사라질 시간"과 맞춰서 false로 내려주기
    setTimeout(() => setToastVisible(false), 1400);
  };

  const sexLabel = user.sex === 'F' ? '여성' : '남성';

  const birthLabel = useMemo(() => {
    // "2004년 6월 12일" 형태
    if (!user.birth) return '';
    const [y, m, d] = user.birth.split('-').map((x) => Number(x));
    if (!y || !m || !d) return user.birth;
    return `${y}년 ${m}월 ${d}일`;
  }, [user.birth]);

  // TODO: API 연결 전 임시 "저장" 시점
  const commitNickname = () => {
    // 여기서 nicknameDraft 서버 저장 붙이면 됨
    endEdit();
    showToast('저장됐어요');
  };
  const startEditNickname = () => {
    setEditing('nickname');
  };

  const startEditEmail = () => {
    setEmailError(null);
    setEditing('email');
  };

  const endEdit = () => setEditing(null);

  const commitEmail = () => {
    const v = emailDraft.trim();

    if (!isValidEmail(v)) {
      setEmailError('올바른 이메일을 입력해주세요');
      setEditing('email'); // 계속 편집 상태 유지
      return;
    }

    setEmailError(null);
    // TODO: v 저장 API
    endEdit();
    showToast('저장됐어요');
  };

  const onChangeEmailDraft = (v: string) => {
    setEmailDraft(v);

    // 에러가 떠있는 상태라면 입력 시작하면 지워주기
    if (emailError) {
      setEmailError(null);
    }
  };

  const onEditBirth = () => {
    Alert.alert('생년월일 수정', '여기에 생년월일 수정 화면/모달 연결');
  };

  const onEditSex = () => {
    Alert.alert('성별 수정', '여기에 성별 수정 화면/모달 연결');
  };

  const onEditProfileImage = () => {
    Alert.alert('프로필 사진 수정', '여기에 이미지 선택/업로드 연결');
  };

  const onPressChangePassword = () => {
    setConsentVisible(true);
  };

  const onPressLogout = () => {
    setLogoutVisible(true);
  };

  const onPressWithdraw = () => {
    setWithdrawVisible(true);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
          Keyboard.dismiss();     // 키보드 내림
          if (editing === 'nickname') commitNickname();
          if (editing === 'email') commitEmail();
      }}
      accessible={false}
    >
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container]}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.backCircle}
          >
            <Image
              source={require('../../assets/icons/back.png')}
              style={styles.backImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text style={styles.title}>프로필 설정</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* 프로필 이미지 */}
        <View style={styles.profileImageWrap}>
          <View style={styles.profileImageCircle}>
            <Image
              source={
                user.profileImageUrl
                  ? { uri: user.profileImageUrl }
                  : require('../../assets/icons/profilePic-default.png')
              }
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onEditProfileImage}
            style={styles.profileEditBtn}
          >
            <Image
              source={require('../../assets/icons/edit.png')}
              style={styles.profileEditIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* 정보 리스트 */}
        <View style={styles.infoList}>
          <InfoRow
            label="이름"
            value={nicknameDraft}
            editable
            isEditing={editing === 'nickname'}
            onStartEdit={startEditNickname}
            onChangeText={setNicknameDraft}
            onClear={() => setNicknameDraft('')}
            onSubmit={commitNickname}
          />
          <InfoRow
            label="이메일"
            value={emailDraft}
            editable
            isEditing={editing === 'email'}
            onStartEdit={startEditEmail}
            onChangeText={onChangeEmailDraft}   // ✅ 이 함수 사용
            onClear={() => setEmailDraft('')}
            onSubmit={commitEmail}
            keyboardType="email-address"
            errorText={emailError}
          />
          <InfoRow label="생년월일" value={birthLabel} onPressEdit={onEditBirth} />
          <InfoRow label="성별" value={sexLabel} onPressEdit={onEditSex} />

          {/* 카카오 간편 로그인 (스위치) */}
          <View style={[styles.row, { marginTop: 6 }]}>
            <Text style={styles.rowLabel}>카카오 간편 로그인</Text>
            <View style={styles.rowRight}>
              <Switch
                value={kakaoEasyLogin}
                onValueChange={setKakaoEasyLogin}
                trackColor={{ false: '#E5E7EB', true: '#34C759' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* 아래 메뉴 */}
          <TouchableOpacity style={styles.menuRow} activeOpacity={0.8} onPress={onPressChangePassword}>
            <Text style={styles.menuText}>비밀번호 변경</Text>
            <Image
              source={require('../../assets/icons/arrow-right.png')}
              style={styles.chevron}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.8} onPress={onPressLogout}>
            <Text style={styles.menuText}>로그아웃</Text>
            <Image
              source={require('../../assets/icons/arrow-right.png')}
              style={styles.chevron}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.8} onPress={onPressWithdraw}>
            <Text style={styles.menuText}>회원탈퇴</Text>
            <Image
              source={require('../../assets/icons/arrow-right.png')}
              style={styles.chevron}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
            {/* 비밀번호 변경 동의 모달 */}
            <EmailAuthConsentModal
              visible={consentVisible}
              email={user.email}
              onCancel={() => setConsentVisible(false)}
              onConfirm={() => {
                setConsentVisible(false);
                navigation.navigate('ResetPasswordVerify', {
                  email: user.email,
                  returnTo: 'ProfileSetting',
                  skipSuccess: true,
                } as any);
              }}
            />

            {/* 로그아웃 모달 */}
            <ConfirmModal
              visible={logoutVisible}
              title="로그아웃"
              message="로그아웃 하시겠습니까?"
              cancelText="취소"
              confirmText="확인"
              confirmColor="#EF4444"
              onCancel={() => setLogoutVisible(false)}
              onConfirm={() => {
                setLogoutVisible(false);
                navigation.replace('Login');
              }}
            />

            {/* 회원탈퇴 모달 */}
            <ConfirmModal
              visible={withdrawVisible}
              title="회원탈퇴"
              message="정말 탈퇴하시겠습니까?"
              cancelText="취소"
              confirmText="확인"
              confirmColor="#EF4444"
              onCancel={() => setWithdrawVisible(false)}
              onConfirm={() => {
                setWithdrawVisible(false);
                // TODO: 탈퇴 API 호출 후 처리
                navigation.replace('Login');
              }}
            />
          <Toast visible={toastVisible} message={toastMessage} />
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

/** -----------------------------
 * 작은 컴포넌트: label + value + 연필버튼
 * ------------------------------ */

function InfoRow({
  label,
  value,
  editable = false,
  isEditing = false,
  onStartEdit,
  onChangeText,
  onClear,
  onSubmit,
  keyboardType,
  onPressEdit,
  errorText,
}: {
  label: string;
  value: string;
  editable?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onChangeText?: (v: string) => void;
  onClear?: () => void;
  onSubmit?: () => void;
  keyboardType?: 'default' | 'email-address';
  onPressEdit?: () => void;
  errorText?: string | null;
}) {
  return (
    <View style={styles.rowBlock}>
      <View style={styles.row}>
        <Text style={styles.rowLabel} numberOfLines={1}>
          {label}
        </Text>

        <View style={styles.rowRight}>
          {editable && isEditing ? (
            <View style={styles.inputWrap}>
              <TextInput
                value={value}
                onChangeText={onChangeText}
                style={styles.inlineInput}
                autoFocus
                keyboardType={keyboardType ?? 'default'}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={onSubmit} // ✅ Enter -> 저장
                onBlur={onSubmit}          // ✅ blur -> 저장
              />

              <TouchableOpacity
                onPress={onClear}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.clearBtn}
              >
                <Image
                  source={require('../../assets/icons/Clear.png')}
                  style={styles.clearIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.rowValue} numberOfLines={1}>
                {value}
              </Text>

              <TouchableOpacity
                onPress={editable ? onStartEdit : onPressEdit}
                activeOpacity={0.8}
                style={styles.editBtn}
              >
                <Image
                  source={require('../../assets/icons/edit.png')}
                  style={styles.editIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* ✅ 이메일 형식 에러 메시지 */}
      {!!errorText && <Text style={styles.inlineErrorText}>{errorText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.8,
    borderBottomColor: '#AEAEAE',
  },

  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backImage: {
    width: 20,
    height: 20,
  },
  title: {
    color: '#333333',
    fontSize: 17,
    fontWeight: '600',
  },

  profileImageWrap: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileImageCircle: {
    width: 60,
    height: 60,
    borderRadius: 46,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: { width: '100%', height: '100%' },

  profileEditBtn: {
    position: 'absolute',
    right: 165,
    bottom: -5,
    width: 25,
    height: 25,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEditIcon: { width: 15, height: 15 },

  infoList: {
    marginTop: 36,
    paddingHorizontal: 30,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
    marginRight: 12,
  },
  rowRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 12,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontWeight: '500',
    marginRight: 15,
    maxWidth: 220,
    textAlign: 'left',
  },
  rowBlock: {
    // 한 row + 에러텍스트를 묶는 wrapper
  },
  inlineErrorText: {
    marginTop: 6,
    color: '#FF0000',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
    paddingLeft: '50%',  // 필요하면 label 폭만큼 띄우고 싶으면 여기 조절
  },

  editBtn: {
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: { width: 18, height: 18 },

  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  inlineInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
    paddingVertical: 0,
    paddingHorizontal: 0,
    textAlign: 'left',
  },

  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D1D5DB', // 스샷처럼 회색 동그라미 느낌
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  clearIcon: {
    width: 12,
    height: 12,
    tintColor: '#FFFFFF',
  },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  },
  chevron: {
    width: 16,
    height: 16,
    tintColor: '#9CA3AF',
    resizeMode: 'contain',
  },
});