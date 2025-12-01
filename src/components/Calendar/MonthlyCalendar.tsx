// src/components/calendar/MonthlyCalendar.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';



type DayCell = {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
};

type Props = {
    onSelectDate?: (date: Date) => void;
    markedDateKeys?: string[];   // YYYY-MM-DD
  };

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthlyCalendar: React.FC<Props> = ({
    onSelectDate,
    markedDateKeys = [],
  }) => {
    const today = useMemo(() => new Date(), []);
    const [visibleYear, setVisibleYear] = useState(today.getFullYear());
    const [visibleMonth, setVisibleMonth] = useState(today.getMonth()); // 0~11
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthLabel = useMemo(() => {
    const date = new Date(visibleYear, visibleMonth, 1);
    return date.toLocaleString('en-US', { month: 'long' });
  }, [visibleYear, visibleMonth]);

  const yearLabel = visibleYear;

  const days: DayCell[] = useMemo(() => {
    const firstDayOfMonth = new Date(visibleYear, visibleMonth, 1);
    const firstWeekday = firstDayOfMonth.getDay(); // 0:Sun ~ 6:Sat
    const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(visibleYear, visibleMonth, 0).getDate();

    const cells: DayCell[] = [];

    // 이전 달 날짜 채우기 (첫 주 앞부분)
    for (let i = firstWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(visibleYear, visibleMonth - 1, day);
      cells.push({
        date,
        inCurrentMonth: false,
        isToday: isSameDate(date, today),
      });
    }

    // 이번 달 날짜
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(visibleYear, visibleMonth, d);
      cells.push({
        date,
        inCurrentMonth: true,
        isToday: isSameDate(date, today),
      });
    }

    // 🔹 마지막 주만 채우도록, 필요한 만큼만 다음 달 날짜 추가
    const totalCells = cells.length; // = firstWeekday + daysInMonth
    const remainder = totalCells % 7;
    if (remainder !== 0) {
      const missing = 7 - remainder;
      const last = cells[cells.length - 1].date;

      for (let i = 1; i <= missing; i++) {
        const next = new Date(last);
        next.setDate(last.getDate() + i);
        cells.push({
          date: next,
          inCurrentMonth: false,
          isToday: isSameDate(next, today),
        });
      }
    }

    return cells;
  }, [visibleYear, visibleMonth, today]);

  const handlePrevMonth = () => {
    if (visibleMonth === 0) {
      setVisibleMonth(11);
      setVisibleYear((y) => y - 1);
    } else {
      setVisibleMonth((m) => m - 1);
    }
    setSelectedDate(null);   // ✅ 추가
  };
  
  const handleNextMonth = () => {
    if (visibleMonth === 11) {
      setVisibleMonth(0);
      setVisibleYear((y) => y + 1);
    } else {
      setVisibleMonth((m) => m + 1);
    }
    setSelectedDate(null);   // ✅ 추가
  };

  const handleSelect = (day: DayCell) => {
    setSelectedDate(day.date);
    onSelectDate?.(day.date);
  };

  function toKey(d: Date) {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  

  return (
    <View style={styles.container}>
      {/* 상단 월/연도 + 좌우 화살표 */}
      <View style={styles.headerRow}>
        <Text style={styles.monthText}>
          {monthLabel}
          <Text style={styles.yearText}>, {yearLabel}</Text>
        </Text>

        <View style={styles.monthNav}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <Image
            source={require('../../assets/icons/left-black.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Image
            source={require('../../assets/icons/right-black.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
      </View>

      {/* 요일 행 */}
      <View style={styles.weekdaysRow}>
        {WEEKDAYS.map((d) => (
          <Text key={d} style={styles.weekdayText}>
            {d}
          </Text>
        ))}
        
      </View>
      <View style={styles.divider} />
      

      {/* 날짜 그리드 */}
      <View style={styles.grid}>
        {days.map((day, idx) => {
            const dayNum = day.date.getDate();

            // 선택된 날짜(여기서는 MonthlyCalendar 내부에서 설정)
            const isSelected = selectedDate && isSameDate(day.date, selectedDate);

            // 오늘 날짜 하트 조건
            const showHeart =
            day.inCurrentMonth &&
            day.isToday &&
            day.date.getMonth() === visibleMonth &&
            day.date.getFullYear() === visibleYear;

            // 진료 있는 날짜 여부 (부모에서 내려주는 배열)
            const key = toKey(day.date);
            const hasRecord = markedDateKeys?.includes(key);

            return (
            <TouchableOpacity
                key={`${day.date.toISOString()}-${idx}`}
                style={styles.dayCell}
                onPress={() => handleSelect(day)}
                activeOpacity={0.8}
            >
                {/* 🔵 오늘 날짜 하트 */}
                {showHeart && (
                <Image
                    source={require('../../assets/icons/heart-blue.png')}
                    style={styles.heartImage}
                />
                )}

                {/* 숫자 */}
                <Text
                style={[
                    styles.dayText,
                    !day.inCurrentMonth && styles.outsideMonthText,   // 이전/다음달 연한 색
                    showHeart && styles.todayText,                   // 오늘: 하트 위 흰 글씨
                    isSelected && !showHeart && styles.selectedDayText, // 선택된 날짜 강조
                ]}
                >
                {dayNum}
                </Text>

                {/* 🔹 진료 있는 날 → 밑에 작은 파란 점 */}
                {!showHeart && hasRecord && (
                <View style={styles.dot} />
                )}
            </TouchableOpacity>
            );
        })}
        </View>

    </View>
  );
};

export default MonthlyCalendar;

// ---- 유틸 함수 ----
function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const CELL_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 18,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    paddingLeft:13,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  yearText: {
    fontSize: 24,
    fontWeight: '400',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArrow: {
    fontSize: 18,
    color: '#111827',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
    // paddingHorizontal: 2,  // ⛔ 이 줄 삭제
  },
  weekdayText: {
    width: '14.2857%',   // ✅ 100 / 7
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  divider: {
    width: '95%',
    height: 0.7,
    backgroundColor: '#BBBEC3',
    marginBottom: 5,
    alignSelf: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.2857%',   // ✅ 요일이랑 동일하게 7등분
    height: CELL_SIZE ,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  dayText: {
    fontSize: 15,
    color: '#111827',
    zIndex: 2,
  },
  outsideMonthText: {
    color: '#BBBEC3',
  },
  todayText: {
    fontWeight: '500',
    color: '#FFFFFF',
  },
  heartImage: {
    position: 'absolute',
    width: CELL_SIZE-3 ,
    height: CELL_SIZE-3,
    resizeMode: 'contain',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
    backgroundColor: '#2563EB',
  },
  navIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  selectedDayText: {
    fontWeight: '600',
  },

});
