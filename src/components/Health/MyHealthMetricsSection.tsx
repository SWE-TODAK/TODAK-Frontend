import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

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
    icon: require('../../assets/icons/healthMetric/kidney.png'),
    
  },
  {
    key: 'lipid',
    label: '지질 · 콜레스테롤',
    icon: require('../../assets/icons/healthMetric/lipid.png'),
    
  },
  {
    key: 'body',
    label: '체형 · 신체',
    icon: require('../../assets/icons/healthMetric/body.png'),
    
  },
  {
    key: 'bloodPressure',
    label: '혈압 · 심혈관',
    icon: require('../../assets/icons/healthMetric/bloodPressure.png'),
    
  },
  {
    key: 'liver',
    label: '간 기능',
    icon: require('../../assets/icons/healthMetric/liver.png'),
    
  },
  {
    key: 'bloodSugar',
    label: '혈당 · 당뇨',
    icon: require('../../assets/icons/healthMetric/bloodSugar.png'),
    
  },
];

type Props = {
  onPressItem?: (key: MyHealthMetricCategory) => void;
};

const MyHealthMetricsSection: React.FC<Props> = ({ onPressItem }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>나의 건강지표</Text>

      <View style={styles.card}>
        {ITEMS.map((item, idx) => {
          const isLast = idx === ITEMS.length - 1;

          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.row, !isLast && styles.rowBorder]}
              activeOpacity={0.7}
              onPress={() => onPressItem?.(item.key)}
            >
              {/* ✅ 왼쪽: 아이콘 + 텍스트 */}
              <View style={styles.left}>
                <Image
                  source={item.icon}style={[styles.leftIcon]}
              />
                <Text style={styles.label}>{item.label}</Text>
              </View>

              {/* ✅ 오른쪽 화살표 */}
              <Image
                source={require('../../assets/icons/arrow-right.png')}
                style={styles.arrow}
              />
            </TouchableOpacity>
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
    marginBottom: 12,
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
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  arrow: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginLeft: 12,
  },
});