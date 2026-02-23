import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyHistory'>;

export default function PrivacyHistory({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backCircle}>
          <Image source={require('../../assets/icons/back.png')} style={styles.backImage} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.title}>개인정보 이용 내역</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.body}>
          {/* TODO: 여기에 약관/안내 문구 붙여넣기 */}
          개인정보 처리방침 / 이용 내역 문구를 여기에 작성합니다.

          {"\n\n"}1. 수집 항목
          {"\n"}- 예: 이메일, 닉네임 등

          {"\n\n"}2. 이용 목적
          {"\n"}- 예: 서비스 제공 및 개선

          {"\n\n"}3. 보관 기간
          {"\n"}- 예: 회원 탈퇴 시까지 등
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

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
  backImage: { width: 20, height: 20 },
  title: { color: '#333333', fontSize: 17, fontWeight: '600' },

  content: { padding: 20 },
  body: { fontSize: 14, color: '#111827', lineHeight: 20 },
});