import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type Props = {
  title: string;
  lines: string[];
};

export default function ResultCard({ title, lines }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/icons/blue-check.png')}
          style={styles.icon}
        />

        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.body}>
        {lines.map((text, idx) => (
          <Text key={idx} style={styles.text}>
            {text}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },

  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },

  body: {
    marginTop: 4,
  },

  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7280',
    marginTop: 4,
  },
});