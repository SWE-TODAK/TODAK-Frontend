import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export type RecordFilterType = number | 'all';

type Props = {
  value: RecordFilterType;
  onChange: (value: RecordFilterType) => void;
};

const OPTIONS: { label: string; value: RecordFilterType }[] = [
  { label: '7개', value: 7 },
  { label: '14개', value: 14 },
  { label: '21개', value: 21 },
  { label: '전체', value: 'all' },
];

export default function RecentRecordFilter({ value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {OPTIONS.map((option, idx) => {
        const selected = value === option.value;

        return (
          <React.Fragment key={String(option.value)}>
            <Pressable
              style={[styles.item, selected && styles.selectedItem]}
              onPress={() => onChange(option.value)}
            >
              <Text style={[styles.itemText, selected && styles.selectedText]}>
                {option.label}
              </Text>
            </Pressable>

            {idx !== OPTIONS.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
    height: 40,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  selectedItem: {
    backgroundColor: '#E5E7EB',
  },
  itemText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  selectedText: {
    color: '#4B5563',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#D1D5DB',
  },
});