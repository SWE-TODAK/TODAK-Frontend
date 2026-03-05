import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';

type Anchor = { x: number; y: number; width: number; height: number };

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  bullets: string[];
  note?: string;
  anchor: Anchor | null;
};

export default function MetricInfoModal({
  visible,
  onClose,
  title,
  bullets,
  note,
  anchor,
}: Props) {
  if (!visible || !anchor) return null;

  const { width: W, height: H } = Dimensions.get('window');

  // ✅ 카드 사이즈 (원하면 조절)
  const cardW = Math.min(320, W - 44);
  const cardH = 190; // 대충, 내용 길면 늘려도 됨

  // ✅ “info 버튼 아래쪽” 기준으로 위치 잡기
  let left = anchor.x + 10;                 // 버튼에서 살짝 오른쪽
  let top = anchor.y + anchor.height + 8;   // 버튼 아래로

  // ✅ 화면 밖으로 나가면 보정
  left = Math.max(22, Math.min(left, W - cardW - 22));
  top = Math.max(22, Math.min(top, H - cardH - 22));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* 딤 + 바깥 클릭 닫기 */}
      <Pressable style={styles.dim} onPress={onClose} />

      {/* 내용 카드 */}
      <View style={[styles.card, { width: cardW, left, top }]}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.list}>
          {bullets.map((b, i) => (
            <Text key={i} style={styles.bullet}>
              • {b}
            </Text>
          ))}
        </View>

        {!!note && <Text style={styles.note}>{note}</Text>}

        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>닫기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 24, 39, 0.25)',
  },
  card: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,

    // ✅ 그림자 (iOS/Android)
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 12,
  },
  list: { rowGap: 8 },
  bullet: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 20,
  },
  note: {
    marginTop: 12,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  closeBtn: {
    marginTop: 14,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
  },
  closeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
  },
});