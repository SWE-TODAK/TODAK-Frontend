// src/components/Today_Reservation.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Hospital_Record from '../../components/Home/Hospital_Record';

type TodayReservationProps = {
  dateText: string;
  timeText: string;
  hospitalName: string;
  department: string;
};

const Today_Reservation: React.FC<TodayReservationProps> = ({
  dateText,
  timeText,
  hospitalName,
  department,
}) => {
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

            {/* ⬇ Hospital_Record 단독 삽입 */}
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
