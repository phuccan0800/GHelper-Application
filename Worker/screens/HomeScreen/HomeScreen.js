import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, Animated, TouchableWithoutFeedback } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import Activation from '../../components/Activation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';




const HomeScreen = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [region, setRegion] = useState(null); // State to track map region
    const dropdownAnimation = useRef(new Animated.Value(0)).current; // Create an animated value for dropdown height

    const [previousLocation, setPreviousLocation] = useState(null); // State to store the previous location

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Get initial location
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
            setPreviousLocation(location.coords); // Initialize previous location
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            // Update location every 10 seconds
            const intervalId = setInterval(async () => {
                let updatedLocation = await Location.getCurrentPositionAsync({});
                setLocation(updatedLocation.coords);
                setRegion({
                    latitude: updatedLocation.coords.latitude,
                    longitude: updatedLocation.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });

                // Update heading
                if (previousLocation) {
                    const heading = getHeading(previousLocation, updatedLocation.coords);
                    setPreviousLocation(updatedLocation.coords);
                }
            }, 10000);

            // Clear the interval on component unmount
            return () => clearInterval(intervalId);
        })();
    }, []);

    const getHeading = (prevLoc, currLoc) => {
        console.log(prevLoc, currLoc);
        if (!prevLoc || !currLoc) return 0; // Return a default value if either is null

        const lat1 = prevLoc.latitude;
        const lon1 = prevLoc.longitude;
        const lat2 = currLoc.latitude;
        const lon2 = currLoc.longitude;

        const deltaLon = lon2 - lon1;
        const y = Math.sin(deltaLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
        const angle = Math.atan2(y, x) * (180 / Math.PI); // Convert to degrees

        return angle >= 0 ? angle : angle + 360; // Normalize to 0-360
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);

        // Start the animation for dropdown
        Animated.timing(dropdownAnimation, {
            toValue: dropdownVisible ? 0 : 100, // Animate height between 0 and 100
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const closeDropdown = () => {
        setDropdownVisible(false);
        Animated.timing(dropdownAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const locateUser = () => {
        if (location) {
            setRegion({
                latitude: location.latitude, // Ensure you're accessing the correct property
                longitude: location.longitude, // Ensure you're accessing the correct property
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        } else {
            console.warn('Location is not available yet.'); // Add this to provide feedback
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {dropdownVisible && (
                <TouchableWithoutFeedback onPress={closeDropdown}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}
            <View style={styles.header}>
                {/* Left Button */}
                <TouchableOpacity style={styles.incomeButton} onPress={toggleDropdown}>
                    {dropdownVisible ? (
                        <MaterialCommunityIcons name="close" size={20} color="white" />
                    ) : (
                        <MaterialCommunityIcons name="hand-coin" size={20} color="white" />
                    )}
                    {!dropdownVisible && (
                        <Text style={[styles.buttonText, { marginLeft: 8 }]}>
                            Thu nhập
                        </Text>
                    )}
                </TouchableOpacity>


                {/* Dropdown Content */}
                {dropdownVisible && (
                    <Animated.View style={[styles.dropdownContainer, { height: dropdownAnimation }]}>
                        <TouchableOpacity style={styles.dropdownButton} onPress={() => console.log('Thu nhập')}>
                            <View style={{ flexDirection: 'column', }}>
                                <Text style={styles.dropdownText}> Thu nhập</Text>
                                <Text style={{
                                    color: 'white',
                                    textAlign: 'start',
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                }}> 0đ</Text>
                            </View>
                            <SimpleLineIcons name="arrow-right" size={15} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownButton} onPress={() => console.log('Tiền thưởng')}>
                            <View style={{ flexDirection: 'column', }}>
                                <Text style={styles.dropdownText}> Tiền thưởng</Text>
                                <Text style={{
                                    color: 'white',
                                    textAlign: 'start',
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                }}> 0đ</Text>
                            </View>
                            <SimpleLineIcons name="arrow-right" size={15} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownButton} onPress={() => console.log('Ví tài khoản')}>
                            <View style={{ flexDirection: 'column', }}>
                                <Text style={styles.dropdownText}> Ví tài khoản</Text>
                                <Text style={{
                                    color: 'white',
                                    textAlign: 'start',
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                }}> 999.000.000đ</Text>
                            </View>
                            <SimpleLineIcons name="arrow-right" size={15} color="white" />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* Right Button */}
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('ProfileScreen')}>
                    <Image
                        style={styles.avatar}
                        source={{ uri: 'https://example.com/avatar.png' }} // URL của ảnh đại diện
                    />
                    <View style={styles.ratingText}>
                        <MaterialIcons name="star-rate" size={15} color="yellow" />
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 15
                        }}>4.50</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Locate Current Position Button */}
            <TouchableOpacity style={styles.locateButton} onPress={locateUser}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>

            {/* Map */}
            <MapView
                style={StyleSheet.absoluteFill}
                // showsMyLocationButton={true}
                // showsUserLocation
                showsTraffic
                region={region}
                onRegionChangeComplete={(newRegion) => setRegion(newRegion)} // Update region when the map moves
            >
                {/* Marker for current location */}
                {location && (
                    <Marker
                        coordinate={location}
                        title="Your Location"
                        rotation={getHeading(previousLocation, location)} // Set the rotation
                        anchor={{ x: 0.5, y: 0.5 }} // Center the marker
                    >
                        <Image
                            source={require('../../assets/images/arrow.png')}
                            style={{ width: 30, height: 30 }}
                        />
                    </Marker>
                )}
            </MapView>
            <Activation />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        padding: 20,
        position: 'absolute',
        top: 10,
        width: '100%',
        zIndex: 10,
    },
    incomeButton: {
        marginTop: 20,
        backgroundColor: 'black',
        textAlign: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        opacity: 0.8,
        height: 40,
        minWidth: 40,
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 25,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    profileButton: {
        alignItems: 'center',
    },
    avatar: {
        width: 75,
        height: 75,
        backgroundColor: 'gray',
        borderRadius: 65,
    },
    ratingText: {
        marginTop: -8,
        paddingHorizontal: 10,
        backgroundColor: 'black',
        color: 'white',
        opacity: 0.8,
        minWidth: 65,
        textAlign: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 15,
        fontWeight: 'bold',
    },
    dropdownContainer: {
        position: 'absolute',
        top: 80,
        opacity: 0.8,
        left: 20,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: 5,
        backgroundColor: 'black',
        minWidth: 150,
        borderRadius: 8,
    },
    dropdownText: {
        color: 'white',
        textAlign: 'start',
        fontWeight: 'bold',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 5,
    },
    locateButton: {
        position: 'absolute',
        width: 40,
        height: 40,
        bottom: 400,
        right: 30,
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 25,
        zIndex: 10,
        opacity: 0.9,
    },
});

export default HomeScreen;
