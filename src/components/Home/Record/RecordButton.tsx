// components/Home/RecordButton.tsx
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
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

  // ✅ 버튼을 눌렀을 때 부모(RecordPanel)가 먼저 처리해야 하는 로직
  onTap?: () => void;

  // ✅ 동의 전에는 버튼 눌러도 녹음 실행 막기
  disabled?: boolean;

  // ✅ stop 후 파일 경로를 부모에게 알려줌 (CompleteModal 띄우기)
  onStopped?: (path: string | null) => void;
};

// ✅ 부모가 start/stop을 직접 호출할 수 있도록 ref로 노출
export type RecordButtonHandle = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
};

const RecordButton = forwardRef<RecordButtonHandle, Props>(
  ({ onRecordingChange, onTap, disabled, onStopped }, ref) => {
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

      const filename = `record_${getTimeString()}.wav`;

      AudioRecord.init({
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        audioSource: 1,
        wavFile: filename,
      });

      await AudioRecord.start();
      setIsRecording(true);
    };

    const stopRecording = async () => {
      const path = await AudioRecord.stop();
      setIsRecording(false);
      onStopped?.(path || null); // ✅ 부모에게 알림
    };

    const toggle = async () => {
      if (busy) return;
      setBusy(true);
      try {
        if (isRecording) await stopRecording();
        else await startRecording();
      } catch (e) {
        console.log('RecordButton toggle error:', e);
      } finally {
        setTimeout(() => setBusy(false), 300);
      }
    };

    // ✅ 부모에서 start/stop 강제로 호출 가능
    useImperativeHandle(ref, () => ({
      start: async () => {
        if (isRecording) return;
        await startRecording();
      },
      stop: async () => {
        if (!isRecording) return;
        await stopRecording();
      },
    }));

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={async () => {
          // 1) 동의 모달/로직은 무조건 실행
          onTap?.();

          // 2) 동의 안 했으면 여기서 끝 (녹음 토글 X)
          if (disabled) return;

          // 3) 동의 했으면 녹음 토글
          await toggle();
        }}
      >
        <Animated.View style={[styles.outerCircle, { transform: [{ scale }] }]}>
          <View style={styles.innerCircle} />
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

export default RecordButton;

const styles = StyleSheet.create({
  outerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000',
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
    backgroundColor: '#FF1E1E',
  },
});