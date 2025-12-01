// src/components/Calendar/AppointmentBottomSheet.tsx
import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
} from 'react-native';

export type Appointment = {
  id: string;
  clinicName: string;   // 병원 이름 (제일 내과 등)
  department: string;   // 진료과 (내과 등)
  time: string;         // "10:00 AM" 같은 문자열
  content: string;      // 진료 내용 텍스트
};

type Props = {
  visible: boolean;           // true면 보여주고 false면 아예 렌더X
  date: Date | null;          // 선택된 날짜
  appointments: Appointment[]; // 해당 날짜의 진료 내역 리스트
  onPressRecording?: (appointment: Appointment) => void; // 녹음 들으러가기 눌렀을 때
  onPressDetail?: (appointment: Appointment) => void;    // "자세히 보기" 눌렀을 때 (옵션)
};

// 위로 얼마나 올릴지 : 접힌 상태에서 위로 올릴 거리
const EXPAND_DISTANCE = 300; // 숫자는 화면 보면서 조절
const SHEET_TOP = 90;

const AppointmentBottomSheet: React.FC<Props> = ({
  visible,
  date,
  appointments,
  onPressRecording,
  onPressDetail,
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // ✅ 시트의 현재 오프셋값 (0 ~ EXPAND_DISTANCE)
  const translateY = useRef(new Animated.Value(EXPAND_DISTANCE)).current;
  const sheetOffset = useRef(EXPAND_DISTANCE); // 실제 숫자 저장

  // visible false면 다시 접기
  useEffect(() => {
    if (visible) {
      sheetOffset.current = EXPAND_DISTANCE;
      translateY.setValue(EXPAND_DISTANCE);
    }
  }, [visible, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 4,

      onPanResponderMove: (_, gesture) => {
        // 이전 위치 + 드래그 거리
        let next = sheetOffset.current + gesture.dy;
        // 0(완전 펼침) ~ EXPAND_DISTANCE(완전 접힘) 사이로 고정
        if (next < 0) next = 0;
        if (next > EXPAND_DISTANCE) next = EXPAND_DISTANCE;
        translateY.setValue(next);
      },

      onPanResponderRelease: (_, gesture) => {
        // 현재 위치 기준으로 위/아래 어디로 스냅할지 결정
        let target = sheetOffset.current;

        if (gesture.dy < -40) {
          // 위로 많이 끌면 전체 펼침
          target = 0;
        } else if (gesture.dy > 40) {
          // 아래로 많이 끌면 다시 접힘
          target = EXPAND_DISTANCE;
        } else {
          // 많이 안 움직였으면 중간 기준으로 스냅
          target = sheetOffset.current < EXPAND_DISTANCE / 2 ? 0 : EXPAND_DISTANCE;
        }

        sheetOffset.current = target;
        Animated.spring(translateY, {
          toValue: target,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;


  const formattedDate = useMemo(() => {
    if (!date) return '';
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = days[date.getDay()];
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}년 ${m}월 ${d}일 ${dayName}요일`;
  }, [date]);

  if (!visible || !date || appointments.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY }] },
        ]}
      >
        {/* 드래그 핸들 */}
        <View
          style={styles.dragHandleWrapper}
          {...panResponder.panHandlers}
        >
          <View style={styles.dragHandle} />
        </View>

        {/* 날짜 + 리스트 전체를 스크롤 가능한 영역 안에 배치 */}
        <View style={styles.inner}>
          <Text style={styles.dateText}>{formattedDate}</Text>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {appointments.map((ap) => {
              const isExpanded = expandedIds.includes(ap.id);
              return (
                <View key={ap.id} style={styles.card}>
                  {/* 병원 / 진료과 */}
                  <View style={styles.row}>
                    <Image
                      source={require('../../assets/icons/hospital-bold.png')}
                      style={styles.rowIcon}
                    />
                    <View>
                      <Text style={styles.clinicName}>{ap.clinicName}</Text>
                      <Text style={styles.department}>{ap.department}</Text>
                    </View>
                  </View>

                  {/* 시간 */}
                  <View style={[styles.row, { marginTop: 12 }]}>
                    <Image
                      source={require('../../assets/icons/clock-bold.png')}
                      style={styles.rowIcon}
                    />
                    <Text style={styles.timeText}>{ap.time}</Text>
                  </View>

                  {/* 진료 내용 박스 */}
                  <View style={styles.noteBox}>
                    <View style={styles.noteHeaderRow}>
                      <Text style={styles.noteTitle}>진료 내용</Text>

                      <TouchableOpacity
                        style={styles.noteRight}
                        activeOpacity={0.8}
                        onPress={() => onPressRecording?.(ap)}
                      >
                        <Image
                          source={require('../../assets/icons/recorded.png')}
                          style={styles.recordIcon}
                        />
                          <Text style={styles.noteLinkText}>녹음 들으러 가기</Text>
                      </TouchableOpacity>
                    </View>

                    <Text
                      style={styles.noteContent}
                      numberOfLines={isExpanded ? undefined : 2}
                      ellipsizeMode="tail"
                    >
                      {ap.content}
                    </Text>

                    <TouchableOpacity
                      style={styles.moreButton}
                      activeOpacity={0.8}
                      onPress={() => {
                        setExpandedIds(prev =>
                          prev.includes(ap.id)
                            ? prev.filter(id => id !== ap.id)
                            : [...prev, ap.id],
                        );
                        onPressDetail?.(ap);
                      }}
                    >
                      <Text style={styles.moreText}>
                        {isExpanded ? '접기' : '자세히 보기'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
};

export default AppointmentBottomSheet;

const styles = StyleSheet.create({
  // 화면 전체 덮는 래퍼
  wrapper: {
    ...StyleSheet.absoluteFillObject,
  },

  // ✅ 흰 페이지 자체 (항상 풀스크린, 위/아래로만 슬라이드)
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: SHEET_TOP,
    bottom: 0,              // 전체 높이
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 4,
    // 아래 패딩은 탭바 높이 생각해서 살짝
    paddingBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    elevation: 12,
  },

  dragHandleWrapper: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },

  // 안쪽 실제 컨텐츠 영역
  inner: {
    flex: 1,
    height: 500,
    paddingHorizontal: 20,
  },

  dateText: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  scroll: {
    flex: 1,
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 12,
  },
  clinicName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  department: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
  noteBox: {
    marginTop: 14,
    backgroundColor: '#EFF4FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  noteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  noteTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  noteRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginRight: 4,
  },
  noteLinkText: {
    fontSize: 12,
    color: '#6B7280',
  },
  noteContent: {
    marginTop: 4,
    fontSize: 13,
    color: '#111827',
    lineHeight: 18,
  },
  moreButton: {
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  moreText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
});
