// components/Home/Hospital_Record.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  Animated,
  PermissionsAndroid,   // ✅ 추가
  Platform,
} from 'react-native';

import RNFS from 'react-native-fs';
import AudioRecord from 'react-native-audio-record';
import axios from '../../api/axios';


const Hospital_Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [code, setCode] = useState('');

  const scale = useRef(new Animated.Value(1)).current;

  const [lastRecordPath, setLastRecordPath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 🎙 마이크 권한 요청
  const requestMicPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      return result === PermissionsAndroid.RESULTS.GRANTED;
    }

    // 지금은 안드로이드만 쓸 예정이라도, 나중 대비용
    return true;
  };

  useEffect(() => {
    if (isRecording) {
      // 녹음 중 → 계속 커졌다 작아졌다
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.05,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // 녹음 중 아님 → 애니 초기화
      scale.stopAnimation();
      scale.setValue(1);
    }
  }, [isRecording]);

  
  const handlePressRecord = async () => {
    if (isRecording) {
      await handleStopRecording();
    } else {
      setShowConsent(true);
    }
  };
  

  const handleConfirmConsent = async () => {
    const ok = await fakeVerifyCode(code);
  
    if (!ok) {
      Alert.alert('인증 실패', '동의 코드를 다시 확인해주세요.');
      return;
    }
  
    setShowConsent(false);
    setCode('');
  
    // 🔹 실제 녹음 시작 시도
    const started = await startRecording();
    if (started) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
    }
  };
  

  const handleStopRecording = async () => {
    await stopRecording();
    setIsRecording(false);
  };

  // 🎙 실제 녹음 시작 (AudioRecord 사용)
  const startRecording = async (): Promise<boolean> => {
    const hasPermission = await requestMicPermission();
    if (!hasPermission) {
      Alert.alert('권한 필요', '마이크 사용 권한을 허용해주세요.');
      return false;
    }

    try {
      // 🔧 여기서 바로 초기화
      AudioRecord.init({
        sampleRate: 44100,      // 샘플링 레이트
        channels: 1,            // 모노
        bitsPerSample: 16,      // 16비트
        audioSource: 6,         // 안드로이드 MIC 소스
        wavFile: 'todak_record.wav',  // 저장될 파일 이름
      });

      // 그리고 녹음 시작
      await AudioRecord.start();
      console.log('녹음 시작');
      return true;
    } catch (e) {
      console.log('startRecording error:', e);
      Alert.alert('오류', '녹음을 시작할 수 없습니다.');
      return false;
    }
  };


  // 🎙 녹음 종료 (AudioRecord 사용)
const stopRecording = async () => {
  try {
    const audioFilePath = await AudioRecord.stop(); // 여기서 wav 파일 경로를 돌려줌
    console.log('녹음 종료, path:', audioFilePath);
    setLastRecordPath(audioFilePath);
  } catch (e) {
    console.log('stopRecording error:', e);
    Alert.alert('오류', '녹음을 종료하는 중 문제가 발생했습니다.');
  }
};


  const fakeVerifyCode = async (value: string) => value === '1234';

  return (
    <>
      {/* 버튼 */}
      <TouchableOpacity onPress={handlePressRecord} activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.recordButton,
            {
              backgroundColor: isRecording ? 'rgb(100, 170, 290)' : '#3B82F6',
              transform: [{ scale }],
            },
          ]}
        >
          <Text style={[styles.recordText, { color: '#FFFFFF' }]}>
            {isRecording ? '녹음 중' : '녹음하기'}
          </Text>

          <Image
            source={require('../../assets/icons/record.png')}
            style={styles.recordIcon}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* 모달 */}
      <Modal
        visible={showConsent}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConsent(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalBox}>
            <View style={styles.logoRow}>
              <Image
                source={require('../../assets/photo/토닥 로고.png')}
                style={styles.logoIcon}
              />
              <Text style={styles.logoText}>토닥</Text>
            </View>

            <Text style={styles.title}>
              녹음을 시작하기 전, 병원 측의 녹음 동의를 받으셨나요?
            </Text>

            <Text style={styles.desc}>
              의료 상담 내용은 개인정보 보호를 위해{'\n'}
              병원 측의 동의가 필요합니다.
            </Text>

            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="입력"
              placeholderTextColor="#B5BED5"
              style={styles.input}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowConsent(false);
                  setCode('');
                }}
              >
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.okBtn} onPress={handleConfirmConsent}>
                <Text style={styles.okText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Hospital_Record;

const styles = StyleSheet.create({
  // 버튼 스타일
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 27,
    borderRadius: 20,
  },
  recordText: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 6,
  },
  recordIcon: {
    width: 20,
    height: 20,
  },

  // 모달
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingVertical: 26,
    paddingHorizontal: 24,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoIcon: {
    width: 30,
    height: 30,
    marginRight: 6,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3F4FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F2F4FA',
    textAlign: 'center',
    paddingVertical: 0,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  cancelText: {
    fontSize: 14,
    color: '#000',
  },
  okBtn: {
    backgroundColor: '#3F4FFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  okText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
});
