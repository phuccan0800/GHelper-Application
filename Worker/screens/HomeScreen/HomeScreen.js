import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions';
import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location';

const HomeScreen = () => {
    const [state, setState] = useState({
        pickupCords: {
            latitude: 16.06015690264228,
            longitude: 108.22105232324897
        },
        droplocationCors: {
            latitude: 16.057827507259542,
            longitude: 108.22236646580718
        }
    })

    const { pickupCords, droplocationCors } = state
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log(location)
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text>HomeScreen</Text>
            <MapView
                style={StyleSheet.absoluteFill}
                showsMyLocationButton={true}
                showsUserLocation
                showsTraffic
                initialRegion={location}
            >
                {/* <MapViewDirections
                    origin={state.pickupCords}
                    destination={state.droplocationCors}
                    apikey={GOOGLE_MAPS_APIKEY}
                /> */}
            </MapView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default HomeScreen