// src/components/Hospital_List.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import api from '../../api/axios'
import { useNavigation } from '@react-navigation/native';

type Hospital = {
  hospitalId: string;
  name: string;
  address: string;
  categories: string[];
  isFavorite: boolean;
};

type Dept = {
  id: number;
  name: string;
};

const DEPARTMENTS: Dept[] = [
  { id: 1, name: '내과' },
  { id: 2, name: '외과' },
  { id: 3, name: '정형외과' },
  { id: 4, name: '신경과' },
  { id: 5, name: '신경외과' },
  { id: 6, name: '피부과' },
  { id: 7, name: '이비인후과' },
  { id: 8, name: '안과' },
  { id: 9, name: '비뇨의학과' },
  { id: 10, name: '산부인과' },
  { id: 11, name: '소아청소년과' },   // UI에서만 '소아과'로 줄이고 싶으면 추후에 따로 처리 가능
  { id: 12, name: '가정의학과' },
  { id: 13, name: '정신건강의학과' },
  { id: 14, name: '재활의학과' },
  { id: 15, name: '흉부외과' },
  { id: 16, name: '치과' },
  { id: 17, name: '마취통증의학과' },
  { id: 18, name: '기타' },
];

// 진료과 ID별 아이콘 맵
const DEPT_ICONS: Record<number, any> = {
  1: require('../../assets/icons/department/내과.png'),       // 내과
  2: require('../../assets/icons/department/외과.png'),        // 외과
  3: require('../../assets/icons/department/정형외과.png'),          // 정형외과
  4: require('../../assets/icons/department/신경과.png'),          // 신경과
  5: require('../../assets/icons/department/신경외과.png'),   // 신경외과
  6: require('../../assets/icons/department/피부과.png'),          // 피부과
  7: require('../../assets/icons/department/이비인후과.png'),            // 이비인후과
  8: require('../../assets/icons/department/안과.png'),            // 안과
  9: require('../../assets/icons/department/비뇨의학과.png'),        // 비뇨의학과
  10: require('../../assets/icons/department/산부인과.png'),         // 산부인과
  11: require('../../assets/icons/department/소아과.png'),    // 소아청소년과
  12: require('../../assets/icons/department/가정의학과.png'),        // 가정의학과
  13: require('../../assets/icons/department/정신건강의학과.png'),        // 정신건강의학과
  14: require('../../assets/icons/department/재활의학과.png'),         // 재활의학과
  15: require('../../assets/icons/department/흉부외과.png'),      // 흉부외과
  16: require('../../assets/icons/department/치과.png'),        // 치과
  17: require('../../assets/icons/department/마취통증의학과.png'),    // 마취통증의학과
  18: require('../../assets/icons/department/기타.png'),           // 기타
};


