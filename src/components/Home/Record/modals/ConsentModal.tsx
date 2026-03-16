// components/Home/ConsentModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  visible: boolean;
  onAgree: () => void;
  onDisagree: () => void;
};

const ConsentModal: React.FC<Props> = ({ visible, onAgree, onDisagree }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDisagree}
    >
      {/* ✅ 바깥(어두운 영역)은 Pressable로: 눌리면 닫히게 */}
      <Pressable style={styles.overlay} onPress={onDisagree}>
        {/* ✅ 박스 영역은 overlay의 onPress가 전파되지 않게 */}
        <Pressable style={styles.box} onPress={() => {}}>
          <Text style={styles.title}>
            녹음을 시작하기 전,{'\n'} 병원 측의 녹음 동의를 받으셨나요?
          </Text>
          <Text style={styles.desc}>
            의료 상담 내용은 개인정보 보호를 위해{'\n'}병원 측의 동의가 필요합니다.
          </Text>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Pressable style={styles.btn} onPress={onDisagree}>
              <Text style={styles.no}>비동의</Text>
            </Pressable>
            <Pressable style={styles.btn} onPress={onAgree}>
              <Text style={styles.yes}>동의</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConsentModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  box: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    paddingTop: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111',
    paddingHorizontal: 18,
  },
  desc: {
    marginTop: 10,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#E7EAF3',
  },
  row: {
    flexDirection: 'row',
    height: 54,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  no: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  yes: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3B82F6',
  },
});