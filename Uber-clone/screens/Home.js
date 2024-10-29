import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, RefreshControl, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import SearchBar from '../components/SearchBar';
import styles from './styles';
import ApiCall from '../api/ApiCall';

const { width } = Dimensions.get('window');

const banners = [
  'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/bussines-banner-template-design-5835b2b8e926cec63f914c6d0cd3795b_screen.jpg?ts=1570491597',
  'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/bussines-banner-template-design-5835b2b8e926cec63f914c6d0cd3795b_screen.jpg?ts=1570491597',
  'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/bussines-banner-template-design-5835b2b8e926cec63f914c6d0cd3795b_screen.jpg?ts=1570491597',
];

const Home = ({ navigation }) => {
  const [refreshing, setFreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState([]);
  const [jobsAvailable, setJobsAvailable] = useState([]);

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    const response = await ApiCall.getAllJobs();
    // console.log(response);
    if (response) {
      setJobsAvailable(response);
    };
  }

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
          <SearchBar />
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
              {
                (jobsAvailable.length > 0) ? jobsAvailable.map((job) => (
                  <TouchableOpacity key={job.id} style={localStyles.serviceItem}
                    onPress={() => { navigation.navigate('RentJob', { job }) }}
                  >
                    <Image source={job.icon} style={localStyles.serviceIcon} />
                    <Text style={localStyles.serviceText}>{job.title}</Text>
                  </TouchableOpacity>
                )) : <Text>Không có dữ liệu</Text>
              }
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