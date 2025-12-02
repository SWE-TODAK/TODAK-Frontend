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
  PermissionsAndroid,
  Platform,
} from 'react-native';

import RNFS from 'react-native-fs';
import AudioRecord from 'react-native-audio-record';
import axios from '../../api/axios';

// 스웨거 응답 타입 (선택이지만 있으면 편함)
type RecordingResponse = {
  recordingId: number;
  consultationId: number;
  hospitalId: number;
  filePath: string;
  durationSeconds: number;
  fileSizeMb: number;
  transcript: string;
  status: string;
  createdAt: string;
  authorizedAt: string | null;
};

/* ============================
 * 🔹 백엔드 연동 설정
 * ============================ */

// 1) 업로드 경로 함수: /recordings/{consultationId}
const RECORD_UPLOAD_PATH = (consultationId: string | number) =>
  `/recordings/${consultationId}`;

// 2) 보낼 JSON 형식 (이 함수 안만 나중에 수정하면 됨)
const buildUploadPayload = (base64Audio: string) => {
  return {
    fileName: 'todak_record.wav',
    mimeType: 'audio/wav',
    audioBase64: base64Audio,
    // TODO: 백엔드에서 추가로 요구하면 여기다 키 추가
    // example: consultationMemo: '...', userId: '...'
  };
};

const Hospital_Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [code, setCode] = useState('');

  const scale = useRef(new Animated.Value(1)).current;

  const [lastRecordPath, setLastRecordPath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 🔸 나중에 진짜 진료ID로 바꾸면 됨
  const consultationId = 1;

  // 🎙 마이크 권한 요청
  const requestMicPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    if (isRecording) {
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
        ]),
      ).start();
    } else {
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
      AudioRecord.init({
        sampleRate: 44100,
        channels: 1,
        bitsPerSample: 16,
        audioSource: 6,
        wavFile: 'todak_record.wav',
      });

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
      const audioFilePath = await AudioRecord.stop(); // wav 파일 경로
      console.log('녹음 종료, path:', audioFilePath);
      setLastRecordPath(audioFilePath);

      if (audioFilePath) {
        await uploadRecording(audioFilePath, consultationId);
      }
    } catch (e) {
      console.log('stopRecording error:', e);
      Alert.alert('오류', '녹음을 종료하는 중 문제가 발생했습니다.');
    }
  };

  // 스웨거 응답 타입 (선택이지만 있으면 편함)
type RecordingResponse = {
  recordingId: number;
  consultationId: number;
  hospitalId: number;
  filePath: string;
  durationSeconds: number;
  fileSizeMb: number;
  transcript: string;
  status: string;
  createdAt: string;
  authorizedAt: string | null;
};

// ...

// 📤 wav 파일을 백엔드로 업로드 (multipart/form-data)
const uploadRecording = async (
  wavPath: string,
  consultationId: number | string,
) => {
  try {
    setIsUploading(true);

    // Android 에서는 file:// 붙여주는 게 안전
    const uri =
      Platform.OS === 'android' && !wavPath.startsWith('file://')
        ? `file://${wavPath}`
        : wavPath;

    const file = {
      uri,
      name: 'todak_record.wav',
      type: 'audio/wav',
    } as any;

    const formData = new FormData();
    formData.append('file', file);

    console.log(
      '👉 upload url:',
      RECORD_UPLOAD_PATH(consultationId),
      'file uri:',
      uri,
    );

    const res = await axios.post<RecordingResponse>(
      RECORD_UPLOAD_PATH(consultationId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    // 🔹 여기서 응답 제대로 받았는지 확인
    console.log('✅ 업로드 응답 status:', res.status);
    console.log('✅ 업로드 응답 data:', res.data);

    Alert.alert(
      '업로드 성공',
      `recordingId: ${res.data.recordingId}\nstatus: ${res.data.status}`,
    );
  } catch (e: any) {
    console.log('uploadRecording error:', e?.message);
    // axios 에러일 때 서버 응답도 찍기
    if (e?.response) {
      console.log('❌ 서버 status:', e.response.status);
      console.log('❌ 서버 data:', e.response.data);
    }
    Alert.alert('업로드 실패', '녹음 파일을 전송하는 데 실패했습니다.');
  } finally {
    setIsUploading(false);
  }
};



  const fakeVerifyCode = async (value: string) => value === '1234';

  return (
    <>
      {/* 버튼 */}
      <TouchableOpacity
        onPress={handlePressRecord}
        activeOpacity={0.8}
        disabled={isUploading}
      >
        <Animated.View
          style={[
            styles.recordButton,
            {
              backgroundColor: isRecording ? 'rgb(100, 170, 290)' : '#3B82F6',
              opacity: isUploading ? 0.6 : 1,
              transform: [{ scale }],
            },
          ]}
        >
          <Text style={[styles.recordText, { color: '#FFFFFF' }]}>
            {isUploading
              ? '업로드 중...'
              : isRecording
              ? '녹음 중'
              : '녹음하기'}
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

// 아래 styles는 네가 쓰던 그대로라 변경 없음
const styles = StyleSheet.create({
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
