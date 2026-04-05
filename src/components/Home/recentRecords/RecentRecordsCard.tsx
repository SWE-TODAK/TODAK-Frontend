import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type RecordItem = {
  id: string;
  date: string;
  title?: string | null;
  description: string;
};

type Props = {
  records: RecordItem[];
};

const MAX_RECORDS_IN_CARD = 4;

const RecentRecordsCard: React.FC<Props> = ({ records }) => {
  const navigation = useNavigation<any>();
  const visible = records.slice(0, MAX_RECORDS_IN_CARD);

  return (
    <View style={styles.card}>
      <View style={styles.listArea}>
        {visible.map((item, index) => {
          const isLast = index === visible.length - 1;

          return (
            <Pressable
              key={item.id}
              style={styles.row}
              onPress={() => {
                navigation.navigate('MyCare', {
                  screen: 'MycareDetail',
                  params: {
                    recordId: item.id,
                  },
                });
              }}
            >
              <View style={styles.textArea}>
                <Text style={styles.date}>{item.date}</Text>

                {!!item.title && (
                  <Text style={styles.recordTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                )}

                <Text style={styles.desc} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>

              <Image
                source={require('../../../assets/icons/arrow-right.png')}
                style={styles.arrow}
                resizeMode="contain"
              />

              {!isLast && <View style={styles.divider} />}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.moreArea}>
        <View style={styles.moreDivider} />
        <Pressable
          style={styles.moreRow}
          onPress={() => navigation.navigate('MyCare', { screen: 'MycareMain' })}
        >
          <Text style={styles.moreText}>더보기</Text>
          <Image
            source={require('../../../assets/icons/arrow-right.png')}
            style={styles.moreArrow}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
};

export default RecentRecordsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 10,
    height: 400,
    justifyContent: 'space-between',
  },
  listArea: {},
  row: {
    position: 'relative',
    paddingBottom: 14,
    marginBottom: 14,
  },
  textArea: {
    paddingRight: 28,
  },
  date: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
    color: '#111',
  },
  recordTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  desc: {
    fontSize: 15,
    color: '#444',
    lineHeight: 18,
  },
  arrow: {
    position: 'absolute',
    right: 0,
    top: 20,
    width: 18,
    height: 18,
  },
  divider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#E7EAF3',
  },
  moreArea: {},
  moreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 2,
  },
  moreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    marginRight: 6,
  },
  moreArrow: {
    width: 13,
    height: 13,
  },
  moreDivider: {
    height: 1,
    backgroundColor: '#E7EAF3',
  },
});