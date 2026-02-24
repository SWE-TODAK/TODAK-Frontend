// src/components/setting/SettingMenuList.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

type Props = {
  onPressProfile?: () => void;
  onPressFeedback?: () => void;
  onPressPrivacyHistory?: () => void;
};

const SettingMenuList: React.FC<Props> = ({
  onPressProfile,
  onPressFeedback,
  onPressPrivacyHistory,
}) => {
  return (
    <View style={styles.container}>
      {/* 프로필 설정 */}
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.8}
        onPress={onPressProfile}
      >
        <Text style={styles.rowText}>프로필 설정</Text>
        <Image
          source={require('../../assets/icons/arrow-right.png')}
          style={styles.chevron}
        />
      </TouchableOpacity>

      {/* 피드백을 보내주세요! */}
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.8}
        onPress={onPressFeedback}
      >
        <Text style={styles.rowText}>피드백을 보내주세요!</Text>
        <Image
          source={require('../../assets/icons/arrow-right.png')}
          style={styles.chevron}
        />
      </TouchableOpacity>

      {/* 개인정보 이용 내역 */}
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.8}
        onPress={onPressPrivacyHistory}
      >
        <Text style={styles.rowText}>개인정보 이용 내역</Text>
        <Image
          source={require('../../assets/icons/arrow-right.png')}
          style={styles.chevron}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SettingMenuList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 30,
    paddingTop: 24,
    paddingBottom: 24,
    marginTop: 30,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 10,
  },
  rowText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  chevron: {
    width: 16,
    height: 16,
    tintColor: '#9CA3AF',
    resizeMode: 'contain',
  },
});
