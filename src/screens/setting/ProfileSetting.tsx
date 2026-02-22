import React, { useMemo, useState } from 'react';
import EmailAuthConsentModal from '../../components/Login/EmailAuthConsentModal';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';

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

  const sexLabel = user.sex === 'F' ? '여성' : '남성';

  const birthLabel = useMemo(() => {
    // "2004년 6월 12일" 형태
    if (!user.birth) return '';
    const [y, m, d] = user.birth.split('-').map((x) => Number(x));
    if (!y || !m || !d) return user.birth;
    return `${y}년 ${m}월 ${d}일`;
  }, [user.birth]);

  const onEditNickname = () => {
    Alert.alert('닉네임 수정', '여기에 닉네임 수정 화면/모달 연결');
  };

  const onEditEmail = () => {
    Alert.alert('이메일 수정', '여기에 이메일 수정 화면/모달 연결');
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
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        style: 'destructive',
        onPress: () => {
          // TODO: 토큰 삭제 + Login으로 이동
          navigation.replace('Login');
        },
      },
    ]);
  };

  const onPressWithdraw = () => {
    Alert.alert('회원탈퇴', '정말 탈퇴하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '확인', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
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
          <InfoRow label="닉네임" value={user.nickname} onPressEdit={onEditNickname} />
          <InfoRow label="이메일" value={user.email} onPressEdit={onEditEmail} />
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
      <EmailAuthConsentModal
        visible={consentVisible}
        email={user.email}
        onCancel={() => setConsentVisible(false)}
        onConfirm={() => {
            setConsentVisible(false);
            navigation.navigate('ResetPasswordVerify', {
                email: user.email,
                returnTo: 'ProfileSetting',
            } as any);
        }}
      />
    </SafeAreaView>
  );
}

/** -----------------------------
 * 작은 컴포넌트: label + value + 연필버튼
 * ------------------------------ */
function InfoRow({
  label,
  value,
  onPressEdit,
}: {
  label: string;
  value: string;
  onPressEdit: () => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>

      <View style={styles.rowRight}>
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>

        <TouchableOpacity
          onPress={onPressEdit}
          activeOpacity={0.8}
          style={styles.editBtn}
        >
          <Image
            source={require('../../assets/icons/edit.png')}
            style={styles.editIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
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
  editBtn: {
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: { width: 18, height: 18 },

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