// src/components/Today_Reservation.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Hospital_Record from '../../components/Home/Hospital_Record';
import axios from '../../api/axios';

// 백엔드 응답 타입
type Consultation = {
  consultationId: number;
  hospitalName: string;
  doctorName: string;
  consultationTime: string; // 예: "2025-12-02T07:32:44.158Z"
  summaryPreview: string;
};

const Today_Reservation: React.FC = () => {
  const [reservation, setReservation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayReservation = async () => {
      try {
        setLoading(true);

        // ✅ 오늘 날짜를 YYYY-MM-DD 로 만들기
        // (UTC 기준이지만 보통 LocalDate로만 쓰면 문제 없음)
        const todayStr = new Date().toISOString().slice(0, 10); // "2025-12-02"
        console.log('🔎 Today date param:', todayStr);

        // ✅ /consultations/my/date?date=YYYY-MM-DD 호출
        const res = await axios.get<Consultation[]>('/consultations/my/date', {
          params: { date: todayStr },
        });

        const list = res.data ?? [];
        console.log('✅ 오늘의 예약 응답:', list);

        // 오늘 날짜 예약이 여러 개면 첫 번째만 사용
        if (list.length > 0) {
          setReservation(list[0]);
        } else {
          setReservation(null);
        }
      } catch (err) {
        // 🔥 500 에러 디버깅용 상세 로그
        //const axiosErr = err as AxiosError;
        //console.log('📛 오늘의 예약 조회 실패 - status:', axiosErr.response?.status);
        //console.log('📛 오늘의 예약 조회 실패 - data:', axiosErr.response?.data);

        setReservation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayReservation();
  }, []);

  // ---------------- 렌더링 분기 ----------------

  // 1) 로딩 중
  if (loading) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>오늘의 예약</Text>
        <View style={styles.emptyCard}>
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  if (!reservation) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>오늘의 예약</Text>
        {/* ✅ 예약 있을 때와 똑같이 cardWrapper 안에 넣기 */}
        <View style={styles.cardWrapper}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>오늘 예정된 예약이 없습니다.</Text>
          </View>
        </View>
      </View>
    );
  }

  // 3) 오늘 예약이 있을 때 카드 보여주기
  const dateObj = new Date(reservation.consultationTime);
  const dateText = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;
  const timeText = `${String(dateObj.getHours()).padStart(2, '0')}:${String(
    dateObj.getMinutes(),
  ).padStart(2, '0')}`;

  const hospitalName = reservation.hospitalName;
  const department = reservation.doctorName; // 진료과 필드 따로 있으면 수정

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

  // 오늘 예약 없을 때 카드
  emptyCard: {
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFD3FF',
    justifyContent: 'center',
    alignItems:'center',
    marginBottom:75,
  },
  emptyText: {
    fontSize: 16,
    color: '#444',
  },


  cardWrapper: {
    width: '100%',
    paddingHorizontal: 20,
  },
  // 예약 있을 때 카드 (그대로 두고 cardWrapper만 공유)
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
