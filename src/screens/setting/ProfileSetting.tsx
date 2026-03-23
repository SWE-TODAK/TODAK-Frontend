// src/screens/setting/ProfileSetting.tsx
import React, { useMemo, useState, useEffect } from 'react';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import EmailAuthConsentModal from '../../components/Login/EmailAuthConsentModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Toast from '../../components/common/Toast';
import WithdrawModal from '../../components/Setting/WithdrawModal';

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
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';

import instance from '../../api/axios';
import { clearAllTokens, getRefreshToken } from '../../utils/authStorage';
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetting'>;

export default function ProfileSetting({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  // 유저 로그인 제공자 (LOCAL or KAKAO)
  const [loginProvider, setLoginProvider] = useState<'LOCAL' | 'KAKAO'>('LOCAL');

  const [kakaoEasyLogin, setKakaoEasyLogin] = useState(false);
  const [kakaoModalVisible, setKakaoModalVisible] = useState(false);
  const [pendingKakaoEasyLogin, setPendingKakaoEasyLogin] = useState<boolean | null>(null);

  const [consentVisible, setConsentVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // 탈퇴 관련 상태
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [withdrawPasswordError, setWithdrawPasswordError] = useState<string | null>(null);

  const [editing, setEditing] = useState<null | 'nickname' | 'email'>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [nicknameDraft, setNicknameDraft] = useState('');
  const [emailDraft, setEmailDraft] = useState('');
  const [birthDraft, setBirthDraft] = useState('');
  const [birthPickerVisible, setBirthPickerVisible] = useState(false);
  const [sexDraft, setSexDraft] = useState<'M' | 'F'>('F');
  const [sexModalVisible, setSexModalVisible] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1400);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await instance.get('/users/me/profile');
        const data = profileRes.data?.data || profileRes.data;

        setNicknameDraft(data.nickname || '');
        setEmailDraft(data.email || '');
        setBirthDraft(data.birthDate || '');

        const genderVal = data.gender || 'FEMALE';
        setSexDraft(genderVal === 'MALE' ? 'M' : 'F');

        setProfileImageUri(data.profileImageUrl || null);
        setKakaoEasyLogin(data.kakaoLinked || false);

        setLoginProvider(data.provider === 'KAKAO' ? 'KAKAO' : 'LOCAL');

      } catch (error: any) {
        console.log('프로필 조회 API 에러:', error.response?.data || error.message);
        showToast('프로필 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const sexLabel = sexDraft === 'F' ? '여성' : '남성';
  const birthLabel = useMemo(() => {
    if (!birthDraft) return '';
    const [y, m, d] = birthDraft.split('-').map(Number);
    if (!y || !m || !d) return birthDraft;
    return `${y}년 ${m}월 ${d}일`;
  }, [birthDraft]);

  const endEdit = () => setEditing(null);

  const handleSessionClear = async () => {
    await clearAllTokens();
    navigation.reset({ index: 0, routes: [{ name: 'Login' as any }] });
  };

  const commitNickname = async () => {
    endEdit();
    try {
      await instance.patch('/users/me/profile/name', { nickname: nicknameDraft });
      showToast('저장됐어요');
    } catch (e: any) {
      const errMsg = e.response?.data?.message || '닉네임 저장에 실패했어요';
      showToast(errMsg);
    }
  };

  const commitEmail = async () => {
    const v = emailDraft.trim();
    if (!isValidEmail(v)) {
      setEmailError('올바른 이메일을 입력해주세요');
      setEditing('email');
      return;
    }
    setEmailError(null);
    endEdit();
    try {
      await instance.patch('/users/me/profile/email', { email: v });
      showToast('저장됐어요');
    } catch (e: any) {
      const errMsg = e.response?.data?.message || '이메일 저장에 실패했어요';
      showToast(errMsg);
    }
  };

  const startEditNickname = () => setEditing('nickname');
  const startEditEmail = () => { setEmailError(null); setEditing('email'); };
  const onChangeEmailDraft = (v: string) => { setEmailDraft(v); if (emailError) setEmailError(null); };

  const onEditBirth = () => {
    if (editing === 'nickname') commitNickname();
    if (editing === 'email') commitEmail();
    setBirthPickerVisible(true);
  };

  const onEditSex = () => {
    if (editing === 'nickname') commitNickname();
    if (editing === 'email') commitEmail();
    setSexModalVisible(true);
  };

  const commitSex = async (next: 'M' | 'F') => {
    if (next === sexDraft) {
      setSexModalVisible(false);
      return;
    }
    setSexModalVisible(false);
    try {
      const genderStr = next === 'M' ? 'MALE' : 'FEMALE';
      await instance.patch('/users/me/profile/sex', { gender: genderStr });
      setSexDraft(next);
      showToast('저장됐어요');
    } catch (e: any) {
      const errMsg = e.response?.data?.message || '성별 저장에 실패했어요';
      showToast(errMsg);
    }
  };

  const commitBirth = async (next: string) => {
    try {
      await instance.patch('/users/me/profile/birth', { birthDate: next });
      setBirthDraft(next);
      showToast('저장됐어요');
    } catch (e: any) {
      const errMsg = e.response?.data?.message || '생년월일 저장에 실패했어요';
      showToast(errMsg);
    }
  };

  const onEditProfileImage = () => {
    if (editing === 'nickname') commitNickname();
    if (editing === 'email') commitEmail();
    setProfileModalVisible(true);
  };

  const handleImageUpload = async (uri: string | null) => {
    try {
      if (!uri) {
        await instance.delete('/users/me/profile/image');
        setProfileImageUri(null);
        showToast('기본 이미지로 변경됐어요');
      } else {
        await instance.patch('/users/me/profile/image', { profileImageUrl: uri });
        setProfileImageUri(uri);
        showToast('저장됐어요');
      }
    } catch (e: any) {
      const errMsg = e.response?.data?.message || '이미지 저장에 실패했어요';
      showToast(errMsg);
    }
  };

  const onToggleKakaoEasyLogin = (next: boolean) => {
    if (editing === 'nickname') commitNickname();
    if (editing === 'email') commitEmail();
    setPendingKakaoEasyLogin(next);
    setKakaoModalVisible(true);
  };

  const confirmKakaoEasyLogin = async () => {
    if (pendingKakaoEasyLogin === null) return;
    const next = pendingKakaoEasyLogin;
    setKakaoModalVisible(false);
    setPendingKakaoEasyLogin(null);

    try {
      if (next) {
        await instance.post('/auth/kakao/link');
      } else {
        await instance.post('/auth/kakao/unlink');
      }
      setKakaoEasyLogin(next);
      showToast(next ? '카카오 간편 로그인이 연결됐어요' : '카카오 간편 로그인이 해제됐어요');
    } catch (e) {
      showToast('처리 중 오류가 발생했어요');
    }
  };

  const cancelKakaoEasyLogin = () => {
    setKakaoModalVisible(false);
    setPendingKakaoEasyLogin(null);
  };

  const handleLogout = async () => {
    setLogoutVisible(false);
    try {
      const refreshToken = await getRefreshToken();
      await instance.post('/auth/logout', {
        refreshToken: refreshToken
      });
    } catch (e: any) {
      console.log('로그아웃 API 실패:', e.response?.data || e.message);
      const errMsg = e.response?.data?.message || '로그아웃 처리 중 오류가 발생했어요';
      showToast(errMsg);
    } finally {
      await handleSessionClear();
    }
  };

  const handleWithdraw = async () => {
    if (loginProvider === 'LOCAL' && !withdrawPassword) {
      setWithdrawPasswordError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const body = loginProvider === 'LOCAL' ? { password: withdrawPassword } : {};
      await instance.delete('/auth/me', { data: body });

      setWithdrawVisible(false);
      setWithdrawPassword('');
      await handleSessionClear();

    } catch (e: any) {
      const status = e.response?.status;
      const msg = e.response?.data?.message || '회원탈퇴 처리 중 오류가 발생했습니다.';

      if (status === 400 && loginProvider === 'LOCAL' && msg.includes('비밀번호')) {
        setWithdrawPasswordError('비밀번호가 일치하지 않습니다.');
      } else if (status === 404 || status === 409 || status === 401) {
        setWithdrawVisible(false);
        showToast(msg);
        setTimeout(() => { handleSessionClear(); }, 1200);
      } else {
        showToast(msg);
        setWithdrawVisible(false);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
          if (birthPickerVisible) return;
          Keyboard.dismiss();
          if (editing === 'nickname') commitNickname();
          if (editing === 'email') commitEmail();
      }}
      accessible={false}
    >
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backCircle}>
            <Image source={require('../../assets/icons/back.png')} style={styles.backImage} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.title}>프로필 설정</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.profileImageWrap}>
          <View style={styles.profileImageCircle}>
            <Image
              source={
                profileImageUri
                  ? { uri: profileImageUri }
                  : require('../../assets/icons/profilePic-default.png')
              }
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
          <TouchableOpacity activeOpacity={0.85} onPress={onEditProfileImage} style={styles.profileEditBtn}>
            <Image source={require('../../assets/icons/edit.png')} style={styles.profileEditIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoList}>
          <InfoRow
            label="닉네임"
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
            onChangeText={onChangeEmailDraft}
            onClear={() => setEmailDraft('')}
            onSubmit={commitEmail}
            keyboardType="email-address"
            errorText={emailError}
          />
          <InfoRow label="생년월일" value={birthLabel} onPressEdit={onEditBirth} />
          <InfoRow label="성별" value={sexLabel} onPressEdit={onEditSex} />

          <View style={[styles.row, { marginTop: 6 }]}>
            <Text style={styles.rowLabel}>카카오 간편 로그인</Text>
            <View style={styles.rowRight}>
              <Switch
                value={kakaoEasyLogin}
                onValueChange={onToggleKakaoEasyLogin}
                trackColor={{ false: '#E5E7EB', true: '#34C759' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.8} onPress={() => setConsentVisible(true)}>
            <Text style={styles.menuText}>비밀번호 변경</Text>
            <Image source={require('../../assets/icons/arrow-right.png')} style={styles.chevron} resizeMode="contain" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.8} onPress={() => setLogoutVisible(true)}>
            <Text style={styles.menuText}>로그아웃</Text>
            <Image source={require('../../assets/icons/arrow-right.png')} style={styles.chevron} resizeMode="contain" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.8} onPress={() => { setWithdrawPassword(''); setWithdrawPasswordError(null); setWithdrawVisible(true); }}>
            <Text style={styles.menuText}>회원탈퇴</Text>
            <Image source={require('../../assets/icons/arrow-right.png')} style={styles.chevron} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmModal
        visible={profileModalVisible}
        title="프로필 사진"
        message={profileImageUri ? "프로필 사진을 변경하거나 삭제하시겠습니까?" : "새로운 프로필 사진을 설정하시겠습니까?"}
        cancelText={profileImageUri ? "사진 삭제" : "취소"}
        confirmText="사진 선택"
        onBackdropPress={() => setProfileModalVisible(false)}
        onCancel={() => {
          if (profileImageUri) {
            handleImageUpload(null);
            setProfileModalVisible(false);
          } else {
            setProfileModalVisible(false);
          }
        }}
        onConfirm={async () => {
          setProfileModalVisible(false);
          const result = await launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 1,
            quality: 0.9,
          });
          if (result.didCancel || !result.assets?.[0]?.uri) return;
          handleImageUpload(result.assets[0].uri);
        }}
      />

      <EmailAuthConsentModal
        visible={consentVisible}
        email={emailDraft}
        onCancel={() => setConsentVisible(false)}
        onConfirm={() => {
          setConsentVisible(false);
          navigation.navigate('ResetPasswordVerify', {
            email: emailDraft,
            returnTo: 'ProfileSetting',
            skipSuccess: true,
          } as any);
        }}
      />

      <ConfirmModal
        visible={kakaoModalVisible}
        title={pendingKakaoEasyLogin ? '카카오 간편 로그인 연결' : '카카오 간편 로그인 해제'}
        message={
          pendingKakaoEasyLogin
            ? '카카오 계정을 연결하여\n간편 로그인을 사용하시겠습니까?'
            : '카카오 간편 로그인을 해제하시겠습니까?'
        }
        cancelText="취소"
        confirmText="확인"
        confirmColor={pendingKakaoEasyLogin ? undefined : '#EF4444'}
        onCancel={cancelKakaoEasyLogin}
        onConfirm={confirmKakaoEasyLogin}
      />

      <ConfirmModal
        visible={logoutVisible}
        title="로그아웃"
        message="로그아웃 하시겠습니까?"
        cancelText="취소"
        confirmText="확인"
        confirmColor="#EF4444"
        onCancel={() => setLogoutVisible(false)}
        onConfirm={handleLogout}
      />

      {/* 분리된 커스텀 모달 컴포넌트 사용 */}
      <WithdrawModal
        visible={withdrawVisible}
        provider={loginProvider}
        password={withdrawPassword}
        setPassword={(val: string) => { setWithdrawPassword(val); setWithdrawPasswordError(null); }}
        errorText={withdrawPasswordError}
        onClose={() => setWithdrawVisible(false)}
        onConfirm={handleWithdraw}
      />

      <Toast visible={toastVisible} message={toastMessage} />

      {birthPickerVisible && (
        <DateTimePicker
          value={toDate(birthDraft)}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
            setBirthPickerVisible(false);
            if (event.type === 'dismissed' || !selectedDate) return;
            const next = toYMD(selectedDate);
            if (next !== birthDraft) {
              commitBirth(next);
            }
          }}
        />
      )}

      <SexPickerModal
        visible={sexModalVisible}
        value={sexDraft}
        onClose={() => setSexModalVisible(false)}
        onSelect={(next) => commitSex(next)}
      />
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

