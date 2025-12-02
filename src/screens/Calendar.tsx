// src/screens/Calendar.tsx
import React, { useEffect, useMemo, useState } from 'react';
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
import axios from '../api/axios';

// 🔹 백엔드 /consultations/my, /consultations/my/date 응답 타입
type ConsultationDto = {
  consultationId: number;
  hospitalName: string;
  doctorName: string;
  consultationTime: string; // "2025-12-02T19:00:11.296Z"
  summaryPreview: string;
};

const Calendar: React.FC = () => {
  const insets = useSafeAreaInsets();

  // 전체 진료 목록 (달력에 점 찍는 용)
  const [allConsultations, setAllConsultations] = useState<ConsultationDto[]>([]);
  // 선택한 날짜
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // 선택한 날짜의 진료 목록 (바텀시트에 보여줄 것)
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // 🔹 화면 들어올 때 내 진료 전체 조회 (/consultations/my)
  useEffect(() => {
    const fetchAllConsultations = async () => {
      try {
        const res = await axios.get<ConsultationDto[]>('/consultations/my');
        console.log('✅ /consultations/my:', res.data);
        setAllConsultations(res.data || []);
      } catch (e) {
        console.log('📛 전체 진료 조회 실패:', e);
        setAllConsultations([]);
      }
    };

    fetchAllConsultations();
  }, []);

  // 🔹 달력에 점 찍을 날짜들 (YYYY-MM-DD 배열)
  const markedDateKeys = useMemo(() => {
    const set = new Set<string>();

    allConsultations.forEach((c) => {
      const d = new Date(c.consultationTime);
      set.add(toKey(d));
    });

    return Array.from(set);
  }, [allConsultations]);

  // 🔹 날짜 선택 시: 그 날짜의 진료 목록 조회 (/consultations/my/date)
  const handleSelectDate = async (date: Date) => {
    setSelectedDate(date);
    const dateStr = toKey(date); // YYYY-MM-DD

    try {
      const res = await axios.get<ConsultationDto[]>(
        '/consultations/my/date',
        { params: { date: dateStr } },
      );
      console.log('✅ /consultations/my/date:', dateStr, res.data);

      const list = (res.data || []).map<Appointment>((c) => ({
        id: String(c.consultationId),
        clinicName: c.hospitalName,
        department: c.doctorName, // 혹시 나중에 department 있으면 여기 교체
        time: formatTime(c.consultationTime),
        content: c.summaryPreview,
      }));

      setAppointments(list);
    } catch (e) {
      console.log('📛 날짜별 진료 조회 실패:', e);
      setAppointments([]);
    }
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
          markedDateKeys={markedDateKeys}
        />

        <AppointmentBottomSheet
          visible={appointments.length > 0}
          date={selectedDate}
          appointments={appointments}
          // onPressRecording, onPressDetail 필요하면 여기서 넘겨주면 됨
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

// "2025-12-02T19:00:11.296Z" → "19:00" 이런 식으로
function formatTime(iso: string) {
  const d = new Date(iso);
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
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
