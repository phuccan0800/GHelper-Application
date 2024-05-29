import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import HeaderTabs from '../components/HeaderTabs';

export default function Home() {
  return (
    <SafeAreaView style={{styles}}>
        <StatusBar style="auto" />
        <HeaderTabs />
    </SafeAreaView>
    
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });