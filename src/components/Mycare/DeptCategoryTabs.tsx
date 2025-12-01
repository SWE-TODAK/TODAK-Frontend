// src/components/Mycare/DeptCategoryTabs.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

export type DeptItem = {
  id: string;      // 'internal', 'eye' 같은 고유 id
  label: string;   // 화면에 보이는 텍스트 (예: '내과')
};

type Props = {
  items: DeptItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  containerStyle?: ViewStyle;
};

const DeptCategoryTabs: React.FC<Props> = ({
  items,
  selectedId,
  onSelect,
  containerStyle,
}) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map(item => {
          const isSelected = item.id === selectedId;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
              onPress={() => onSelect(item.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default DeptCategoryTabs;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  chip: {
    height: 35,
    paddingHorizontal: 25,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: '#3B82F6', // 메인 포인트 블루 느낌
    borderColor: '#3B82F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  chipUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  chipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipTextUnselected: {
    color: '#111827',
  },
});