/** -----------------------------
 * 작은 컴포넌트들
 * ------------------------------ */

function InfoRow({
  label, value, editable = false, isEditing = false, onStartEdit, onChangeText, onClear, onSubmit, keyboardType, onPressEdit, errorText,
}: any) {
  return (
    <View style={styles.rowBlock}>
      <View style={styles.row}>
        <Text style={styles.rowLabel} numberOfLines={1}>{label}</Text>
        <View style={styles.rowRight}>
          {editable && isEditing ? (
            <View style={styles.inputWrap}>
              <TextInput
                value={value} onChangeText={onChangeText} style={styles.inlineInput} autoFocus
                keyboardType={keyboardType ?? 'default'} autoCapitalize="none" autoCorrect={false}
                returnKeyType="done" blurOnSubmit onSubmitEditing={onSubmit} onBlur={onSubmit}
              />
              <TouchableOpacity onPress={onClear} activeOpacity={0.8} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.clearBtn}>
                <Image source={require('../../assets/icons/Clear.png')} style={styles.clearIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
              <TouchableOpacity onPress={editable ? onStartEdit : onPressEdit} activeOpacity={0.8} style={styles.editBtn}>
                <Image source={require('../../assets/icons/edit.png')} style={styles.editIcon} resizeMode="contain" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      {!!errorText && <Text style={styles.inlineErrorText}>{errorText}</Text>}
    </View>
  );
}

function SexPickerModal({ visible, value, onClose, onSelect }: any) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}></Pressable>
      <View style={styles.sheetWrap} pointerEvents="box-none">
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>성별 선택</Text>
          <Pressable style={[styles.sheetRow, value === 'F' && styles.sheetRowActive]} onPress={() => onSelect('F')}>
            <Text style={styles.sheetRowText}>여성</Text>
            <View style={[styles.radioOuter, value === 'F' && styles.radioOuterActive]}>
              {value === 'F' && <View style={styles.radioInner} />}
            </View>
          </Pressable>
          <Pressable style={[styles.sheetRow, value === 'M' && styles.sheetRowActive]} onPress={() => onSelect('M')}>
            <Text style={styles.sheetRowText}>남성</Text>
            <View style={[styles.radioOuter, value === 'M' && styles.radioOuterActive]}>
              {value === 'M' && <View style={styles.radioInner} />}
            </View>
          </Pressable>
          <View style={styles.sheetActions}>
            <Pressable style={styles.sheetCancelBtn} onPress={onClose}>
              <Text style={styles.sheetCancelText}>취소</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function toDate(ymd: string) {
  const parts = (ymd || '').split('-').map(Number);
  const y = parts[0] || 2000;
  const m = (parts[1] || 1) - 1;
  const d = parts[2] || 1;
  return new Date(y, m, d);
}

function toYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30, paddingHorizontal: 24, backgroundColor: '#FFFFFF', borderBottomWidth: 0.8, borderBottomColor: '#AEAEAE' },
  backCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  backImage: { width: 20, height: 20 },
  title: { color: '#333333', fontSize: 17, fontWeight: '600' },
  profileImageWrap: { marginTop: 40, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  profileImageCircle: { width: 60, height: 60, borderRadius: 46, overflow: 'hidden', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D9D9D9', justifyContent: 'center', alignItems: 'center' },
  profileImage: { width: '100%', height: '100%' },
  profileEditBtn: { position: 'absolute', right: 165, bottom: -5, width: 25, height: 25, borderRadius: 19, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#111827', justifyContent: 'center', alignItems: 'center' },
  profileEditIcon: { width: 15, height: 15 },
  infoList: { marginTop: 36, paddingHorizontal: 30 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  rowLabel: { flex: 1, fontSize: 16, color: '#111827', fontWeight: '700', marginRight: 12 },
  rowRight: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginLeft: 12 },
  rowValue: { fontSize: 16, fontWeight: '600', color: '#111827', marginRight: 15, maxWidth: 220, textAlign: 'left' },
  rowBlock: {},
  inlineErrorText: { marginTop: 6, color: '#FF0000', fontSize: 12, fontWeight: '500', textAlign: 'right' },
  editBtn: { width: 15, height: 15, justifyContent: 'center', alignItems: 'center' },
  editIcon: { width: 18, height: 18 },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  inlineInput: { flex: 1, fontSize: 16, color: '#111827', fontWeight: '500', paddingVertical: 0, paddingHorizontal: 0, textAlign: 'left' },
  clearBtn: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  clearIcon: { width: 12, height: 12, tintColor: '#FFFFFF' },
  menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  menuText: { fontSize: 16, color: '#111827', fontWeight: '700' },
  chevron: { width: 16, height: 16, tintColor: '#9CA3AF', resizeMode: 'contain' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 18 },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  sheetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  sheetRowActive: { backgroundColor: '#F8FAFC' },
  sheetRowText: { fontSize: 16, color: '#111827', fontWeight: '600' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: '#111827' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#111827' },
  sheetActions: { marginTop: 10, alignItems: 'flex-end' },
  sheetCancelBtn: { paddingVertical: 10, paddingHorizontal: 12 },
  sheetCancelText: { color: '#6B7280', fontSize: 14, fontWeight: '600' },
});