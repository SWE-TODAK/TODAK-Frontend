// src/screens/AuthGate.tsx
import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getAccessToken } from '../utils/authStorage';

const AuthGate: React.FC = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const checkToken = async () => {
      const token = await getAccessToken();

      if (token) {
        // 토큰 있으면 메인으로
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        // 토큰 없으면 로그인으로
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    };

    checkToken();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    </SafeAreaView>
  );
};

export default AuthGate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
