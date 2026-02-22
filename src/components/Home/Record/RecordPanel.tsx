// components/Home/RecordPanel.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RecordButton from './RecordButton';

const RecordPanel: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>진료를 녹음해보세요</Text>
      <Text style={styles.desc}>탭하면 바로 녹음이 시작돼요</Text>

      <View style={styles.buttonRow}>
        <RecordButton onRecordingChange={setIsRecording} />
      </View>

      {/* 선택: 상태 텍스트 필요하면 */}
      {/* <Text style={styles.state}>{isRecording ? '녹음 중…' : ''}</Text> */}
    </View>
  );
};

export default RecordPanel;

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    backgroundColor: '#FFFFFF',

    // ✅ 위쪽만 둥글게
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,

    // ✅ 높이 고정 X
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