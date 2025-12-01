// src/screens/AuthGate.tsx
import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  getAccessToken,
  saveAccessToken,
  saveRefreshToken,
} from '../utils/authStorage';

const parseQueryString = (query: string): Record<string, string> => {
  const params: Record<string, string> = {};
  query.split('&').forEach((part) => {
    const [rawKey, rawValue] = part.split('=');
    if (!rawKey) return;
    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rawValue ?? '');
    params[key] = value;
  });
  return params;
};

const AuthGate: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleDeepLink = async (url: string) => {
    if (!url) return false;

    // ex) todak://kakao-login?accessToken=aaa&refreshToken=bbb
    const query = url.split('?')[1];
    if (!query) return false;

    const params = parseQueryString(query);
    const accessToken = params['accessToken'];
    const refreshToken = params['refreshToken'];

    if (accessToken && refreshToken) {
      await saveAccessToken(accessToken);
      await saveRefreshToken(refreshToken);

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });

      return true;
    }

    return false;
  };

  useEffect(() => {
    let sub: any;

    const init = async () => {
      // (A) 앱이 딥링크로 켜졌는지 확인
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        const handled = await handleDeepLink(initialUrl);
        if (handled) return;
      }

      // (B) 실행 중에 들어오는 딥링크
      sub = Linking.addEventListener('url', async (event) => {
        await handleDeepLink(event.url);
      });

      // (C) 기존 토큰 체크
      const token = await getAccessToken();
      if (token) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
      const debug = async () => {
        const url = await Linking.getInitialURL();
        console.log("🔥 딥링크 확인:", url);
      };
      debug();
    };

    init();

    return () => {
      if (sub) sub.remove();
    };
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
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
