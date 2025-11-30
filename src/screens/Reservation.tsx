// src/screens/Reservation.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Record_Window from '../components//Home/Record/Record_Window';

type Hospital = {
  id: string;
  name: string;
  categories: string[]; // 진료과
  address: string;
  openTime: string;
  closeTime: string;
};

const CATEGORIES = ['소아과', '내과', '치과', '정형외과', '안과', '산부인과'];

const DUMMY_HOSPITALS: Hospital[] = [
  {
    id: '1',
    name: '한승룡 소아 청소년과 의원',
    categories: ['소아과'],
    address: '서울 중구 서애로1길',
    openTime: '8:00',
    closeTime: '19:00',
  },
  {
    id: '2',
    name: '한빛 소아과',
    categories: ['소아과'],
    address: '서울 동대문구 고산자로',
    openTime: '8:00',
    closeTime: '18:00',
  },
];

const Reservation: React.FC = () => {
  const navigation = useNavigation<any>();

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('소아과');
  const [recordVisible, setRecordVisible] = useState(false);
  const [selectedHospitalName, setSelectedHospitalName] = useState('');
  const [selectedOpenTime, setSelectedOpenTime] = useState('8:00');   // 초기값은 아무거나
  const [selectedCloseTime, setSelectedCloseTime] = useState('18:00'); // 클릭할 때 실제 값으로 교체됨


  // 카테고리 + 검색어로 필터 (지금은 더미 데이터)
  const filteredHospitals = useMemo(() => {
    return DUMMY_HOSPITALS.filter((h) => {
      const inCategory = h.categories.includes(selectedCategory);
      const inSearch =
        searchText.trim().length === 0 ||
        h.name.toLowerCase().includes(searchText.toLowerCase());
      return inCategory && inSearch;
    });
  }, [selectedCategory, searchText]);

  const renderHospital = ({ item }: { item: Hospital }) => (
    <TouchableOpacity
      style={styles.hospitalCard}
      activeOpacity={0.9}
      onPress={() => {
        console.log('병원 선택:', item.name);
      }}
    >
      {/* 썸네일 자리 (지금은 회색 박스만) */}
      <View style={styles.hospitalThumbnail} />

      {/* 정보 영역 */}
      <View style={styles.hospitalInfo}>
        <Text style={styles.hospitalName}>{item.name}</Text>
        <Text style={styles.hospitalText}>
          진료 시간 : {item.openTime} ~ {item.closeTime}
        </Text>
        <Text style={styles.hospitalText}>위치 : {item.address}</Text>
      </View>

      {/* 예약하기 버튼 */}
      <TouchableOpacity
        style={styles.reserveButton}
        onPress={() => {
          // ✅ 여기서 선택된 병원 정보와 영업시간을 상태에 저장
          setSelectedHospitalName(item.name);
          setSelectedOpenTime(item.openTime);
          setSelectedCloseTime(item.closeTime);
          setRecordVisible(true);
        }}
      >
        <Text style={styles.reserveButtonText}>예약하기</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      {/* 화면 전체를 한 번만 세로 스크롤 */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerContent}
      >
        {/* 상단 네비 + 검색바 영역 */}
        <View style={styles.header}>
          {/* 뒤로가기 */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Image
              source={require('../assets/icons/back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          {/* 검색 바 */}
          <View style={styles.searchContainer}>
            <Image
              source={require('../assets/icons/search.png')}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="병원 이름을 검색해주세요"
              placeholderTextColor="rgba(0,0,0,0.5)"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* 카테고리 섹션 */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContent}
          >
            {CATEGORIES.map((cat) => {
              const selected = cat === selectedCategory;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    selected && styles.categoryChipSelected,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selected && styles.categoryTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 병원 리스트 */}
        <View style={styles.listWrapper}>
          <FlatList
            data={filteredHospitals}
            keyExtractor={(item) => item.id}
            renderItem={renderHospital}
            ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false} // 스크롤은 바깥 ScrollView만 사용
          />
        </View>
        {/* ✅ 병원 예약 모달 */}
        <Record_Window
          visible={recordVisible}
          hospitalName={selectedHospitalName}
          openTime={selectedOpenTime}
          closeTime={selectedCloseTime}
          onClose={() => setRecordVisible(false)}
        />
      </ScrollView>
    </View>
  );
};

export default Reservation;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EFF3FF',
  },
  container: {
    flex: 1,
  },
  containerContent: {
    paddingBottom: 24,
    backgroundColor: '#EFF3FF',
  },

  // 상단 헤더 영역 (뒤로가기 + 검색창 한 줄)
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: '#EFF3FF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#111827',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 44,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  // 카테고리 섹션
  categorySection: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  categoryContent: {
    paddingVertical: 4,
  },
  categoryChip: {
    height: 30,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#D7E3FF',
    marginRight: 8,
    justifyContent: 'center',
  },
  categoryChipSelected: {
    backgroundColor: '#4F8DFD',
  },
  categoryText: {
    fontSize: 13,
    color: '#1F2933',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // 병원 리스트
  listWrapper: {
    paddingHorizontal: 16,
    marginTop: 15,
    backgroundColor: '#EFF3FF',
  },
  listContent: {
    paddingBottom: 16,
  },
  hospitalCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',   // ✅ 위쪽을 기준으로 정렬
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  
  hospitalThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
    alignSelf: 'flex-start',    // (옵션) 썸네일도 위쪽 정렬
  },
  
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  
  hospitalText: {
    fontSize: 12,
    color: '#4B5563',
  },
  reserveButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#4F8DFD',
    marginLeft: 8,
    alignSelf: 'flex-end',      // ✅ 카드의 “아래쪽”으로 붙음
    marginTop: 8,               // (옵션) 살짝 내려주는 느낌
  },
  reserveButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cardSeparator: {
    height: 10,
  },
});
