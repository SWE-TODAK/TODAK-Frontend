// src/screens/Reservation.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Record_Window, {
  Doctor,
} from '../components/Home/Record/Record_Window';
import axios, { AxiosError } from 'axios';

// 네비게이션으로 넘어오는 파라미터 타입
type ReservationRouteParams = {
  categoryId?: number;
  categoryName?: string;
  categories?: string[];
  searchText?: string;
};

type ReservationRouteProp = RouteProp<
  { Reservation: ReservationRouteParams },
  'Reservation'
>;

// /hospitals 리스트 응답
type HospitalApi = {
  hospitalId: number;
  name: string;
  address: string;
  categories: string[];
  favorite: boolean;
};

// /hospitals/{id} 상세 응답
type HospitalDetailApi = {
  hospitalId: number;
  name: string;
  address: string;
  phone: string;
  introduction: string;
  categories: string[];
  favorite: boolean;
  doctors: {
    doctorId: number;
    name: string;
    specialty: string;
    mainDepartmentId: number;
  }[];
  availableHours: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
};

type Hospital = {
  id: string;
  name: string;
  categories: string[];
  address: string;
  openTime: string;
  closeTime: string;
  favorite: boolean;
};

const BACKEND_BASE_URL = 'https://todak-backend-705x.onrender.com';

const Reservation: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<ReservationRouteProp>();

  const passedCategories = route.params?.categories ?? [];
  const CATEGORIES =
    passedCategories.length > 0 ? passedCategories : ['소아청소년과'];

  const initialCategory =
    route.params?.categoryName && CATEGORIES.includes(route.params.categoryName)
      ? route.params.categoryName
      : CATEGORIES[0];

  const initialSearch = route.params?.searchText ?? '';

  const [searchText, setSearchText] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);

  // 모달 관련 상태
  const [recordVisible, setRecordVisible] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null); //
  const [selectedHospitalName, setSelectedHospitalName] = useState('');
  const [selectedOpenTime, setSelectedOpenTime] = useState('8:00');
  const [selectedCloseTime, setSelectedCloseTime] = useState('18:00');

  const [modalDoctors, setModalDoctors] = useState<Doctor[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // /hospitals 리스트 호출
const fetchHospitals = async () => {
  console.log('================ FETCH HOSPITALS START ================');
  console.log('searchText =', searchText);
  console.log('selectedCategory =', selectedCategory);

  const finalURL = 'https://todak-backend-705x.onrender.com/hospitals';
  const finalParams = {
    search: searchText || undefined,
    department: selectedCategory || undefined,
  };

  console.log('REQUEST URL:', finalURL);
  console.log('REQUEST PARAMS:', finalParams);

  try {
    setLoading(true);
    console.log('--- axios GET 실행 ---');

    const res = await axios.get<HospitalApi[]>(finalURL, {
      params: finalParams,
      timeout: 8000,
    });


    const mapped: Hospital[] = res.data.map((h) => ({
      id: String(h.hospitalId),
      name: h.name,
      address: h.address,
      categories: h.categories ?? [],
      favorite: h.favorite,
      openTime: '08:00',
      closeTime: '18:00',
    }));

   // console.log('mapped:', mapped);

    setHospitals(mapped);
  } catch (err) {
    console.log('!!!! 병원 목록 조회 실패 raw error:', err);

    // 🔍 AxiosError 라면 상태코드 / 응답 바디도 같이 찍기
    if (axios.isAxiosError(err)) {
      console.log('병원 목록 status:', err.response?.status);
      console.log('병원 목록 data:', err.response?.data);
    }

    setHospitals([]);
  } finally {
    console.log('================ FETCH HOSPITALS END ================\n');
    setLoading(false);
  }
};

  // 카테고리 / 검색어 변경 시 리스트 다시 호출
  useEffect(() => {
    fetchHospitals();
  }, [selectedCategory, searchText]);

   // 🔹 "09:00-18:00" 같은 문자열 → { open: "09:00", close: "18:00" }
// 🔹 "09:00-18:00" 같은 문자열 → { open: "09:00", close: "18:00" }
const parseHoursFromString = (raw?: string | null) => {
  console.log('🧪 [parseHoursFromString] raw =', raw);

  if (!raw || raw === 'closed') {
    return null;
  }

  const match = raw.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);

  console.log('🧪 정규식 match 결과 =', match);

  if (!match) {
    return null;
  }

  const open = match[1]; // 그대로 쓰기 (추가로 "0" 붙이지 않기!)
  const close = match[2];

  const result = { open, close };
  console.log('🧪 파싱 성공 →', result);

  return result;
};



