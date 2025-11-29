// src/components/Today_Reservation.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

type TodayReservationProps = {
  dateText: string;
  timeText: string;
  hospitalName: string;
  department: string;
  onPressRecord?: () => void;
};

const Today_Reservation: React.FC<TodayReservationProps> = ({
  dateText,
  timeText,
  hospitalName,
  department,
  onPressRecord,
}) => {
  return (
    <View style={styles.sectionContainer}>
      {/* 섹션 타이틀 */}
      <Text style={styles.sectionTitle}>오늘의 예약</Text>

      {/* 예약 카드 */}
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

            <TouchableOpacity
              style={styles.recordButton}
              onPress={onPressRecord}
              activeOpacity={0.8}
            >
              <View style={styles.recordContent}>
                <Text style={styles.recordText}>녹음하기</Text>

                <Image
                source={require('../../assets/icons/record.png')} // 네 아이콘 경로
                style={styles.recordIcon}
                />
            </View>
            </TouchableOpacity>
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
    width: '100%',          // 전체 폭 차지
    alignItems: 'flex-start', // 안에 있는 것들 왼쪽 기준
   },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft:30,
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',  // 혹시 부모가 center여도 제목은 왼쪽
  },
  cardWrapper: {
    width: '100%',           // 카드도 전체 폭
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
    marginLeft:5,
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
    backgroundColor: 'rgba(239,242,252,0.8)',  // 카드 안 연한 파란 배경
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
  recordButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recordContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginRight: 6, // 텍스트와 아이콘 사이 간격
  },
  
  recordIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});
