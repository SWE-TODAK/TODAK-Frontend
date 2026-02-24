import React, { useMemo, useState, Platform } from 'react';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
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
  Modal,
  Pressable,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
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
  // 카카오 간편 로그인 토글 confirm
  const [kakaoModalVisible, setKakaoModalVisible] = useState(false);
  const [pendingKakaoEasyLogin, setPendingKakaoEasyLogin] = useState<boolean | null>(null);

  const [consentVisible, setConsentVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [editing, setEditing] = useState<null | 'nickname' | 'email'>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nicknameDraft, setNicknameDraft] = useState(user.nickname);
  const [emailDraft, setEmailDraft] = useState(user.email);

  const [birthDraft, setBirthDraft] = useState(user.birth); // "YYYY-MM-DD"
  const [birthPickerVisible, setBirthPickerVisible] = useState(false);

  const [sexDraft, setSexDraft] = useState<'M' | 'F'>(user.sex);
  const [sexModalVisible, setSexModalVisible] = useState(false);

  const [profileImageUri, setProfileImageUri] = useState<string | null>(
    user.profileImageUrl || null
  );

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);

    // 토스트가 "보였다가 사라질 시간"과 맞춰서 false로 내려주기
    setTimeout(() => setToastVisible(false), 1400);
  };

  const sexLabel = sexDraft === 'F' ? '여성' : '남성';

  const birthLabel = useMemo(() => {
    if (!birthDraft) return '';
    const [y, m, d] = birthDraft.split('-').map((x) => Number(x));
    if (!y || !m || !d) return birthDraft;
    return `${y}년 ${m}월 ${d}일`;
  }, [birthDraft]);

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
    // 인라인 편집 중이면 저장/종료부터
    if (editing === 'nickname') commitNickname();
    if (editing === 'email') commitEmail();

    setBirthPickerVisible(true);
  };

  const onEditSex = () => {
    // 인라인 편집 중이면 저장/종료부터
    if (editing === 'nickname') commitNickname();
    if (editing === 'email') commitEmail();

    setSexModalVisible(true);
  };

  const commitSex = (next: 'M' | 'F') => {
    if (next === sexDraft) {
      setSexModalVisible(false);
      return;
    }

    setSexDraft(next);
    setSexModalVisible(false);

    // TODO: 서버 저장 API 붙일 자리
    showToast('저장됐어요');
  };

  const onEditProfileImage = () => {
    if (editing === 'nickname') commitNickname();
    if (editing === 'email') commitEmail();

    Alert.alert('프로필 사진', '프로필 사진을 변경할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '갤러리에서 선택',
        onPress: async () => {
          const result = await launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 1,
            quality: 0.9,
          });
          if (result.didCancel) return;
          const asset = result.assets?.[0];
          const uri = asset?.uri;
          if (!uri) return showToast('이미지를 불러오지 못했어요');

          setProfileImageUri(uri);
          showToast('저장됐어요');
        },
      },
      ...(profileImageUri
        ? [
            {
              text: '사진 삭제',
              style: 'destructive' as const,
              onPress: () => {
                setProfileImageUri(null);
                showToast('저장됐어요');
              },
            },
          ]
        : []),
    ]);
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
      // TODO: 서버 API 연결/해제
      // next === true  -> 카카오 연결
      // next === false -> 카카오 연결 해제
      // await api.linkKakao() / await api.unlinkKakao()

      setKakaoEasyLogin(next);
      showToast(next ? '카카오 간편 로그인이 연결됐어요' : '카카오 간편 로그인이 해제됐어요');
    } catch (e) {
      // 실패 시 스위치 변경 안 함
      showToast('처리 중 오류가 발생했어요');
    }
  };

  const cancelKakaoEasyLogin = () => {
    setKakaoModalVisible(false);
    setPendingKakaoEasyLogin(null);
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
          if (birthPickerVisible) return;
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
                profileImageUri
                  ? { uri: profileImageUri }
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
                onValueChange={onToggleKakaoEasyLogin}
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

            {/* 카카오 모달 */}
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
              // 해제는 위험 행동 느낌이 있으니 빨간색, 연결은 기본 색(네 ConfirmModal 기본값 없으면 여기서 지정 안 해도 됨)
              confirmColor={pendingKakaoEasyLogin ? undefined : '#EF4444'}
              onCancel={cancelKakaoEasyLogin}
              onConfirm={confirmKakaoEasyLogin}
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
          {birthPickerVisible && (
            <DateTimePicker
              value={toDate(birthDraft)}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                // Android는 선택/취소 후 onChange가 호출되고, 여기서 닫아줘야 함
                setBirthPickerVisible(false);

                if (event.type === 'dismissed') return;
                if (!selectedDate) return;

                const next = toYMD(selectedDate);

                if (next !== birthDraft) {
                  setBirthDraft(next);
                  showToast('저장됐어요');
                  // TODO: 서버 저장 API 붙일 자리
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

function SexPickerModal({
  visible,
  value,
  onClose,
  onSelect,
}: {
  visible: boolean;
  value: 'M' | 'F';
  onClose: () => void;
  onSelect: (v: 'M' | 'F') => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        {/* backdrop 눌렀을 때만 닫히게 */}
      </Pressable>

      <View style={styles.sheetWrap} pointerEvents="box-none">
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>성별 선택</Text>

          <Pressable
            style={[styles.sheetRow, value === 'F' && styles.sheetRowActive]}
            onPress={() => onSelect('F')}
          >
            <Text style={styles.sheetRowText}>여성</Text>
            <View style={[styles.radioOuter, value === 'F' && styles.radioOuterActive]}>
              {value === 'F' && <View style={styles.radioInner} />}
            </View>
          </Pressable>

          <Pressable
            style={[styles.sheetRow, value === 'M' && styles.sheetRowActive]}
            onPress={() => onSelect('M')}
          >
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
  // ymd가 비정상이어도 안전한 기본값 사용
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
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  sheetWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },

  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  sheetRowActive: {
    backgroundColor: '#F8FAFC',
  },

  sheetRowText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioOuterActive: {
    borderColor: '#111827',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111827',
  },

  sheetActions: {
    marginTop: 10,
    alignItems: 'flex-end',
  },

  sheetCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  sheetCancelText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
});