// src/screens/MycareAudio.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MycareStackParamList } from '../navigation/MycareStackNavigator';

type Props = NativeStackScreenProps<MycareStackParamList, 'MycareAudio'>;

export default function MycareAudio({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { recordId, records } = route.params;

  const record = useMemo(
    () => records.find((r: any) => r.id === recordId) || records[0],
    [recordId, records]
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0.2);

  const [editingText, setEditingText] = useState(false);
  const [fullText, setFullText] = useState(record.fullText ?? record.summary ?? '');

  const togglePlay = () => setIsPlaying((p) => !p);

  const formattedDate = record.dateLabel.replace(/\.(.)$/, ' $1');

  const defaultTitle = formattedDate;
  const [titleText, setTitleText] = useState<string>(record.title ?? '');
  const [editingTitle, setEditingTitle] = useState(false);

  const startEditTitle = () => setEditingTitle(true);
  const finishEditTitle = () => {
    setTitleText((t) => t.trim());
    setEditingTitle(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ height: insets.top, backgroundColor: '#FFFFFF' }} />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.backCircle}
        >
          <Image
            source={require('../assets/icons/back.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* 제목 */}
        <View style={styles.headerTitleArea}>
          {editingTitle ? (
            <TextInput
              value={titleText}
              onChangeText={setTitleText}
              placeholder={defaultTitle}
              placeholderTextColor="#AEB3BD"
              style={styles.titleInput}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={finishEditTitle}
              onBlur={finishEditTitle}
            />
          ) : (
            <Text style={styles.title} numberOfLines={1}>
              {titleText.trim() ? titleText : defaultTitle}
            </Text>
          )}
        </View>

        {editingTitle ? (
          <TouchableOpacity
            onPress={finishEditTitle}
            activeOpacity={0.8}
            style={styles.headerRightBtn}
          >
            <Text style={styles.doneText}>완료</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={startEditTitle}
            activeOpacity={0.8}
            style={styles.headerRightBtn}
          >
            <Image
              source={require('../assets/icons/edit.png')}
              style={styles.editIconHeader}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 본문: grayBox(내부 스크롤) + 하단 플레이어(고정) */}
      <View style={styles.contentWrap}>
        {/* 위 영역: grayBox */}
        <View style={styles.grayArea}>
          <View style={[styles.grayBox, editingText && styles.grayBoxEditing]}>
            {/* grayBox 내부만 스크롤 */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.grayScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {editingText ? (
                <TextInput
                  value={fullText}
                  onChangeText={setFullText}
                  multiline
                  style={styles.textInput}
                  autoFocus
                />
              ) : (
                <Text style={styles.grayText}>{fullText}</Text>
              )}
            </ScrollView>
          </View>
        </View>

        {/* 아래 영역: 플레이어 (화면 하단 고정) */}
        <View style={styles.playerDock}>
          <View style={styles.playerContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.timeText}>00:00</Text>
              <Text style={styles.timeText}>12:35</Text>
            </View>

            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
              <View style={[styles.progressKnob, { left: `${progress * 100}%` }]} />
            </View>

            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.skipBtn} activeOpacity={0.8}>
                <Image
                  source={require('../assets/icons/play-skip-back.png')}
                  style={styles.skipIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.playBtn} onPress={togglePlay} activeOpacity={0.85}>
                <Image
                  source={
                    isPlaying
                      ? require('../assets/icons/stop.png')
                      : require('../assets/icons/play.png')
                  }
                  style={styles.playIconImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.skipBtn} activeOpacity={0.8}>
                <Image
                  source={require('../assets/icons/play-skip-forward.png')}
                  style={styles.skipIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* iPhone 홈 인디케이터 공간 확보 */}
          <View style={{ height: Math.max(insets.bottom, 12) }} />
        </View>
      </View>
    </KeyboardAvoidingView>
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

  headerTitleArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  title: { color: '#333333', fontSize: 18, fontWeight: '600' },
  titleInput: {
    width: '100%',
    textAlign: 'center',
    color: '#333333',
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F5F7FB',
  },
  headerRightBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIconHeader: { width: 18, height: 18, tintColor: '#AEB3BD' },
  doneText: { fontSize: 14, fontWeight: '700', color: '#3B82F6' },

  // 본문 래퍼: 위(텍스트) + 아래(플레이어)
  contentWrap: {
    flex: 1,
    paddingTop: 15,
  },

  // 위 영역(회색 박스 자리): 남는 높이 전부
  grayArea: {
    flex: 1,
    paddingHorizontal: 0,
  },

  // grayBox 자체는 화면에 고정된 박스(내부만 스크롤)
  grayBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginHorizontal: 20,
    marginTop: 5,
    paddingHorizontal: 25,
    paddingVertical: 18,
  },
  grayBoxEditing: {
    borderWidth: 1,
    borderColor: '#3B82F6',
  },

  // grayBox 안 ScrollView content padding
  grayScrollContent: {
    paddingBottom: 18,
  },

  grayText: {
    color: '#000000',
    fontSize: 14,
    lineHeight: 19,
  },

  textInput: {
    color: '#000000',
    fontSize: 14,
    lineHeight: 22,
    textAlignVertical: 'top',
    padding: 0,
    margin: 0,
    minHeight: 200,
  },

  // 하단 플레이어 고정 영역
  playerDock: {
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: 'transparent',
  },

  playerContainer: {
    borderRadius: 16,
    paddingVertical: 10,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#81848A',
  },

  progressBarBg: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    position: 'relative',
    marginBottom: 22,
  },
  progressBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  progressKnob: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    marginLeft: -6,
    top: -4,
  },

  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  },

  skipBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipIcon: {
    width: 30,
    height: 30,
  },

  playBtn: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconImage: {
    width: 40,
    height: 40,
  },
});