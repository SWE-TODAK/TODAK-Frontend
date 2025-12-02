// src/components/Home/Today_Reservation.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Hospital_Record from '../../components/Home/Hospital_Record';
import axios from '../../api/axios';

// 🔹 /appointments/my/today 응답 타입
type TodayAppointment = {
  appointmentId: number;
  patientId: string;
  hospitalId: number;
  hospitalName: string;
  doctorId: number;
  doctorName: string;
  departmentId: number | null;
  departmentName: string | null;
  datetime: string;   // "2025-12-02T17:28:44.025Z"
  status: string;     // "REQUESTED" 등
};

const Today_Reservation: React.FC = () => {
  // ✅ 훅들은 항상 컴포넌트 최상단에서, 조건 없이
  const [reservation, setReservation] = useState<TodayAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    // 화면에 포커스 안 돼 있으면 호출 안 함
    if (!isFocused) {
      return;
    }

    const fetchTodayReservation = async () => {
      try {
        setLoading(true);

        const res = await axios.get<TodayAppointment | TodayAppointment[]>(
          '/appointments/my/today',
        );

        let appt: TodayAppointment | null = null;

        if (Array.isArray(res.data)) {
          appt = res.data.length > 0 ? res.data[0] : null;
        } else if (res.data) {
          appt = res.data;
        }

        console.log('✅ 오늘의 예약 응답:', appt);
        setReservation(appt);
      } catch (err) {
        console.log('📛 오늘의 예약 조회 실패:', err);
        setReservation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayReservation();
  }, [isFocused]); // ✅ 포커스가 바뀔 때마다 다시 조회

  // ---------------- 렌더링 분기 ----------------

  if (loading) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>오늘의 예약</Text>
        <View style={styles.cardWrapper}>
          <View style={styles.emptyCard}>
            <ActivityIndicator />
          </View>
        </View>
      </View>
    );
  }

  if (!reservation) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>오늘의 예약</Text>
        <View style={styles.cardWrapper}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>오늘 예정된 예약이 없습니다.</Text>
          </View>
        </View>
      </View>
    );
  }

  const dateObj = new Date(reservation.datetime);
  const dateText = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;
  const timeText = `${String(dateObj.getHours()).padStart(2, '0')}:${String(
    dateObj.getMinutes(),
  ).padStart(2, '0')}`;

  const hospitalName = reservation.hospitalName;
  const department = reservation.departmentName || reservation.doctorName;

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>오늘의 예약</Text>

      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          {/* 날짜 */}
          <View style={styles.row}>
            <Image
              source={require('../../assets/icons/calendar-blue.png')}
              style={styles.icon}
            />
            <Text style={styles.dateText}>{dateText}</Text>
          </View>

          {/* 시간 */}
          <View style={styles.row}>
            <Image
              source={require('../../assets/icons/clock-blue.png')}
              style={styles.icon}
            />
            <Text style={styles.timeText}>{timeText}</Text>
          </View>

          {/* 병원명 + 녹음 버튼 */}
          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.hospitalName}>{hospitalName}</Text>
              <Text style={styles.department}>{department}</Text>
            </View>

            <Hospital_Record />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Today_Reservation;

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 8,
    width: '100%',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 30,
    marginBottom: 8,
  },

  // "오늘 예약 없음" 카드
  emptyCard: {
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFD3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 75,
  },
  emptyText: {
    fontSize: 16,
    color: '#444',
  },

  cardWrapper: {
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#BFD3FF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 5,
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '700',
  },
  timeText: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '700',
  },
  bottomRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(239,242,252,0.8)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  hospitalName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#222',
  },
  department: {
    marginTop: 2,
    fontSize: 12,
    color: '#888',
  },
});
