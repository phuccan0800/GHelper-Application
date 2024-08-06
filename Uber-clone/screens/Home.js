import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, RefreshControl, ScrollView } from 'react-native';
import MapboxPlacesAutocomplete from "react-native-mapbox-places-autocomplete";
import tw from 'twrnc';

import { useDispatch } from 'react-redux';

import { setDestination, setOrigin } from '../slices/navSlice';
import NavOptions from '../components/NavOptions';
import CategoryHome from '../components/CategoryHome';
import SearchBar from '../components/SearchBar';
import styles from '../assets/styles';

const Home = () => {
  const [refreshing, setFreshing] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  const handleRefresh = async () => {
  };

  const onRefresh = useCallback(async () => {
    setFreshing(true);
    await handleRefresh();
    setFreshing(false);
  }, []);

  return (
    < SafeAreaView >
      <ScrollView
        // contentContainerStyle={localStyles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>

        < View style={tw`p-5`}>
          <Text style={{ marginBottom: 20, marginTop: 50, fontStyle: "bold", fontSize: 25, }}>G-HELPER</Text>
          {/* <Image
          style={{ width: 100, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://links.papareact.com/gzs"
          }} /> 
           <MapboxPlacesAutocomplete
            id="origin"
            placeholder="Where you want to go ?"
            accessToken='sk.eyJ1IjoicGh1Y2NhbjA4MDAiLCJhIjoiY2x4Ym8waGsyMGhhbjJtczN4Nmlub2dsNiJ9.WYadawgbd5uxuSli04nckQ'
            onPlaceSelect={(data) => {
              dispatch(setOrigin({
                location: data.geometry.coordinates,
                destination: null
              }));
              console.log(data.geometry.coordinates)
              dispatch(setDestination(null));
            }}
            onClearInput={({ id }) => {
              id === "origin" && dispatch(setOrigin({
                location: null
              }));
            }}
            countryId="VN"
            containerStyle={{
              marginBottom: 0,
              containerStyle: {
                flex: 0,
              },
              textInput: {
                fontSize: 18,
              }
            }} /> */}
          <SearchBar />
          <CategoryHome />
        </View >
      </ScrollView>
    </SafeAreaView >

  );
};
const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Home;