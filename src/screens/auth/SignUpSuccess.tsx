import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpSuccess'>;

export default function SignUpSuccess({ navigation, route }: Props) {
  // ✅ birth 화면에서 넘겨준 값 받기
  const { email = '', name = '', sex = '', birth = '' } = route.params ?? {};

  // ✅ 표시용 이름 (name 우선, 없으면 email, 없으면 '회원')
  const displayName = name || email || '회원';

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

          <Text style={styles.title}>회원가입 완료</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* 본문 */}
        <View style={styles.body}>
          <Text style={styles.message}>
            {displayName}님,{'\n'}
            회원가입이 완료되었습니다!{'\n'}
            로그인 후 이용을 시작해 보세요
          </Text>
        </View>

        {/* 하단 버튼 */}
        <View style={styles.bottom}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // ✅ 로그인 화면으로 이동 (뒤로가기 스택 제거)
              navigation.reset({
                index: 0,
                routes: [{ name: 'LocalLogin', params: { email } }],
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
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },

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

  backImage: {
    width: 20,
    height: 20,
  },

  title: {
    color: '#333333',
    fontSize: 17,
    fontWeight: '600',
  },

  body: {
    marginTop: 110,
  },

  message: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 30,
  },

  bottom: {
    marginTop: 'auto',
    paddingBottom: 50,
    alignItems: 'center',
  },

  btnWrap: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    overflow: 'hidden',
  },

  btnImage: {
    width: '100%',
    height: '100%',
  },
});