import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpSex'>;

type Sex = 'M' | 'F';

export default function SignUpSex({ navigation, route }: Props) {
  const email = route.params?.email ?? '';
  const name = route.params?.name ?? '';

  const [sex, setSex] = useState<Sex | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const canContinue = useMemo(() => !!sex, [sex]);

  const onContinue = () => {
    if (!sex) return;
    navigation.navigate('SignUpBirth', {
      email,
      name,
      sex,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
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

              <Text style={styles.title}>회원가입</Text>
              <View style={{ width: 44 }} />
            </View>

            {/* 본문 */}
            <View style={styles.form}>
              <Text style={styles.guideText}>성별을 선택해 주세요</Text>

              <View style={styles.sexRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setSex('M')}
                  style={[styles.sexBtn, sex === 'M' && styles.sexBtnActive]}
                >
                  <Text style={[styles.sexText, sex === 'M' && styles.sexTextActive]}>
                    남성
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setSex('F')}
                  style={[styles.sexBtn, sex === 'F' && styles.sexBtnActive]}
                >
                  <Text style={[styles.sexText, sex === 'F' && styles.sexTextActive]}>
                    여성
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 필요하면 안내 문구 */}
              {/* <Text style={styles.subText}>가입 후 마이페이지에서 변경할 수 있어요</Text> */}
            </View>

            {/* 하단 버튼 */}
            <View style={[styles.bottomArea, { marginBottom: keyboardHeight || 0 }]}>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={onContinue}
                activeOpacity={0.8}
                disabled={!canContinue}
              >
                <Image
                  source={
                    canContinue
                      ? require('../../assets/icons/continue-active.png')
                      : require('../../assets/icons/continue-inactive.png')
                  }
                  style={styles.continueImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, backgroundColor: '#ffffff' },
  inner: { flex: 1, paddingHorizontal: 24 },

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

  form: { marginTop: 100 },
  guideText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },

  sexRow: {
    flexDirection: 'row',
    gap: 12, // RN 최신이면 가능. 안되면 marginRight로 바꿔줄게
  },
  sexBtn: {
    flex: 1,
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  sexBtnActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59,130,246,0.08)',
  },
  sexText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  sexTextActive: {
    color: '#3B82F6',
  },

  bottomArea: {
    alignItems: 'center',
    paddingBottom: 50,
    marginTop: 'auto',
  },
  continueButton: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueImage: { width: '100%', height: '100%' },
});