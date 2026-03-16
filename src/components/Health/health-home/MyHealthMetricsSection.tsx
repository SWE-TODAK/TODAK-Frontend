import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CustomHealthMetricItem } from './CreateCustomMetricSection';

export type MyHealthMetricCategory =
  | 'kidney'
  | 'lipid'
  | 'body'
  | 'bloodPressure'
  | 'liver'
  | 'bloodSugar';

type Item = {
  key: MyHealthMetricCategory;
  label: string;
  icon: any; 
};

const ITEMS: Item[] = [
  {
    key: 'kidney',
    label: '신장 기능 (선택)',
    icon: require('../../../assets/icons/healthMetric/kidney.png'),
    
  },
  {
    key: 'lipid',
    label: '지질 · 콜레스테롤',
    icon: require('../../../assets/icons/healthMetric/lipid.png'),
    
  },
  {
    key: 'body',
    label: '체형 · 신체',
    icon: require('../../../assets/icons/healthMetric/body.png'),
    
  },
  {
    key: 'bloodPressure',
    label: '혈압 · 심혈관',
    icon: require('../../../assets/icons/healthMetric/bloodPressure.png'),
    
  },
  {
    key: 'liver',
    label: '간 기능',
    icon: require('../../../assets/icons/healthMetric/liver.png'),
    
  },
  {
    key: 'bloodSugar',
    label: '혈당 · 당뇨',
    icon: require('../../../assets/icons/healthMetric/bloodSugar.png'),
    
  },
];

type Props = {
  customItems?: CustomHealthMetricItem[];
  isDeleteMode?: boolean;
  onToggleDeleteMode?: () => void;
  onPressItem?: (key: MyHealthMetricCategory) => void;
  onPressCustomItem?: (item: CustomHealthMetricItem) => void;
  onDeleteCustomItem?: (id: string) => void;
};

const MyHealthMetricsSection: React.FC<Props> = ({
  customItems = [],
  isDeleteMode,
  onToggleDeleteMode,
  onPressItem,
  onPressCustomItem,
  onDeleteCustomItem,
}) => {
  const totalCount = ITEMS.length + customItems.length;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>나의 건강지표</Text>

        <TouchableOpacity
          style={styles.trashButton}
          activeOpacity={0.7}
          onPress={onToggleDeleteMode}
        >
          <Image
            source={require('../../../assets/icons/trash.png')}
            style={[
              styles.trashIcon,
              isDeleteMode && styles.trashIconActive,
            ]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {ITEMS.map((item, idx) => {
          const isLast = idx === totalCount - 1 && customItems.length === 0;

          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.row, !isLast && styles.rowBorder]}
              activeOpacity={0.7}
              onPress={() => onPressItem?.(item.key)}
            >
              <View style={styles.left}>
                <Image source={item.icon} style={styles.leftIcon} />
                <Text style={styles.label}>{item.label}</Text>
              </View>

              <Image
                source={require('../../../assets/icons/arrow-right.png')}
                style={styles.arrow}
              />
            </TouchableOpacity>
          );
        })}

        {customItems.map((item, idx) => {
          const isLast = idx === customItems.length - 1;

          return (
            <View key={item.id} style={[styles.row, !isLast && styles.rowBorder]}>
              <TouchableOpacity
                style={styles.customRowMain}
                activeOpacity={0.7}
                onPress={() => {
                  if (isDeleteMode) return;
                  onPressCustomItem?.(item);
                }}
              >
                <View style={styles.left}>
                  {/* TODO: 커스텀 지표 기본 아이콘은 나중에 여기에 추가 */}
                  <View style={styles.customIconPlaceholder} />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>{item.name}</Text>
                    <Text style={styles.customUnit}>{item.unit}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {isDeleteMode ? (
                <TouchableOpacity
                  style={styles.deleteMarkButton}
                  activeOpacity={0.7}
                  onPress={() => onDeleteCustomItem?.(item.id)}
                >
                  <Image
                    source={require('../../../assets/icons/subtraction.png')}
                    style={styles.deleteMarkIcon}
                  />
                </TouchableOpacity>
              ) : (
                <Image
                  source={require('../../../assets/icons/arrow-right.png')}
                  style={styles.arrow}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default MyHealthMetricsSection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginLeft: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2F62FF',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 16,
    flex: 1,
  },
  leftIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  customIconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  customUnit: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
  },
  arrow: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginLeft: 12,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  trashButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  trashIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#9CA3AF',
  },
  trashIconActive: {
    tintColor: '#2F62FF',
  },

  customRowMain: {
    flex: 1,
  },
  deleteMarkButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteMarkIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});