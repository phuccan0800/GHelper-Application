import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, RefreshControl, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import MapboxPlacesAutocomplete from "react-native-mapbox-places-autocomplete";
import tw from 'twrnc';

import { useDispatch } from 'react-redux';

import { setDestination, setOrigin } from '../slices/navSlice';
import NavOptions from '../components/NavOptions';
import CategoryHome from '../components/CategoryHome';
import SearchBar from '../components/SearchBar';
import styles from './styles';

const { width } = Dimensions.get('window');

const banners = [
  'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/bussines-banner-template-design-5835b2b8e926cec63f914c6d0cd3795b_screen.jpg?ts=1570491597',
  'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/bussines-banner-template-design-5835b2b8e926cec63f914c6d0cd3795b_screen.jpg?ts=1570491597',
  'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/bussines-banner-template-design-5835b2b8e926cec63f914c6d0cd3795b_screen.jpg?ts=1570491597',
];



const services = [
  { name: 'Dọn dẹp', icon: '../assets/cleaning.png' },
  { name: 'Vá xe', icon: '../assets/bike_repair.png' },
  { name: 'Sửa ống nước', icon: '../assets/plumbing.png' },
  { name: 'Điện', icon: '../assets/electrician.png' },
  { name: 'Nấu ăn', icon: '../assets/cooking.png' },
  { name: 'Giặt ủi', icon: '../assets/laundry.png' },
  { name: 'Chăm sóc thú cưng', icon: '../assets/pet_care.png' },
  { name: 'Giúp việc', icon: '../assets/cleaning_service.png' },
];

const Home = () => {
  const [refreshing, setFreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  const handleRefresh = async () => {
  };

  const onRefresh = useCallback(async () => {
    setFreshing(true);
    await handleRefresh();
    setFreshing(false);
  }, []);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / (width - 32)); // width của mỗi banner
    setCurrentIndex(index);
  };
  return (
    < SafeAreaView style={styles.safeArea} >
      <ScrollView

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
          {/* <CategoryHome />
           */}
          {/* Slide banner */}
          <View style={localStyles.bannerContainer}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              pagingEnabled
              snapToInterval={width - 32}
              decelerationRate={'fast'}
              contentContainerStyle={{ alignItems: 'center' }}
            >

              {banners.map((banner, index) => (
                <Image key={index} source={{ uri: banner }} style={localStyles.bannerImage} />
              ))}
            </ScrollView>

            {/* Hàng dấu chấm */}
            <View style={localStyles.dotsContainer}>
              {banners.map((_, index) => (
                <View
                  key={index}
                  style={[
                    localStyles.dot,
                    { opacity: currentIndex === index ? 1 : 0.5 },
                  ]}
                />
              ))}
            </View>

            {/* Phần dịch vụ */}

          </View>

          <View style={localStyles.serviceContainer}>
            <Text style={localStyles.serviceTitle}>Dịch vụ</Text>
            <View style={localStyles.serviceGrid}>
              {services.map((service, index) => (
                <TouchableOpacity key={index} style={localStyles.serviceItem}>
                  <Image source={service.icon} style={localStyles.serviceIcon} />
                  <Text style={localStyles.serviceText}>{service.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Phần Kiểm tra ngay */}
          <View style={styles.checkNowContainer}>
            <Text style={styles.checkNowTitle}>Kiểm tra ngay</Text>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapText}>Bản đồ sẽ hiển thị ở đây</Text>
            </View>
          </View>
        </View >
      </ScrollView>
    </SafeAreaView >

  );
};
const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 16,
  },
  bannerContainer: {
    height: 200,
    marginBottom: 16,
  },
  bannerImage: {
    width: width - 32,
    height: '100%',
    borderRadius: 8,
    marginRight: 8,
  },
  serviceContainer: {
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  serviceText: {
    textAlign: 'center',
  },
  checkNowContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  checkNowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#CCCCCC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: '#666666',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    height: 200,
    marginBottom: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginHorizontal: 5,
  },
});
export default Home;