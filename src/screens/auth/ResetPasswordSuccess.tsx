import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPasswordSuccess'>;

export default function ResetPasswordSuccess({ navigation, route }: Props) {
  const email = route.params?.email ?? '';
  const [name, setName] = useState<string>(''); // ✅ 서버에서 받아올 이름
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      let mounted = true;

      const fetchName = async () => {
        try {
          // ✅ 예시 API
          // 응답 예: { name: "엄세영" } 또는 { nickname: "세영" }
          const res = await axios.get('/auth/users/name', { params: { email } });

          const serverName = res.data?.nickname ?? res.data?.name ?? '';
          if (mounted) setName(serverName);
        } catch (e) {
          // 실패 시 fallback
          if (mounted) setName('');
        } finally {
          if (mounted) setLoading(false);
        }
      };

      if (email) fetchName();
      else setLoading(false);

      return () => {
        mounted = false;
      };
    }, [email]);

    const fallbackFromEmail = email || '';
    const displayName = name || fallbackFromEmail || '회원';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
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

          <Text style={styles.title}>비밀번호 변경</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* 본문 */}
        <View style={styles.body}>
          <Text style={styles.message}>
            {email}님,{'\n'}
            비밀번호가 변경되었습니다!{'\n'}
            로그인 후 이용을 시작해 보세요
          </Text>
        </View>

        {/* 하단 버튼 */}
        <View style={styles.bottom}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'LocalLogin' }],
              });
            }}
            style={styles.btnWrap}
          >
            <Image
              source={require('../../assets/icons/goLogin.png')}
              style={styles.btnImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 24 },

  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backImage: { width: 20, height: 20 },
  title: { color: '#333333', fontSize: 17, fontWeight: '600' },

  body: { marginTop: 110 },
  message: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 30,
  },

  bottom: { marginTop: 'auto', paddingBottom: 50, alignItems: 'center' },
  btnWrap: { width: '100%', height: 52, borderRadius: 8, overflow: 'hidden' },
  btnImage: { width: '100%', height: '100%' },
});