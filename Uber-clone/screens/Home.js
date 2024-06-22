import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput } from 'react-native';
import MapboxPlacesAutocomplete from "react-native-mapbox-places-autocomplete";
import tw from 'twrnc';

import { useDispatch } from 'react-redux';

import { setDestination, setOrigin } from '../slices/navSlice';
import NavOptions from '../components/NavOptions';
import AccountButton from '../components/AccountButton';

const Home = () => {
  const dispatch = useDispatch();
  return (
    < SafeAreaView style={tw`bg-white h-full`}>
      < View style={tw`p-5`}>
        <Image
          style={{ width: 100, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://links.papareact.com/gzs"
          }} />
        <AccountButton />
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
          }} />

      </View >

      <NavOptions />
    </SafeAreaView >

  );
};

export default Home;