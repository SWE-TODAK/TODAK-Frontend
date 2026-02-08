// src/components/Home/Record/Record_Window.tsx
import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api from '../../../api/axios';

export type Doctor = {
  id: string;
  name: string;
  title: string; // 원장, 전문의 등
};

type RecordWindowProps = {
  visible: boolean;
  hospitalId: string;
  hospitalName: string;
  openTime: string;   // "09:00"
  closeTime: string;  // "18:00"
  doctors: Doctor[];
  loading?: boolean;
  onClose: () => void;
  onAppointmentCreated?: (data: any) => void;
};

// 영업시간에서 12:00, 13:00만 제외하고 나머지 정각 시간 생성
const buildTimeSlots = (openTime: string, closeTime: string): string[] => {
  const startHour = parseInt(openTime.split(':')[0], 10);
  const endHour = parseInt(closeTime.split(':')[0], 10);

  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    if (h === 12 || h === 13) continue; // 점심시간 제외
    slots.push(`${String(h).padStart(2, '0')}:00`);
  }
  return slots;
};

// ✨ 화면에 보여줄 날짜 포맷 (예: 12월 2일 (월))
const formatKoreanDate = (d: Date) => {
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const day = dayNames[d.getDay()];
  return `${month}월 ${date}일 (${day})`;
};

const Record_Window: React.FC<RecordWindowProps> = ({
  visible,
  hospitalId,
  hospitalName,
  openTime,
  closeTime,
  doctors,
  loading = false,
  onClose,
  onAppointmentCreated,
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ⭐ 새로 추가: 선택된 날짜 (기본값: 오늘)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const timeSlots = useMemo(
    () => buildTimeSlots(openTime, closeTime),
    [openTime, closeTime],
  );

  const handleClose = () => {
    setSelectedTime(null);
    setSelectedDoctorId(null);
    setSelectedDate(new Date()); // 닫을 때 다시 오늘로 초기화
    onClose();
  };

  // ✅ 예약 확정 버튼: 실제 /appointments 호출
  const handleConfirm = async () => {
    if (!selectedTime || !selectedDoctorId) {
      Alert.alert('알림', '진료 시간과 진료 의사를 모두 선택해주세요.');
      return;
    }
    if (!hospitalId) {
      Alert.alert('알림', '병원 정보가 올바르지 않습니다.');
      return;
    }

    try {
      setSubmitting(true);

      // 🔸 오늘(now)이 아니라, 사용자가 선택한 날짜 사용
      const base = selectedDate;
      const [hourStr, minuteStr] = selectedTime.split(':'); // "09:00" → ["09","00"]

      const appointmentDate = new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
        parseInt(hourStr, 10),
        parseInt(minuteStr || '0', 10),
        0,
        0,
      );
      const datetime = appointmentDate.toISOString();

      const payload = {
        hospitalId: Number(hospitalId),
        doctorId: Number(selectedDoctorId),
        datetime,
      };

      const res = await api.post('/appointments', payload);
      console.log('✅ 예약 생성 응답 raw:', res.data);

      // 🔹 백엔드가 { status, message, data: {...} } 형태라고 가정
      const created = (res.data && (res.data as any).data) || res.data;

      console.log('✅ 예약 생성 응답 unwrapped:', created);

onAppointmentCreated?.(created);   // 이제 created.appointmentId 로 쓸 수 있음

      const doctor = doctors.find(d => d.id === selectedDoctorId);

      Alert.alert(
        '예약 완료',
        `병원: ${hospitalName}\n진료 날짜: ${formatKoreanDate(base)}\n진료 시간: ${selectedTime}\n진료 의사: ${doctor?.name} ${doctor?.title}\n\n예약이 생성되었습니다.`,
      );

      setSelectedTime(null);
      setSelectedDoctorId(null);
      setSelectedDate(new Date());
      onClose();
    } catch (e) {
      console.log('❌ 예약 생성 실패:', e);
      Alert.alert('오류', '예약 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = loading || doctors.length === 0 || submitting;

  // 날짜 하루 앞/뒤로 움직이는 헬퍼
  const changeDateBy = (delta: number) => {
    setSelectedDate(prev => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + delta);
      return next;
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
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

          {/* ⭐ 진료 날짜 선택 (작은 영역) */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>진료 날짜</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={styles.dateArrowButton}
                onPress={() => changeDateBy(-1)}
                disabled={disabled}
              >
                <Text style={styles.dateArrowText}>{'<'}</Text>
              </TouchableOpacity>

              <Text style={styles.dateText}>{formatKoreanDate(selectedDate)}</Text>

              <TouchableOpacity
                style={styles.dateArrowButton}
                onPress={() => changeDateBy(1)}
                disabled={disabled}
              >
                <Text style={styles.dateArrowText}>{'>'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 진료 시간 선택 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>진료 시간</Text>

            <View style={styles.timeWrap}>
              {timeSlots.map(time => {
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
                    disabled={disabled}
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

          {/* 진료 의사 선택 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>진료 의사</Text>

            {loading ? (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <ActivityIndicator size="small" />
                <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>
                  의사 정보를 불러오는 중입니다...
                </Text>
              </View>
            ) : doctors.length === 0 ? (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#6B7280' }}>
                  의사 정보가 없습니다.
                </Text>
              </View>
            ) : (
              <View style={styles.doctorRow}>
                {doctors.map(doc => {
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
                        <Text style={{ fontSize: 24 }}>👨‍⚕️</Text>
                      </View>

                      <Text style={styles.doctorName}>{doc.name}</Text>
                      <Text style={styles.doctorTitle}>{doc.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* 예약 확정 버튼 */}
          <View style={styles.confirmWrapper}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                disabled && { backgroundColor: '#9CA3AF' },
              ]}
              onPress={handleConfirm}
              activeOpacity={0.8}
              disabled={disabled}
            >
              <Text style={styles.confirmText}>
                {submitting ? '예약 중...' : '예약 확정하기'}
              </Text>
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
  doctorName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  doctorTitle: {
    fontSize: 10,
    color: '#6B7280',
  },
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
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dateArrowButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dateArrowText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4B5563',
  },
  dateText: {
    minWidth: 140,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },

});
