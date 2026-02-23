// src/components/Home/Record/modals/CompleteModal.tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type Props = {
  visible: boolean;

  // 표시용 (원하면 RecordButton에서 duration/date 받아서 넘겨)
  dateText?: string;      // 예: "2026.01.21.화"
  durationText?: string;  // 예: "2분 34초"

  // 완료 버튼 눌렀을 때 부모에게 전달
  onSubmit: (payload: {
    hospital: string;
    disease?: string;
    doctor?: string;
    department?: string;
    title?: string;
  }) => void;
};

const CompleteModal: React.FC<Props> = ({
  visible,
  dateText = '2026.01.21.화',
  durationText = '2분 34초',
  onSubmit,
}) => {
  const [hospital, setHospital] = useState('');
  const [disease, setDisease] = useState('');
  const [doctor, setDoctor] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState(dateText);

  // 모달 열릴 때 초기화(원하면 제거 가능)
  useEffect(() => {
    if (visible) {
      setHospital('');
      setDisease('');
      setDoctor('');
      setDepartment('');
      setTitle(dateText);
    }
  }, [visible, dateText]);

  // ✅ 병원만 필수
  const canSubmit = useMemo(() => hospital.trim().length > 0, [hospital]);

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSubmit({
      hospital: hospital.trim(),
      disease: disease.trim() || undefined,
      doctor: doctor.trim() || undefined,
      department: department.trim() || undefined,
      title: title.trim() || undefined,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        // ✅ Android back 버튼으로 닫히지 않게 (무조건 완료)
        // 여기서 아무것도 안 하면 됨.
      }}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.headerBlue}>진료 녹음이 완료되었어요</Text>

          <Text style={styles.date}>{dateText}</Text>
          <Text style={styles.duration}>{durationText}</Text>

          <Text style={styles.helper}>진료 정보를 입력해주세요!</Text>

          {/* 1행: 병원* / 병명 */}
          <View style={styles.row}>
            <Text style={styles.label}>
              병원 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={hospital}
              onChangeText={setHospital}
              placeholder="예) 밝은 눈 안과"
              placeholderTextColor="#B5BED5"
              style={styles.input}
              returnKeyType="next"
            />

            <Text style={styles.labelRight}>병명</Text>
            <TextInput
              value={disease}
              onChangeText={setDisease}
              placeholder=""
              placeholderTextColor="#B5BED5"
              style={styles.inputRight}
            />
          </View>

          {/* 2행: 의사 / 진료과 */}
          <View style={styles.row}>
            <Text style={styles.label}>의사</Text>
            <TextInput
              value={doctor}
              onChangeText={setDoctor}
              placeholder=""
              placeholderTextColor="#B5BED5"
              style={styles.input}
            />

            <Text style={styles.labelRight}>진료과</Text>
            <TextInput
              value={department}
              onChangeText={setDepartment}
              placeholder=""
              placeholderTextColor="#B5BED5"
              style={styles.inputRight}
            />
          </View>

          {/* 3행: 내 진료명 */}
          <View style={styles.rowSingle}>
            <Text style={styles.labelWide}>내 진료명</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder=""
              placeholderTextColor="#B5BED5"
              style={styles.inputWide}
            />
          </View>

          {/* 완료 버튼 */}
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={[
              styles.submitBtn,
              canSubmit ? styles.submitEnabled : styles.submitDisabled,
            ]}
          >
            <Text style={styles.submitText}>완료</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CompleteModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
  },

  headerBlue: {
    textAlign: 'center',
    color: '#3B82F6',
    fontWeight: '800',
    fontSize: 16,
  },
  date: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: '#111',
  },
  duration: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 14,
    color: '#111',
  },
  helper: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 13,
    color: '#B5BED5',
  },

  row: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSingle: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  label: {
    width: 48,
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },
  required: {
    color: '#FF4D4D',
  },

  input: {
    width: 140,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9DDE8',
    paddingHorizontal: 10,
    color: '#111',
  },

  labelRight: {
    marginLeft: 18,
    width: 48,
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },
  inputRight: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9DDE8',
    paddingHorizontal: 10,
    color: '#111',
  },

  labelWide: {
    width: 80,
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },
  inputWide: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9DDE8',
    paddingHorizontal: 10,
    color: '#111',
  },

  submitBtn: {
    marginTop: 18,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: {
    backgroundColor: '#D9D9D9',
  },
  submitEnabled: {
    backgroundColor: '#3B82F6',
  },
  submitText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },
});