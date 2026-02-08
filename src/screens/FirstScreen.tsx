import React ,{ useEffect }from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type FirstScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'First'
>;

const FirstScreen: React.FC = () => {
    const navigation = useNavigation<FirstScreenNavProp>();
  
    useEffect(() => {
      console.log("🔥 FirstScreen 보여지는 중!");
      const timer = setTimeout(() => {
        // 스플래시 뒤로가기 안 되게 replace
        navigation.replace('Login');
      }, 3000);
  
      return () => clearTimeout(timer);
    }, [navigation]);
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <Image
            source={require('../assets/photo/todak_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>토닥</Text>
        </View>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 70,   // 필요하면 조절 가능
    height: 70,
    marginRight: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
});

export default FirstScreen;
