// src/screens/MycareDetail.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MycareStackParamList } from '../navigation/MycareStackNavigator';
import MycareDetailTopCard from '../components/Mycare/MycareDetailTopCard';
import MycareDetailBlock from '../components/Mycare/MycareDetailBlock';

type Props = NativeStackScreenProps<MycareStackParamList, 'MycareDetail'>;

export default function MycareDetail({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { recordId, records } = route.params;

  // ✅ "최근 진료가 오른쪽"이 되려면 내림차순(최신 먼저) 정렬이 자연스러움
  // 지금은 dateLabel이 "2025.04.23.수" 형태라 앞 10자리만 비교하면 됨
  const sortedRecords = useMemo(() => {
    const toKey = (dl: string) => dl.slice(0, 10).replace(/\./g, ''); // "20250423"
    return [...records].sort((a, b) => toKey(b.dateLabel).localeCompare(toKey(a.dateLabel)));
  }, [records]);

  const currentIndex = useMemo(
    () => sortedRecords.findIndex((r) => r.id === recordId),
    [sortedRecords, recordId]
  );

  const record = sortedRecords[currentIndex]; // ✅ 이제 record를 여기서 확정
  const hasPrev = currentIndex < sortedRecords.length - 1; // 더 과거(왼쪽)
  const hasNext = currentIndex > 0; // 더 최근(오른쪽)

  const goPrev = () => {
    if (!hasPrev) return;
    const prev = sortedRecords[currentIndex + 1];
    navigation.replace('MycareDetail', { recordId: prev.id, records: sortedRecords });
  };

  const goNext = () => {
    if (!hasNext) return;
    const next = sortedRecords[currentIndex - 1];
    navigation.replace('MycareDetail', { recordId: next.id, records: sortedRecords });
  };

  const [memo, setMemo] = useState(record.memo ?? '');
  const [editingMemo, setEditingMemo] = useState(false);

  const fullText = record.fullText ?? record.summary;

  return (
    <View style={styles.root}>
      <View style={{ height: insets.top, backgroundColor: '#FFFFFF' }} />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backCircle}>
          <Image source={require('../assets/icons/back.png')} style={styles.backImage} resizeMode="contain" />
        </TouchableOpacity>

        <Text style={styles.title}>진료 상세보기</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* ❌ 기존 바깥 ScrollView 제거 */}

      <View style={styles.fixedWrap}>
        {/* ✅ 고정: metaRow */}
        <View style={styles.metaRow}>
          <View style={styles.dateNavRow}>
            <Pressable
              onPress={goPrev}
              disabled={!hasPrev}
              style={styles.metaArrowBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Image
                source={require('../assets/icons/left-black.png')}
                style={[
                  styles.metaArrowIcon,
                  { tintColor: hasPrev ? '#000000' : '#989CA5' },
                ]}
                resizeMode="contain"
              />
            </Pressable>

            <Text style={styles.dateText}>{record.dateLabel}</Text>

            <Pressable
              onPress={goNext}
              disabled={!hasNext}
              style={styles.metaArrowBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Image
                source={require('../assets/icons/right-black.png')}
                style={[
                  styles.metaArrowIcon,
                  { tintColor: hasNext ? '#000000' : '#989CA5' },
                ]}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              // TODO: 삭제 로직
            }}
            style={styles.trashInlineBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={require('../assets/icons/trash.png')}
              style={styles.trashInlineIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* ✅ 고정: TopCard */}
        <MycareDetailTopCard
          clinicName={record.clinicName}
          timeLabel={record.timeLabel}
          deptName={record.deptName}
          doctorName={record.doctorName}
          diseaseName={record.diseaseName}
        />

        {/* ✅ 고정: 하얀 카드 틀 / ✅ 스크롤: 카드 내부만 */}
        <View style={styles.detailCard}>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 26, paddingHorizontal: 16, paddingTop: 6 }}
          >
            {/* 진료 요약 */}
            <MycareDetailBlock title="진료 요약">
              <View style={styles.grayBox}>
                <Text style={styles.grayText}>{record.summary}</Text>
              </View>
            </MycareDetailBlock>

            {/* 전체 보기 */}
            <MycareDetailBlock
              title="전체 보기"
              subtitle={record.hasAudio ? '녹음 들으러 가기' : undefined}
              subtitleColor="#EF4444"
              onPressSubtitle={
                record.hasAudio
                  ? () => {
                      // TODO: 녹음 화면으로 이동
                    }
                  : undefined
              }
            >
              <View style={styles.grayBox}>
                <Text style={styles.grayText}>{fullText}</Text>
              </View>
            </MycareDetailBlock>

            {/* 진료 메모 */}
            <MycareDetailBlock title="진료 메모">
              <View style={[styles.grayBox, styles.memoBox]}>
                {/* ✅ grayBox 내부 우상단 edit 버튼 */}
                <Pressable
                  onPress={() => setEditingMemo((v) => !v)}
                  style={styles.memoEditInBoxBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Image
                    source={require('../assets/icons/edit.png')}
                    style={styles.memoEditIcon}
                    resizeMode="contain"
                  />
                </Pressable>

                {/* ✅ 버튼 아래로 내용 내려가게 */}
                {editingMemo ? (
                  <TextInput
                    value={memo}
                    onChangeText={setMemo}
                    multiline
                    style={styles.memoInput}
                    placeholder="메모를 입력하세요"
                    placeholderTextColor="#9CA3AF"
                  />
                ) : (
                  <Text style={styles.grayText}>{memo || '메모가 없습니다.'}</Text>
                )}
              </View>
            </MycareDetailBlock>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

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

  fixedWrap: {
    flex: 1,
  },

  detailCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 15,
    marginHorizontal: 0,
    overflow: 'hidden',
    paddingTop: 15,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 왼쪽(날짜+화살표) / 오른쪽(trash)
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 0,
  },

  dateNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaArrowBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  metaArrowIcon: {
    width: 20,
    height: 20,
  },

  dateText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    marginRight: 8, // ✅ 날짜와 화살표 사이 간격
  },

  trashInlineBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  trashInlineIcon: {
    width: 24,
    height: 24,
    tintColor: '#81848A',
  },

  grayBox: {
    backgroundColor: '#ECF2FC',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  grayText: { color: '#000000', fontSize: 14, lineHeight: 18 },

  memoEditBtn: { padding: 2 },
  memoEditIcon: { width: 16, height: 16, tintColor: '#AEB3BD' },
  memoBox: {
    position: 'relative',
    paddingTop: 34, // ✅ edit 버튼 row 아래로 내용 내려가게
  },

  memoEditInBoxBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoInput: {
    fontSize: 14,
    lineHeight: 20,
    color: '#111827',
    padding: 0,
    margin: 0,
    textAlignVertical: 'top',
  },
});