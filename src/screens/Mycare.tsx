// src/screens/Mycare.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MycareRecordSection from '../components/Mycare/MycareRecordSection';

type MycareRecord = {
  id: string;
  dateLabel: string; // "2025.05.27.금"
  clinicName: string;
  timeLabel: string; // "10:00 AM"
  deptName: string;
  doctorName: string;
  diseaseName: string;
  summary: string;
};

const FILTERS = ['전체', '병원명', '진료과', '의사명', '병명'] as const;
type FilterKey = (typeof FILTERS)[number];

const PERIODS = ['최근 1개월', '최근 3개월', '최근 6개월', '최근 1년', '전체'] as const;
type PeriodKey = (typeof PERIODS)[number];

const Mycare: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [filterKey, setFilterKey] = useState<FilterKey>('전체');
  const [filterOpen, setFilterOpen] = useState(false);

  const [periodKey, setPeriodKey] = useState<PeriodKey>('최근 1개월');
  const [periodOpen, setPeriodOpen] = useState(false);

  // ✅ 더미 데이터
  const records: MycareRecord[] = [
    {
      id: '1',
      dateLabel: '2025.05.27.금',
      clinicName: '밝은 눈 안과',
      timeLabel: '10:00 AM',
      deptName: '안과',
      doctorName: '최홍서',
      diseaseName: '',
      summary:
        '시력검사 결과 큰 변화는 없으며, 현재 상태는 안정적인 편입니다. 다만 예방 차원에서 정기적인 검진만 권장됩니다.',
    },
    {
      id: '2',
      dateLabel: '2025.04.23.수',
      clinicName: '참 좋은병원',
      timeLabel: '2:00 PM',
      deptName: '내과',
      doctorName: '',
      diseaseName: '',
      summary:
        '현재까지 검사상 유의미한 변화는 관찰되지 않으며, 전반적인 상태는 안정적입니다. 향후 상태 유지를 위해 정기적인 내과적 검진을 권장드립니다.',
    },
  ];

  // 검색/필터 적용
  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return records;

    return records.filter((r) => {
      const hay = {
        전체: `${r.clinicName} ${r.deptName} ${r.doctorName} ${r.diseaseName}`,
        병원명: r.clinicName,
        진료과: r.deptName,
        의사명: r.doctorName,
        병명: r.diseaseName,
      }[filterKey];

      return hay.includes(q);
    });
  }, [records, search, filterKey]);

  // 날짜별 그룹
  const sections = useMemo(() => {
    const map = new Map<string, MycareRecord[]>();
    filtered.forEach((r) => {
      if (!map.has(r.dateLabel)) map.set(r.dateLabel, []);
      map.get(r.dateLabel)!.push(r);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const onSelectFilter = (k: FilterKey) => {
    setFilterKey(k);
    setFilterOpen(false); // ✅ 선택하면 다시 접기
  };

  const onSelectPeriod = (p: PeriodKey) => {
      setPeriodKey(p);
      setPeriodOpen(false);
      // TODO: 여기서 기간에 맞춰 records API 호출/필터링 붙이면 됨
    };

  return (
    <View style={styles.root}>
      {/* Safe area top */}
      <View style={{ height: insets.top, backgroundColor: '#FFFFFF' }} />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // navigation.goBack()
          }}
          activeOpacity={0.8}
          style={styles.backCircle}
        >
          <Image
            source={require('../assets/icons/back.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.title}>내 진료</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* ✅ 상단 흰 패널 (검색/기간/필터 영역) */}
      <View style={styles.topPanel}>
        {/* 검색 + 기간 */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="병원명을 검색해보세요"
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />
            <Image
              source={require('../assets/icons/search.png')}
              style={styles.searchIconImg}
              resizeMode="contain"
            />
          </View>

          {/* ✅ period dropdown anchor */}
          <View style={styles.periodWrap}>
            <Pressable
              style={[
                styles.periodBtn,
                periodKey !== '최근 1개월' && styles.periodBtnActive,
              ]}
              onPress={() => setPeriodOpen((prev) => !prev)}
            >
              <Text
                style={[
                  styles.periodText,
                  periodKey !== '최근 1개월' && styles.periodTextActive,
                ]}
              >
                {periodKey}
              </Text>
              <Image
                source={require('../assets/icons/chevron-down.png')}
                style={[
                  styles.periodArrowIcon,
                  periodKey !== '최근 1개월' && styles.periodArrowIconActive,
                ]}
                resizeMode="contain"
              />
            </Pressable>

            {/* ✅ 기간 드롭다운 */}
            {periodOpen && (
              <View style={styles.periodDropdown}>
                {PERIODS.map((p, idx) => {
                  const active = p === periodKey;
                  return (
                    <Pressable
                      key={p}
                      style={[styles.periodItem, idx !== 0 && styles.periodItemBorder]}
                      onPress={() => onSelectPeriod(p)}
                    >
                      <Text style={[styles.periodItemText, active && styles.periodItemTextActive]}>
                        {p}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* 필터: 접힘/펼침 */}
        {/* 필터 영역: 왼쪽 "전체 + 화살표" + 오른쪽으로 칩 가로 펼침 */}
        <View style={styles.filterAreaRow}>
          <Pressable
            style={styles.foldedChip}
            onPress={() => setFilterOpen((prev) => !prev)}
          >
            <Text style={styles.foldedChipText}>{filterKey}</Text>
            <Image
              source={
                filterOpen
                  ? require('../assets/icons/left-black.png')   // 펼쳐짐
                  : require('../assets/icons/right-black.png')  // 접힘
              }
              style={[styles.foldedChipArrow, { tintColor: styles.foldedChipTextColor }]}
              resizeMode="contain"
            />
          </Pressable>

          {filterOpen && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRowInline}
            >
              {FILTERS.filter((k) => k !== filterKey).map((k) => {
                const active = filterKey === k; // 여기선 항상 false지만 스타일 통일용
                return (
                  <Pressable
                    key={k}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => onSelectFilter(k)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {k}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>

      {/* 리스트 */}
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        {sections.map(([dateLabel, items]) => (
          <View key={dateLabel} style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionDate}>{dateLabel}</Text>

              <Pressable
                style={styles.sectionDetailBtn}
                onPress={() => {
                  // TODO: 해당 날짜 묶음 상세보기
                }}
              >
                <Text style={styles.sectionDetail}>상세보기</Text>
                <Image
                  source={require('../assets/icons/right-black.png')}
                  style={styles.sectionDetailIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            {items.map((r) => (
              <MycareRecordSection
                key={r.id}
                clinicName={r.clinicName}
                timeLabel={r.timeLabel}
                deptName={r.deptName}
                doctorName={r.doctorName}
                diseaseName={r.diseaseName}
                summary={r.summary}
                onPressDetail={() => {
                  console.log('상세:', r.id);
                }}
              />
            ))}
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Mycare;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'rgba(236, 242, 252, 0.8)' },

  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.8,
    borderBottomColor: '#AEAEAE',
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backImage: { width: 20, height: 20 },
  title: { color: '#333333', fontSize: 18, fontWeight: '600' },

  // ✅ 상단 흰 패널
  topPanel: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 10,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBox: {
    flex: 1,
    height: 38,
    backgroundColor: '#BBBEC366',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#000000' },
  searchIconImg: { width: 18, height: 18, marginLeft: 6 },

  periodWrap: {
    marginLeft: 10,
    position: 'relative',
    zIndex: 100, // dropdown이 위로
  },

  periodBtn: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#BBBEC366',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  periodBtnActive: {
    backgroundColor: '#3B82F6E6', // 선택되면 파랑
  },
  periodText: { color: '#000000', fontSize: 14, fontWeight: '500' },
  periodTextActive: {
    color: '#FFFFFFE6',
  },
  periodArrowIcon: {
    width: 14,
    height: 14,
    marginLeft: 6,
    tintColor: '#000000', // ✅ 검정 png를 이 색으로 맞춤
  },
  periodArrowIconActive: {
    tintColor: '#FFFFFFE6',
  },
  // ✅ 기간 드롭다운 (periodBtn 아래)
  periodDropdown: {
    position: 'absolute',
    top: 42, // 버튼 아래
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.8,
    borderColor: '#AEAEAE',
    borderRadius: 10,
    overflow: 'hidden',
    minWidth: 140,
    zIndex: 120,
    elevation: 10, // Android
  },
  periodItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  periodItemBorder: {
    borderTopWidth: 0.8,
    borderTopColor: '#BBBEC366',
  },
  periodItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  periodItemTextActive: {
    color: '#3B82F6E6',
    fontWeight: '600',
  },

  foldedChipTextColor: '#000000', // tintColor용

  // ✅ 가로로 한 줄
  filterAreaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  foldedChip: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#BBBEC366',
    flexDirection: 'row',
    alignItems: 'center',
  },

  foldedChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },

  foldedChipArrow: {
    width: 12,
    height: 12,
    marginLeft: 6,
  },

  // ✅ 오른쪽으로 펼쳐지는 칩 컨테이너
  chipRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8, // foldedChip과 간격
  },

  chip: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#BBBEC366',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8, // 칩 간격
  },

  chipActive: { backgroundColor: '#3B82F6E6' },
  chipText: { fontSize: 14, fontWeight: '500', color: '#000000' },
  chipTextActive: { color: '#FFFFFFE6' },

  sectionBlock: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingBottom: 12,
    marginTop: 10,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sectionDate: { fontSize: 16, fontWeight: '500', color: '#000000' },

  sectionDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionDetail: { fontSize: 14, fontWeight: '500', color: '#000000' },
  sectionDetailIcon: { width: 16, height: 16, marginLeft: 2 },

  emptyBox: { marginTop: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#9CA3AF' },
});