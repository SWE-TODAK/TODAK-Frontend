// components/Home/RecordPanel.tsx
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RecordButton, { RecordButtonHandle } from './RecordButton';

// ✅ 네가 만든 모달 경로에 맞게 수정
import ConsentModal from './modals/ConsentModal';
import CompleteModal from './modals/CompleteModal';

const RecordPanel: React.FC = () => {
  const recordRef = useRef<RecordButtonHandle>(null);

  const [isRecording, setIsRecording] = useState(false);

  const [recordInfo, setRecordInfo] = useState({
    dateText: '',
    durationText: '',
  });

  // ✅ 동의/완료 모달 제어
  const [showConsent, setShowConsent] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  // ✅ “이번 녹음에 대해 동의 받았는지” 플래그
  const [hasConsent, setHasConsent] = useState(false);

  // ✅ 버튼 눌렀을 때 (부모가 먼저 판단)
  const handleTapRecord = () => {
    // 녹음 중이면(=stop 하는 상황) 동의 모달 띄우면 안 됨
    if (isRecording) return;

    // 녹음 시작하려는데 동의가 없으면 모달 띄우기
    if (!hasConsent) {
      setShowConsent(true);
    }
  };

  // ✅ 동의 모달에서 “동의” 눌렀을 때
  const handleAgreeConsent = async () => {
    setHasConsent(true);
    setShowConsent(false);

    // ✅ 바로 녹음 시작 (한 번 더 버튼 누를 필요 없게)
    await recordRef.current?.start();
  };

  // ✅ 동의 모달에서 “비동의” 눌렀을 때
  const handleDisagreeConsent = () => {
    setHasConsent(false);
    setShowConsent(false);
  };

  // ✅ 녹음 stop 되었을 때 -> CompleteModal 띄우기
  const handleStopped = (data: {
    path: string | null;
    durationText: string;
    dateText: string;
  }) => {
    setRecordInfo({
      dateText: data.dateText,
      durationText: data.durationText,
    });

    setShowComplete(true);
  };

  // ✅ 완료 모달에서 완료 눌렀을 때
  const handleSubmitComplete = (payload: { hospital: string }) => {
    // TODO: 나중에 백 연결
    // console.log('submit payload:', payload);

    setShowComplete(false);

    // ✅ 다음 녹음 때는 다시 동의 받게 하고 싶다 했으니 reset
    setHasConsent(false);
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>진료를 녹음해보세요</Text>
      <Text style={styles.desc}>탭하면 바로 녹음이 시작돼요</Text>

      <View style={styles.buttonRow}>
        <RecordButton
          ref={recordRef}
          onRecordingChange={setIsRecording}
          onTap={handleTapRecord}
          disabled={!hasConsent && !isRecording}
          onStopped={handleStopped}
        />
      </View>

      {/* ✅ 동의 모달 */}
      <ConsentModal
        visible={showConsent}
        onAgree={handleAgreeConsent}
        onDisagree={handleDisagreeConsent}
      />

      {/* ✅ 녹음 완료 모달 */}
      <CompleteModal
        visible={showComplete}
        dateText={recordInfo.dateText}
        durationText={recordInfo.durationText}
        onSubmit={handleSubmitComplete}
      />
    </View>
  );
};

export default RecordPanel;

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
  },
  desc: {
    marginTop: 6,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  buttonRow: {
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});