// src/screens/Mycare.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeptCategoryTabs, { DeptItem } from '../components/Mycare/DeptCategoryTabs';
import MycareRecordSection from '../components/Mycare/MycareRecordSection';
import axios from '../api/axios';

type MycareRecord = {
  id: string;
  deptId: string;       // 'internal' | 'eye' | 'ent' ...
  dateLabel: string;    // '2025.10.26'
  clinicName: string;
  doctorName: string;
  summary: string;
  prescription: string;
};

// 🔹 /consultations/my 응답 타입 (캘린더에서 쓰던 것과 동일)
type ConsultationDto = {
  consultationId: number;
  hospitalName: string;
  doctorName: string;
  consultationTime: string; // "2025-12-02T18:58:29.573Z"
  summaryPreview: string;
  // 나중에 departmentName, prescriptionSummary 같은 게 생기면 여기 추가해서 사용
};

const Health: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [records, setRecords] = useState<MycareRecord[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('eye');

  // 🔹 전체 진료 기록 (API에서 받아온 뒤, MycareRecord로 변환해서 저장)

  function extractPatientSummary(raw: string | null | undefined): string {
    if (!raw) return '';
  
    try {
      const parsed = JSON.parse(raw);
      const summary = parsed?.patient_summary;
      if (typeof summary === 'string') {
        return summary;
      }
      // 예상했던 필드가 없으면 일단 원문 그대로 사용
      return raw;
    } catch (e) {
      // JSON 파싱 실패하면 안전하게 원문 그대로
      return raw;
    }
  }
  

  const dynamicDeptItems: DeptItem[] = useMemo(() => {
    const uniqueDeptIds = Array.from(new Set(records.map(r => r.deptId)));
  
    const labelMap: Record<string, string> = {
      internal: '내과',
      eye: '안과',
      ent: '이비인후과',
    };
  
    return uniqueDeptIds.map(id => ({
      id,
      label: labelMap[id] || id,
    }));
  }, [records]);

  // 🔹 첫 진입 시 /consultations/my 호출
  useEffect(() => {
    const fetchMyConsultations = async () => {
      try {
        const res = await axios.get<ConsultationDto[]>('/consultations/my');
        console.log('✅ /consultations/my (mycare):', res.data);

        const mapped: MycareRecord[] = (res.data || []).map((c) => ({
          id: String(c.consultationId),
          deptId: getDeptIdFromConsultation(c),
          dateLabel: formatDateLabel(c.consultationTime),
          clinicName: c.hospitalName,
          doctorName: c.doctorName,
          summary: extractPatientSummary(c.summaryPreview),
          // prescription 은 아직 API에 없다고 가정 → 나중에 상세 API 나오면 교체
          prescription: '',
        }));

        setRecords(mapped);
      } catch (e) {
        console.log('📛 내 진료 목록 조회 실패 (mycare):', e);
        setRecords([]);
      }
    };

    fetchMyConsultations();
  }, []);

  // 🔹 선택된 진료과만 필터링
  const filteredRecords = records.filter(
    (r) => r.deptId === selectedDeptId,
  );

  return (
    <View style={styles.root}>
      <View style={{ height: insets.top, backgroundColor: '#FFFFFF' }} />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Image
            source={require('../assets/icons/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>내 진료</Text>

        <View style={{ width: 32 }} />
      </View>

      {/* 내용 */}
      <View style={styles.content}>
        {/* 카테고리 탭 */}
        <DeptCategoryTabs
          items={dynamicDeptItems}
          selectedId={selectedDeptId}
          onSelect={setSelectedDeptId}
        />

        {/* 진료 내역 리스트 */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredRecords.map((record) => (
            <MycareRecordSection
              key={record.id}
              dateLabel={record.dateLabel}
              clinicName={record.clinicName}
              doctorName={record.doctorName}
              summary={record.summary}
              prescription={record.prescription}
              onPressDetail={() => {
                // TODO: 상세 페이지 네비게이션 연결 (consultationId = record.id)
                console.log('상세 보기:', record.id);
              }}
            />
          ))}

          {filteredRecords.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                선택한 진료과의 진료 내역이 없습니다.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Health;

/* ---------- 유틸 / 매핑 함수들 ---------- */

// 🔹 ISO → "YYYY.MM.DD"
function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}.${m}.${day}`;
}

// 🔹 백엔드 데이터 → 내과/안과/이비인후과 카테고리 매핑
//    👉 지금은 임시 규칙이라, 나중에 departmentName 내려주면 여기만 고치면 됨.
function getDeptIdFromConsultation(c: ConsultationDto): string {
  const name = `${c.hospitalName} ${c.doctorName}`; // 임시로 두 문자열 합쳐서 검사

  // 예시: 병원 이름이나 의사 이름에 특정 키워드가 포함되어 있을 때
  if (name.includes('안과')) return 'eye';
  if (name.includes('이비인후과')) return 'ent';
  if (name.includes('내과')) return 'internal';

  // 기본값 (백엔드에서 필드 추가되면 이 부분 삭제/수정)
  return 'internal';
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(236, 242, 252, 0.8)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.8,
    borderBottomColor: '#AEAEAE',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyBox: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