const handleOpenReserve = async (item: Hospital) => {
  try {
    setSelectedHospitalId(item.id);       // ✅ 요것도 같이 세팅
    setSelectedHospitalName(item.name);
    setRecordVisible(true);
    setDetailLoading(true);
    setModalDoctors([]);

    console.log('📌 병원 상세 호출 id:', item.id);

    const url = `${BACKEND_BASE_URL}/hospitals/${item.id}`;
    console.log('📌 병원 상세 URL:', url);

    const res = await axios.get<HospitalDetailApi>(url);

    // 1) 영업시간 로그 찍기
    console.log('🧪 [병원 상세] full availableHours =', res.data.availableHours);

    const monRaw = res.data.availableHours?.mon;
    console.log('🧪 [병원 상세] monRaw =', monRaw, 'typeof =', typeof monRaw);

    // 2) 문자열 → open/close 파싱
    const parsed = parseHoursFromString(monRaw);

    if (parsed) {
      setSelectedOpenTime(parsed.open);
      setSelectedCloseTime(parsed.close);
    } else {
      console.log('🧪 파싱 실패, 기본값 사용 (08:00~18:00)');
      setSelectedOpenTime('08:00');
      setSelectedCloseTime('18:00');
    }

    // 3) 의사 리스트 매핑
    const doctors: Doctor[] =
      res.data.doctors?.map(d => ({
        id: String(d.doctorId),
        name: d.name,
        title: d.specialty || '의사',
      })) ?? [];

    setModalDoctors(doctors);
  } catch (err) {
    console.log('병원 상세 조회 실패 raw error:', err);

    if (axios.isAxiosError(err)) {
      console.log('병원 상세 status:', err.response?.status);
      console.log('병원 상세 data:', err.response?.data);
    }

    Alert.alert('오류', '병원 상세 정보를 불러오지 못했습니다.');
    setRecordVisible(false);
  } finally {
    setDetailLoading(false);
  }
};


  

 
  

  const renderHospital = ({ item }: { item: Hospital }) => (
    <TouchableOpacity
      style={styles.hospitalCard}
      activeOpacity={0.9}
      onPress={() => {
        console.log('병원 선택:', item.name);
      }}
    >
      <View style={styles.hospitalThumbnail} />

      <View style={styles.hospitalInfo}>
        <Text style={styles.hospitalName}>{item.name}</Text>
        <Text style={styles.hospitalText}>
          진료 시간 : {item.openTime} ~ {item.closeTime}
        </Text>
        <Text style={styles.hospitalText}>위치 : {item.address}</Text>
      </View>

      <TouchableOpacity
        style={styles.reserveButton}
        onPress={() => handleOpenReserve(item)}
      >
        <Text style={styles.reserveButtonText}>예약하기</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerContent}
      >
        {/* 상단 네비 + 검색바 영역 */}
        <View style={styles.header}>
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

          <View style={styles.searchContainer}>
            <TouchableOpacity
              onPress={fetchHospitals}
              activeOpacity={0.7}
            >
              <Image
                source={require('../assets/icons/search.png')}
                style={styles.searchIcon}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.searchInput}
              placeholder="병원 이름을 검색해주세요"
              placeholderTextColor="rgba(0,0,0,0.5)"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              onSubmitEditing={fetchHospitals}   // ← 엔터로 검색도 유지
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
          {loading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="small" />
            </View>
          ) : (
            <FlatList
              data={hospitals}
              keyExtractor={(item) => item.id}
              renderItem={renderHospital}
              ItemSeparatorComponent={() => (
                <View style={styles.cardSeparator} />
              )}
              contentContainerStyle={styles.listContent}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: '#6B7280' }}>
                    조건에 맞는 병원이 없습니다.
                  </Text>
                </View>
              }
            />
          )}
        </View>

        {/* 병원 예약 모달 */}
        <Record_Window
          visible={recordVisible}
          hospitalId={selectedHospitalId ?? ''} 
          hospitalName={selectedHospitalName}
          openTime={selectedOpenTime}
          closeTime={selectedCloseTime}
          doctors={modalDoctors}
          loading={detailLoading}
          onClose={() => {
            setRecordVisible(false);
            setModalDoctors([]);
            setSelectedHospitalId(null);          // ✅ 같이 초기화
          }}
          onAppointmentCreated={data => {
            console.log('🎉 예약 생성 완료 data:', data);
            // 필요하면 여기서 오늘 예약 다시 불러오기 등 추가 가능
          }}
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
    alignItems: 'flex-start',
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
    alignSelf: 'flex-start',
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
    alignSelf: 'flex-end',
    marginTop: 8,
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
