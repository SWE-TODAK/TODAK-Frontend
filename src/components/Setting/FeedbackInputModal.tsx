import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from 'react-native';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (text: string) => void;
  initialValue?: string;
};

export default function FeedbackInputModal({
  visible,
  onCancel,
  onSubmit,
  initialValue = '',
}: Props) {
  const [text, setText] = useState(initialValue);
  const inputRef = useRef<TextInput>(null);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);

  // 1) 열릴 때 초기화 + 포커스
  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
      return;
    }

    setText(initialValue);

    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    return () => clearTimeout(t);
  }, [visible, initialValue]);

  // 2) 키보드 높이 추적
  useEffect(() => {
    if (!visible) return;

    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e?.endCoordinates?.height ?? 0);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [visible]);

  // 3) "필요한 만큼만" 올리기
  const translateY = useMemo(() => {
    if (!keyboardHeight || !cardHeight) return 0;

    const screenH = Dimensions.get('window').height;

    // 가운데 배치 기준일 때 카드 bottom 위치
    const centeredBottom = (screenH + cardHeight) / 2;

    // 키보드 위 20px 지점
    const targetBottom = screenH - keyboardHeight - 20;

    // 겹치면 겹친 만큼만 위로 올림
    const overlap = centeredBottom - targetBottom;

    return overlap > 0 ? -overlap : 0;
  }, [keyboardHeight, cardHeight]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel} />

      <View style={styles.centerWrap} pointerEvents="box-none">
        <View
          style={[styles.card, { transform: [{ translateY }] }]}
          onLayout={(e) => setCardHeight(e.nativeEvent.layout.height)}
        >
          <Text style={styles.title}>의견을 들려주세요</Text>
          <Text style={styles.subtitle}>더 나은 토닥을 위해 이유를 알려주세요</Text>

          <View style={styles.inputBox}>
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              placeholder="어떤 점이 만족스러우셨나요? / 불만족스러우셨나요?"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.divider} />
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btn} activeOpacity={0.8} onPress={onCancel}>
                <Text style={styles.btnTextCancel}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btn} activeOpacity={0.8} onPress={() => onSubmit(text.trim())}>
                <Text style={[styles.btnTextConfirm, { color: '#3B82F6' }]}>제출</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center', // ✅ 기본은 무조건 가운데
    paddingHorizontal: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 0,
    overflow: 'hidden',
  },
  title: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
  },
  inputBox: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    minHeight: 150,
    backgroundColor: '#FFFFFF',
  },
  input: {
    fontSize: 13,
    color: '#111827',
    minHeight: 100,
  },
  bottomSection: { marginTop: 12, height: 45 },
  divider: { height: 1, backgroundColor: '#E6E6E6' },
  actions: { flexDirection: 'row', height: 44 },
  btn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnTextCancel: { fontSize: 12, fontWeight: '600', color: '#666666' },
  btnTextConfirm: { fontSize: 12, fontWeight: '700' },
});