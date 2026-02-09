// components/Home/Hospital_Record.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Animated,
  PermissionsAndroid,
  Platform,
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

type Props = {
  // ✅ 백 연동 안 할 거라서 필요 없음 (호출부 호환 위해 남겨도 됨)
  appointmentId?: number | null;
};

const Hospital_Record: React.FC<Props> = () => {
  const [isRecording, setIsRecording] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

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

  const startRecording = async () => {
    const hasPermission = await requestMicPermission();
    if (!hasPermission) {
      Alert.alert('권한 필요', '마이크 사용 권한을 허용해주세요.');
      return;
    }
    const getTimeString = () => {
    const d = new Date();
    return `${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
    };

    const filename = `record_${getTimeString()}.wav`;


    try {
      AudioRecord.init({
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        audioSource: 1,
        wavFile:filename,
      });

      await AudioRecord.start();
      setIsRecording(true);
      console.log('✅ 녹음 시작');
    } catch (e) {
      console.log('startRecording error:', e);
      Alert.alert('오류', '녹음을 시작할 수 없습니다.');
    }
  };

  const stopRecording = async () => {
    try {
      const path = await AudioRecord.stop();
      setIsRecording(false);
      console.log('✅ 녹음 종료, path:', path);

      // ✅ “녹음이 됐다” 확인용
      Alert.alert('녹음 종료', `저장 경로:\n${path || '(경로 없음)'}`);
    } catch (e) {
      console.log('stopRecording error:', e);
      Alert.alert('오류', '녹음을 종료하는 중 문제가 발생했습니다.');
    }
  };

  const handlePressRecord = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
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
});
