// components/Home/RecordButton.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  Animated,
  View,
} from 'react-native';
import AudioRecord from 'react-native-audio-record';

const requestMicPermission = async () => {
  if (Platform.OS === 'android') {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

// 파일명 안전하게 (중복 방지)
const getTimeString = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}_${hh}${mi}${ss}`;
};

type Props = {
  onRecordingChange?: (isRecording: boolean) => void;
};

const RecordButton: React.FC<Props> = ({ onRecordingChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [busy, setBusy] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    onRecordingChange?.(isRecording);
  }, [isRecording, onRecordingChange]);

  useEffect(() => {
    if (!isRecording) {
      scale.stopAnimation();
      scale.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.05, duration: 450, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 450, useNativeDriver: true }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [isRecording, scale]);

  const startRecording = async () => {
    const hasPermission = await requestMicPermission();
    if (!hasPermission) {
      Alert.alert('권한 필요', '마이크 사용 권한을 허용해주세요.');
      return;
    }

    const filename = `record_${getTimeString()}.wav`;

    try {
      AudioRecord.init({
        sampleRate: 16000, // ✅ 요구 스펙
        channels: 1,       // ✅ mono
        bitsPerSample: 16, // ✅ 16-bit PCM
        audioSource: 1,    // ✅ MIC
        wavFile: filename,
      });

      await AudioRecord.start();
      setIsRecording(true);
    } catch (e) {
      console.log('startRecording error:', e);
      Alert.alert('오류', '녹음을 시작할 수 없습니다.');
    }
  };

  const stopRecording = async () => {
    try {
      const path = await AudioRecord.stop();
      setIsRecording(false);
      Alert.alert('녹음 종료', `저장 경로:\n${path || '(경로 없음)'}`);
    } catch (e) {
      console.log('stopRecording error:', e);
      Alert.alert('오류', '녹음을 종료하는 중 문제가 발생했습니다.');
    }
  };

  const onPress = async () => {
    if (busy) return;
    setBusy(true);

    try {
      if (isRecording) await stopRecording();
      else await startRecording();
    } finally {
      setTimeout(() => setBusy(false), 350);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Animated.View style={[styles.outerCircle, { transform: [{ scale }] }]}>
        <View style={styles.innerCircle} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default RecordButton;

const styles = StyleSheet.create({
  outerCircle: {
  width: 90,
  height: 90,
  borderRadius: 45,
  backgroundColor: '#FFFFFF',

  borderWidth: 1.5,
  borderColor: '#000',   // ✅ 검은 테두리

  alignItems: 'center',
  justifyContent: 'center',

  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 10,
  elevation: 6,
},

innerCircle: {
  width: 75,
  height: 75,
  borderRadius: 40,
  backgroundColor: '#FF1E1E',  // 빨간색
},
});
