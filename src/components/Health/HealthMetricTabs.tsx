// src/components/mycare/HealthMetricTabs.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export type HealthMetricType = 'bloodPressure' | 'bloodSugar' | 'liver';

type Props = {
  selected: HealthMetricType;
  onChange: (metric: HealthMetricType) => void;
};

const HealthMetricTabs: React.FC<Props> = ({ selected, onChange }) => {
  const tabs: { key: HealthMetricType; label: string }[] = [
    { key: 'bloodSugar', label: '혈당' },
    { key: 'bloodPressure', label: '혈압' },
    { key: 'liver', label: '간수치' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = selected === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            activeOpacity={0.9}
            onPress={() => onChange(tab.key)}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default HealthMetricTabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 16,
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#507BFF',
    borderColor: '#507BFF',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
});
