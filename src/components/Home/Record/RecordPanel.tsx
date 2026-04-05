// components/Home/RecordPanel.tsx
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RecordButton, { RecordButtonHandle } from './RecordButton';
import WaveVisualizer from './WaveVisualizer';

import {
  startRecordingUpload,
  notifyRecordingUploaded,
  startRecordingStt,
  saveRecordingMetadata,
} from '../../../api/recordingApi';
import uploadToS3 from '../../../utils/uploadToS3.ts';
import pollJobUntilDone from '../../../utils/pollJobStatus.ts';

// ✅ 네가 만든 모달 경로에 맞게 수정
import ConsentModal from './modals/ConsentModal';
import CompleteModal from './modals/CompleteModal';
import Toast from '../../common/Toast';

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

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
    setAudioPath(data.path);
    console.log('녹음 파일 path:', data.path);

    setRecordInfo({
      dateText: data.dateText,
      durationText: data.durationText,
    });

    setShowComplete(true);
  };

  // ✅ 완료 모달에서 완료 눌렀을 때
  const handleSubmitComplete = async (payload: {
    hospitalName: string;
    diseaseName?: string;
    doctorName?: string;
    departmentName?: string;
    title?: string;
    consultedAt?: string;
  }) => {
    if (!audioPath) {
      console.log('녹음 파일 경로가 없습니다.');
      return;
    }

    try {
      setShowComplete(false);
      setIsProcessing(true);

      // 1. 업로드 시작 요청
      setProcessMessage('업로드 준비 중입니다.');

      const uploadStart = await startRecordingUpload({
        mimeType: 'audio/wav',
      });
      const { recordingId, storageKey, uploadUrl, mimeType } = uploadStart;

      console.log('1. upload start success:', uploadStart);

      // 2. S3 직접 업로드
      setProcessMessage('녹음 파일을 업로드 중입니다.');

      await uploadToS3({
        uploadUrl,
        filePath: audioPath,
        mimeType,
      });

      console.log('2. s3 upload success');

      // 3. 업로드 완료 알림
      setProcessMessage('업로드 완료 처리 중입니다.');

      await notifyRecordingUploaded(recordingId, {
        storageKey,
        mimeType,
        durationMs: 9000,
        sampleRate: 16000,
      });

      console.log('3. uploaded notify success');


      // 4. 메타데이터 저장
      setProcessMessage('진료 정보를 저장 중입니다.');

      const metadataResult = await saveRecordingMetadata(recordingId, {
        hospitalName: payload.hospitalName,
        diseaseName: payload.diseaseName,
        doctorName: payload.doctorName,
        departmentName: payload.departmentName,
        consultedAt: payload.consultedAt,
        title: payload.title,
      });

      console.log('4. metadata save success:', metadataResult);

      const recordingTitle = metadataResult.title || payload.title || '녹음';

      // 5. STT 시작
      setProcessMessage('텍스트 변환 요청 중입니다.');

      const sttResult = await startRecordingStt(recordingId);
      const newJobId = sttResult.jobId;

      setJobId(newJobId);

      console.log('4. stt start success:', sttResult);

      // 5. polling
      setProcessMessage('녹음 내용을 텍스트로 변환하고 있습니다.');

      const finalJobResult = await pollJobUntilDone(newJobId);

      console.log('5. polling success:', finalJobResult);

      setProcessMessage('텍스트 변환이 완료되었습니다.');
      setToastMessage(`${recordingTitle}의 녹음본 변환이 완료되었습니다.`);
      setToastVisible(true);

      setTimeout(() => {
        setToastVisible(false);
      }, 1500);

      // 다음 녹음을 위해 초기화
      setHasConsent(false);
    } catch (error) {
      console.log('녹음 처리 실패:', error);
      setProcessMessage('텍스트 변환에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>진료를 녹음해보세요</Text>
      <Text style={styles.desc}>탭하면 바로 녹음이 시작돼요</Text>

      <View style={styles.buttonArea}>
        {isRecording && <WaveVisualizer />}

        <View style={styles.buttonRow}>
          <RecordButton
            ref={recordRef}
            onRecordingChange={setIsRecording}
            onTap={handleTapRecord}
            disabled={!hasConsent && !isRecording}
            onStopped={handleStopped}
          />
        </View>
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

      <Toast visible={toastVisible} message={toastMessage} />
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
  buttonArea: {
    marginTop: 24,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});

