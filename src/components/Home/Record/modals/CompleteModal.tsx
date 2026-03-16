// src/components/Home/Record/modals/CompleteModal.tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  Image,
  Keyboard,
  Dimensions,
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
  dateText,
  durationText,
  onSubmit,
}) => {
  const [hospital, setHospital] = useState('');
  const [disease, setDisease] = useState('');
  const [doctor, setDoctor] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState(dateText);

  const [showDeptList, setShowDeptList] = useState(false);
  const [isCustomDept, setIsCustomDept] = useState(false);

  // ✅ 키보드 회피 로직을 위한 상태
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);

  const departmentOptions = [
    '내과',
    '이비인후과',
    '안과',
    '피부과',
    '정형외과',
    '산부인과',
    '치과',
    '직접 입력',
  ];

  // 1) 모달 열릴 때 초기화
  useEffect(() => {
    if (visible) {
      setHospital('');
      setDisease('');
      setDoctor('');
      setDepartment('');
      setTitle(dateText);
      setKeyboardHeight(0);
      setShowDeptList(false);
      setIsCustomDept(false);
    }
  }, [visible, dateText]);

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

  // 3) "필요한 만큼만" 올리기 계산
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

  // ✅ 병원만 필수
  const canSubmit = useMemo(() => hospital.trim().length > 0, [hospital]);

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSubmit({
      hospital: hospital.trim(),
      disease: disease.trim() || undefined,
      doctor: doctor.trim() || undefined,
      department: department.trim() || undefined,
      title: title?.trim() || undefined,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      {/* 바깥 터치 시 키보드 내리기 */}
      <Pressable style={styles.backdrop} onPress={Keyboard.dismiss} />

      <View style={styles.centerWrap} pointerEvents="box-none">
        <View
          style={[styles.card, { transform: [{ translateY }] }]}
          onLayout={(e) => setCardHeight(e.nativeEvent.layout.height)}
        >
          <Text style={styles.headerBlue}>진료 녹음이 완료되었어요</Text>

          <Text style={styles.date}>{dateText ?? ''}</Text>
          <Text style={styles.duration}>{durationText ?? ''}</Text>

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

            <Text style={[styles.label, { marginLeft: 16 }]}>진료과</Text>

            <View style={{ flex: 1 }}>
              <Pressable
                style={[styles.inputRight, styles.dropdownBox]}
                onPress={() => {
                  Keyboard.dismiss(); // 드롭다운 열 때 키보드 내리기
                  setShowDeptList((prev) => !prev);
                }}
              >
                {isCustomDept ? (
                  <TextInput
                    value={department}
                    onChangeText={setDepartment}
                    placeholder="입력"
                    placeholderTextColor="#B5BED5"
                    style={styles.deptInputInside}
                    autoFocus
                  />
                ) : (
                  <Text style={{ color: department ? '#111' : 'transparent' }}>
                    {department || ' '}
                  </Text>
                )}

                <Image
                  source={require('../../../../assets/icons/arrow-right.png')}
                  style={styles.dropdownIcon}
                />
              </Pressable>

              {showDeptList && (
                <View style={styles.dropdownList}>
                  {departmentOptions.map((option) => (
                    <Pressable
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => {
                        if (option === '직접 입력') {
                          setIsCustomDept(true);
                          setDepartment('');
                        } else {
                          setIsCustomDept(false);
                          setDepartment(option);
                        }
                        setShowDeptList(false);
                      }}
                    >
                      <Text style={{ color: '#111' }}>{option}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
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
      </View>
    </Modal>
  );
};

export default CompleteModal;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    marginTop: 6,
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
    width: 120,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9DDE8',
    paddingHorizontal: 10,
    color: '#111',
  },

  labelRight: {
    marginLeft: 16,
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
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },

  dropdownIcon: {
    width: 13,
    height: 13,
    transform: [{ rotate: '90deg' }],
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -6,
  },

  dropdownList: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,

    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E7EAF3',
    backgroundColor: '#fff',
    overflow: 'hidden',

    zIndex: 999,
    elevation: 10,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F7',
  },
  deptInputInside: {
    flex: 1,
    height: 40,
    paddingLeft: 0,
    paddingRight: 34, 
    color: '#111',
  },
});