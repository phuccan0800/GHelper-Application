import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import HeaderTabs from '../components/HeaderTabs';
import tw from 'twrnc';
import NavOptions from '../components/NavOptions';
import usePalce

const Home = () => {
  return (
    < SafeAreaView style={tw`bg-white h-full`
    }>
      {/* <StatusBar style="auto" /> */}
      <Auto
      < View style={tw`p-5`}>
        <Image
          style={{ width: 100, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGuyd3SQgLQXRlOu3d4dtY7bPmVEjHIpR1rg&s"
          }} />
      </View >
      <NavOptions />
    </SafeAreaView >

  );
};

export default Home;