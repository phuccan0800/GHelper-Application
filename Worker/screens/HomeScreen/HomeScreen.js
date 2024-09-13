import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions';
import React, { useState } from 'react'

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
    return (
        <SafeAreaView style={styles.container}>
            <Text>HomeScreen</Text>
            <MapView
                style={StyleSheet.absoluteFill}
                initialRegion={{
                    latitude: 16.057827507259542,
                    longitude: 108.22105232324897,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
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