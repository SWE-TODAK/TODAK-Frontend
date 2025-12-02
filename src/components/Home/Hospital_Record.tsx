// components/Home/Hospital_Record.tsx
import React, { useEffect, useRef, useState } from 'react';
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

import AudioRecord from 'react-native-audio-record';
import axios from '../../api/axios';

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

type ConsultationStartResponse = {
  consultationId: number;
  appointmentId: number;
  hospitalName: string;
  consultationTime: string;
};

// 🔹 업로드 경로
const RECORD_UPLOAD_PATH = (consultationId: string | number) =>
  `/recordings/${consultationId}`;

// 🔹 마이크 권한
const requestMicPermission = async () => {
  if (Platform.OS === 'android') {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

const Hospital_Record: React.FC = () => {
  // ✅ 훅은 무조건 여기 한번만
  const [isRecording, setIsRecording] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [code, setCode] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [consultationId, setConsultationId] = useState<number | null>(null);

  const scale = useRef(new Animated.Value(1)).current;

  // 🔹 버튼 숨쉬기 애니메이션
  useEffect(() => {
    if (!isRecording) {
      scale.stopAnimation();
      scale.setValue(1);
      return;
    }

    const loop = Animated.loop(
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
    );

    loop.start();
    return () => loop.stop();
  }, [isRecording, scale]);

  // 🔹 메인 버튼
  const handlePressRecord = async () => {
    if (isRecording) {
      await handleStopRecording();
    } else {
      setShowConsent(true);
    }
  };

  // 🔹 동의 코드(= appointmentId) 인증
  const handleConfirmConsent = async () => {
    const trimmed = code.trim();

    if (!trimmed) {
      Alert.alert('입력 오류', '동의 코드를 입력해주세요.');
      return;
    }

    const appointmentId = Number(trimmed);
    if (Number.isNaN(appointmentId)) {
      Alert.alert('입력 오류', '동의 코드는 숫자만 입력 가능합니다.');
      return;
    }

    try {
      setIsVerifyingCode(true);

      const res = await axios.post<ConsultationStartResponse>(
        '/consultations/start',
        null,
        { params: { appointmentId } },
      );

      setConsultationId(res.data.consultationId);
      setShowConsent(false);
      setCode('');

      const started = await startRecording();
      if (started) {
        setIsRecording(true);
      }
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 404) {
        Alert.alert(
          '인증 실패',
          '유효하지 않은 동의 코드입니다.\n병원에서 받은 코드를 다시 확인해주세요.',
        );
      } else {
        Alert.alert(
          '인증 실패',
          '동의 코드 확인 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
        );
      }
    } finally {
      setIsVerifyingCode(false);
    }
  };

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

  const handleStopRecording = async () => {
    try {
      const audioFilePath = await AudioRecord.stop();
      console.log('녹음 종료, path:', audioFilePath);
      setIsRecording(false);

      if (!consultationId) {
        Alert.alert(
          '오류',
          '진료 정보가 없습니다.\n동의 코드 인증 후 다시 시도해주세요.',
        );
        return;
      }

      if (audioFilePath) {
        await uploadRecording(audioFilePath, consultationId);
      }
    } catch (e) {
      console.log('stopRecording error:', e);
      Alert.alert('오류', '녹음을 종료하는 중 문제가 발생했습니다.');
    }
  };

  const uploadRecording = async (
    wavPath: string,
    consultationId: number | string,
  ) => {
    try {
      setIsUploading(true);

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

      const res = await axios.post<RecordingResponse>(
        RECORD_UPLOAD_PATH(consultationId),
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      Alert.alert(
        '업로드 성공',
        `recordingId: ${res.data.recordingId}\nstatus: ${res.data.status}`,
      );
    } catch (e: any) {
      console.log('uploadRecording error:', e?.message);
      if (e?.response) {
        console.log('❌ 서버 status:', e.response.status);
        console.log('❌ 서버 data:', e.response.data);
      }
      Alert.alert('업로드 실패', '녹음 파일을 전송하는 데 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* 메인 버튼 */}
      <TouchableOpacity
        onPress={handlePressRecord}
        activeOpacity={0.8}
        disabled={isUploading || isVerifyingCode}
      >
        <Animated.View
          style={[
            styles.recordButton,
            {
              backgroundColor: isRecording ? 'rgb(100, 170, 290)' : '#3B82F6',
              opacity: isUploading || isVerifyingCode ? 0.6 : 1,
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

      {/* 동의 코드 모달 */}
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
              placeholder="병원에서 받은 동의 코드(숫자)를 입력하세요"
              placeholderTextColor="#B5BED5"
              keyboardType="number-pad"
              style={styles.input}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowConsent(false);
                  setCode('');
                }}
                disabled={isVerifyingCode}
              >
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.okBtn}
                onPress={handleConfirmConsent}
                disabled={isVerifyingCode}
              >
                <Text style={styles.okText}>
                  {isVerifyingCode ? '확인 중...' : '확인'}
                </Text>
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