const Hospital_List: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation<any>();

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // 접혀 있을 때는 앞부분만 보여주고, 펼치면 전체 + 스크롤
  const visibleData = expanded ? DEPARTMENTS : DEPARTMENTS.slice(0, 8);


  const fetchHospitals = async () => {
    try {
      const res = await api.get('/hospitals', {
        params: {
          search: searchText || undefined,
          category: selectedCategory || undefined,
          page,
          size: PAGE_SIZE,
        },
      });

      console.log("병원목록",res.data)
  
      // 응답 예시 기준: res.data.data.hospitals
      setHospitals(res.data.data.hospitals);
    } catch (e) {
      console.log('병원 목록 조회 실패', e);
    }
  };
  

  return (
    <View style={styles.sectionContainer}>
      {/* 섹션 타이틀 */}
      <Text style={styles.sectionTitle}>병원 예약</Text>
      <View style={styles.divider} />

      {/* 검색 바 */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Reservation', {
              searchText,
              categories: DEPARTMENTS.map((d) => d.name),
            });
          }}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../assets/icons/search.png')}
            style={styles.searchIcon}
          />
        </TouchableOpacity>

        <TextInput
          style={{ flex: 1, fontSize: 14 }}
          placeholder="병원 이름을 검색해주세요"
          placeholderTextColor="rgba(0,0,0,0.5)"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          onSubmitEditing={() => {
            navigation.navigate('Reservation', {
              searchText,
              categories: DEPARTMENTS.map((d) => d.name),
            });
          }}
        />
      </View>



      {/* 진료과 그리드 영역 (이 안만 스크롤) */}
      <View style={styles.gridWrapper}>
        <FlatList
          data={visibleData}
          keyExtractor={(item) => String(item.id)}
          numColumns={4}
          scrollEnabled={expanded}          // 전체보기일 때만 스크롤
          nestedScrollEnabled               // 바깥 ScrollView 안에서도 이 부분만 스크롤
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.deptItem}
              onPress={() => {
                navigation.navigate('Reservation', {
                  categoryId: item.id,
                  categoryName: item.name,
                  categories: DEPARTMENTS.map((d) => d.name), 
                });
              }}
              activeOpacity={0.8}
            >
              <View style={styles.deptIconBox}>
                {DEPT_ICONS[item.id] && (
                  <Image
                    source={DEPT_ICONS[item.id]}
                    style={styles.deptIconImage}
                    resizeMode="contain"
                  />
                )}
              </View>
              <Text style={styles.deptLabel}>{item.name}</Text>
            </TouchableOpacity>
          )}
          // 펼쳐진 상태에서 리스트 맨 아래에 나오는 "진료과 접기"
          ListFooterComponent={
            expanded ? (
              <TouchableOpacity
                style={styles.collapseButton}
                onPress={() => setExpanded(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.moreText}>진료과 접기</Text>
                <Image
                  source={require('../../assets/icons/chevron-down.png')}
                  style={{
                    width: 20,
                    height: 20,
                    transform: [{ rotate: '180deg' }],
                  }}
                />
              </TouchableOpacity>
            ) : null
          }
        />
      </View>

      {/* 접혀 있을 때만 보이는 "진료과 전체보기" (조금 더 위로 붙음) */}
      {!expanded && (
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setExpanded(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.moreText}>진료과 전체보기</Text>
          <Image
            source={require('../../assets/icons/chevron-down.png')}
            style={styles.moreIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Hospital_List;

const styles = StyleSheet.create({
  sectionContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 15,
    paddingBottom: 8,
    marginTop: 20,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },

  // 검색바
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 46,
    width: '88%',
    borderWidth: 1,
    borderColor: 'rgba(112,164,248,0.8)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  searchIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.5)',
  },

  // 진료과 그리드 감싸는 박스
  gridWrapper: {
    width: '100%',
    alignItems: 'center',
    maxHeight: 240,       // 최대 높이만 제한 (기기마다 자연스럽게)
  },
  gridContent: {
    paddingHorizontal: 24,
    paddingBottom: 6,
  },
  deptItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
  },
  deptIconBox: {
    width: 53,
    height: 53,
    borderRadius: 12,
    backgroundColor: '#EEF3FF',
    marginBottom: 10,
    justifyContent: 'center',   // 🔹 아이콘 가운데 정렬
    alignItems: 'center',
  },
  deptLabel: {
    fontSize: 12,
    color: '#4B5563',
  },
  deptIconImage: {
    width: 30,
    height: 30,
  },

  // 접혀 있을 때 아래쪽 "전체보기"
  moreButton: {       
    flexDirection: 'row',  // 텍스트 + 아이콘 가로
    alignItems: 'center',
  },
  moreText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.7)',
  },
  moreIcon: {
    width: 20,
    height: 20,
    marginLeft: 4,
    resizeMode: 'contain',
  },

  // 펼쳐졌을 때 리스트 안쪽 맨 아래 "접기"
  collapseButton: {
    marginTop: 0,
    marginBottom:15 ,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // 텍스트 + 아이콘 가로
  },

  

});
