// src/components/Record_Window.tsx
import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,             // ✅ 추가
} from 'react-native';

type Doctor = {
  id: string;
  name: string;
  title: string; // 원장, 부원장 등
};

type RecordWindowProps = {
  visible: boolean;
  hospitalName: string;
  openTime: string;   // 예: "8:00"
  closeTime: string;  // 예: "18:00"
  onClose: () => void;
};

const DOCTORS: Doctor[] = [
  { id: '1', name: '최홍서', title: '원장' },
  { id: '2', name: '최희수', title: '부원장' },
  { id: '3', name: '정선우', title: '부원장' },
];

// 영업시간에서 12:00, 13:00만 제외하고 나머지 정각 시간 생성
const buildTimeSlots = (openTime: string, closeTime: string): string[] => {
  const startHour = parseInt(openTime.split(':')[0], 10);
  const endHour = parseInt(closeTime.split(':')[0], 10);

  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    if (h === 12 || h === 13) continue; // 점심시간 제외
    slots.push(`${h}:00`);
  }
  return slots;
};

const Record_Window: React.FC<RecordWindowProps> = ({
  visible,
  hospitalName,
  openTime,
  closeTime,
  onClose,
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  // 영업시간 → 진료 시간 슬롯 배열
  const timeSlots = useMemo(
    () => buildTimeSlots(openTime, closeTime),
    [openTime, closeTime]
  );

  // ✅ X를 눌러 닫을 때: 선택했던 값들 초기화 + 부모 onClose 호출
  const handleClose = () => {
    setSelectedTime(null);
    setSelectedDoctorId(null);
    onClose();
  };

  // ✅ 예약 확정 버튼 눌렀을 때
  const handleConfirm = () => {
    if (!selectedTime || !selectedDoctorId) {
      Alert.alert('알림', '진료 시간과 진료 의사를 모두 선택해주세요.');
      return;
    }

    const doctor = DOCTORS.find((d) => d.id === selectedDoctorId);

    Alert.alert(
      '예약 확정',
      `병원: ${hospitalName}\n진료 시간: ${selectedTime}\n진료 의사: ${doctor?.name} ${doctor?.title}\n\n예약이 확정되었습니다.`
    );

    // 확인 후에도 선택값 초기화 + 모달 닫기
    setSelectedTime(null);
    setSelectedDoctorId(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}   // ✅ 변경
    >
      {/* 반투명 배경 */}
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* 상단 타이틀 + 닫기 */}
          <View style={styles.cardHeader}>
            <View style={styles.modalTitleWrapper}>
              <Text style={styles.modalTitle}>병원 예약</Text>
            </View>

            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeText}>x</Text>
            </TouchableOpacity>
          </View>

          {/* 병원 이름 */}
          <Text style={styles.hospitalName}>{hospitalName}</Text>

          {/* 진료 시간 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>진료 시간</Text>

            <View style={styles.timeWrap}>
              {timeSlots.map((time) => {
                const selected = selectedTime === time;
                return (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeChip,
                      selected && styles.timeChipSelected,
                    ]}
                    onPress={() => setSelectedTime(time)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        selected && styles.timeTextSelected,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 진료 의사 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>진료 의사</Text>

            <View style={styles.doctorRow}>
              {DOCTORS.map((doc) => {
                const selected = selectedDoctorId === doc.id;
                return (
                  <TouchableOpacity
                    key={doc.id}
                    style={[
                      styles.doctorCard,
                      selected && styles.doctorCardSelected,
                    ]}
                    onPress={() => setSelectedDoctorId(doc.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.doctorIconCircle}>
                      <Text style={{ fontSize: 24, color: '#4F8DFD' }}>👨‍⚕️</Text>
                    </View>

                    <Text style={styles.doctorName}>{doc.name}</Text>
                    <Text style={styles.doctorTitle}>{doc.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ✅ 예약 확정 버튼 (맨 아래, 가운데 정렬) */}
          <View style={styles.confirmWrapper}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>예약 확정하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Record_Window;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalLogo: {
    width: 22,
    height: 22,
    marginRight: 6,
    resizeMode: 'contain',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  closeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  hospitalName: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },

  // 시간 슬롯
  timeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#D7E4FF',
    alignItems: 'center',
  },
  timeChipSelected: {
    backgroundColor: '#4F8DFD',
  },
  timeText: {
    fontSize: 13,
    color: '#1F2933',
  },
  timeTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // 의사 카드
  doctorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  doctorCard: {
    width: '30%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  doctorCardSelected: {
    borderColor: '#4F8DFD',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  doctorIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  doctorIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#4F8DFD',
  },
  doctorName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  doctorTitle: {
    fontSize: 11,
    color: '#6B7280',
  },

  // ✅ 예약 확정 버튼 스타일
  confirmWrapper: {
    marginTop: 16,
    alignItems: 'center',
  },
  confirmButton: {
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#4F8DFD',
    minWidth: '60%',
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
