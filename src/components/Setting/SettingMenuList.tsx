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
  onPressFamily?: () => void;
  onPressReservation?: () => void;
  onPressAppSetting?: () => void;
  onPressNotification?: () => void;
};

const SettingMenuList: React.FC<Props> = ({
  onPressFamily,
  onPressReservation,
  onPressAppSetting,
  onPressNotification,
}) => {
  return (
    <View style={styles.container}>
      {/* 가족관리 */}
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.8}
        onPress={onPressFamily}
      >
        <View style={styles.rowLeft}>
          {/* 👉 아이콘은 나중에 너가 원하는 이미지로 교체하면 돼 */}
          <Image
            source={require('../../assets/icons/family.png')}
            style={styles.rowIcon}
          />
          <Text style={styles.rowText}>가족관리</Text>
        </View>

        <Image
          source={require('../../assets/icons/arrow-right.png')}
          style={styles.chevron}
        />
      </TouchableOpacity>

      {/* 구분선 */}
      <View style={styles.separator} />

      {/* 예약 내역 */}
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.8}
        onPress={onPressReservation}
      >
        <Text style={styles.rowText}>예약 내역</Text>

        <Image
          source={require('../../assets/icons/arrow-right.png')}
          style={styles.chevron}
        />
      </TouchableOpacity>

      {/* 앱 설정 */}
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.8}
        onPress={onPressAppSetting}
      >
        <Text style={styles.rowText}>앱 설정</Text>

        <Image
          source={require('../../assets/icons/arrow-right.png')}
          style={styles.chevron}
        />
      </TouchableOpacity>

      {/* 알림 설정 */}
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.8}
        onPress={onPressNotification}
      >
        <Text style={styles.rowText}>알림 설정</Text>

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
    marginTop:30,
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
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
    marginBottom: 12,
  },
});
