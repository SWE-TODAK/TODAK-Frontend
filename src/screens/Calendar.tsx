// src/screens/Calendar.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MonthlyCalendar from '../components/Calendar/MonthlyCalendar';
import AppointmentBottomSheet, {
  Appointment,
} from '../components/Calendar/AppointmentBottomSheet';

// 🔹 더미 진료 내역 (YYYY-MM-DD 키)
const DUMMY_APPOINTMENTS: Record<string, Appointment[]> = {
  '2025-11-08': [
    {
      id: '1',
      clinicName: '제일 내과',
      department: '내과',
      time: '10:00 AM',
      content:
        '내과 진료를 통해 가슴, 인후통, 피로감 등의 증상으로 내원하였으며, 진찰 및 문진 결과 상기도 감염(감기) 소견으로 판단되어 약물치료(해열제 및 항히스타민제) 처방을 받음.\n\n추후 증상 악화 시 재내원하도록 안내받음.',
    },
  ],
};

const Calendar: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    const key = toKey(date);
    const list = DUMMY_APPOINTMENTS[key] || [];
    setAppointments(list);
  };

  return (
    <View style={styles.root}>
      {/* 🔼 상태바 높이만큼 흰색으로 덮기 */}
      <View style={{ height: insets.top, backgroundColor: '#FFFFFF' }} />

      {/* 🔹 상단 헤더 (흰색 + 구분선) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Image
            source={require('../assets/icons/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>캘린더</Text>

        <View style={{ width: 32 }} />
      </View>

      {/* 🔹 헤더 아래부터 전체 연파랑 영역 */}
      <View style={styles.content}>
        <MonthlyCalendar
          onSelectDate={handleSelectDate}
          markedDateKeys={Object.keys(DUMMY_APPOINTMENTS)}
        />

        <AppointmentBottomSheet
          visible={appointments.length > 0}
          date={selectedDate}
          appointments={appointments}
        />
      </View>
    </View>
  );
};

export default Calendar;

// 날짜 → YYYY-MM-DD 문자열
function toKey(d: Date) {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const styles = StyleSheet.create({
  // 화면 전체 배경 = 연파랑
  root: {
    flex: 1,
    backgroundColor: 'rgba(236, 242, 252, 0.8)',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.8,
    borderBottomColor: '#AEAEAE',
  },

  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  content: {
    flex: 1,
  },
});
