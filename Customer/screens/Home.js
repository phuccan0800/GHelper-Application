import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, RefreshControl, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import ApiCall from '../api/ApiCall';
const backendUrl = "http://192.168.1.36:3000";
console.log(backendUrl);
const { width } = Dimensions.get('window');

const banners = [
  "https://www.btaskee.com/wp-content/uploads/2019/03/Banner-giup-viec-nha-home-cleaning-bTaskeer-web-vie.jpg",
  'https://assets.grab.com/wp-content/uploads/sites/11/2024/07/23120214/thu-nghiem-tach-don-hang-lon-banner-2.png',
  'https://assets.grab.com/wp-content/uploads/sites/11/2023/10/24120305/tang-dp-23-10-banner-1-scaled.jpg',
];

const Home = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [jobsAvailable, setJobsAvailable] = useState([]);
  const [workers, setWorkers] = useState([]);
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
  }, [jobsAvailable, workers, userLocation]);


  useEffect(() => {
    handleRefresh();
    const getUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    getUserLocation();
  }, []);

  const handleRefresh = async () => {
    try {
      const jobResponse = await ApiCall.getAllJobs();
      setJobsAvailable(jobResponse || []);

      // Kiểm tra nếu bạn muốn bật tính năng workers
      // const workerResponse = await ApiCall.getOnlineWorkers();
      // setWorkers(workerResponse || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / (width - 42));
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.container}>
          {/* Header */}
          <Text style={styles.title}>G-HELPER</Text>

          {/* Banner Section */}
          <View style={styles.bannerContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              pagingEnabled
            >
              {banners.map((banner, index) => (
                <Image key={index} source={{ uri: banner }} style={styles.bannerImage} />
              ))}
            </ScrollView>
            <View style={styles.dotsContainer}>
              {banners.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { opacity: currentIndex === index ? 1 : 0.5 },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Services Section */}
          <View style={styles.serviceContainer}>
            <Text style={styles.sectionTitle}>Services</Text>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const currentPage = Math.round(
                  e.nativeEvent.contentOffset.x / (width - 32)
                );
                setCurrentPage(currentPage);
              }}
              scrollEventThrottle={16}
              style={styles.servicesScroll}
            >
              {jobsAvailable.length > 0 ? (
                Array.from({ length: Math.ceil(jobsAvailable.length / 6) }).map((_, pageIndex) => (
                  <View key={pageIndex} style={styles.servicePage}>
                    {jobsAvailable
                      .slice(pageIndex * 6, (pageIndex + 1) * 6)
                      .map((job) => (
                        <TouchableOpacity
                          key={job.id}
                          style={styles.serviceItem}
                          onPress={() => navigation.navigate('RentJob', { job })}
                        >
                          <Image source={{ uri: `${backendUrl}${job.icon}` }} style={styles.serviceIcon} />
                          <Text style={styles.serviceText}>{job.title}</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                ))
              ) : (
                <Text style={styles.noJobsText}>No jobs available</Text>
              )}
            </ScrollView>
            {/* Dot Indicators */}
            <View style={styles.dotsContainer}>
              {Array.from({ length: Math.ceil(jobsAvailable.length / 6) }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { opacity: currentPage === index ? 1 : 0.5 },
                  ]}
                />
              ))}
            </View>
          </View>


          {/* Workers Map Section */}
          <Text style={styles.sectionTitle}>Workers Map</Text>
          <View style={styles.mapContainer}>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginBottom: 80
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#16247d',
    textAlign: 'center',
    marginBottom: 20,
  },
  bannerContainer: {
    height: 180,
    marginBottom: 16,
  },
  bannerImage: {
    width: width - 42,
    height: '100%',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16247d',
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  serviceContainer: {
    marginBottom: 16,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  noJobsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  mapContainer: {
    height: 300,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },

  map: {
    flex: 1,
  },
  serviceContainer: {
    marginBottom: 16,
  },
  servicesScroll: {
    height: 250,
  },
  servicePage: {
    width: width - 32,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '30%', // 3 mục trên mỗi hàng
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  noJobsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
    backgroundColor: '#16247d',
    marginHorizontal: 5,
  },

});

export default Home;
