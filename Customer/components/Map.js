import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView, { Marker } from 'react-native-maps';
import tw from 'twrnc';
import { useSelector } from 'react-redux';
import { selectOrigin } from '../slices/navSlice';

const Map = () => {
    const origin = useSelector(selectOrigin);
    return (

        <MapView
            style={tw`flex-1`}
            mapType='mutedStandard'
            initialRegion={{
                latitude: origin.location[0],
                longitude: origin.location[1],
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
        >
            {
                origin?.location && (
                    <Marker
                        coordinate={{
                            latitude: origin.location[0],
                            longitude: origin.location[1]
                        }}
                        title='Origin'
                        description={origin.description}
                        identifier='origin'
                    />
                )}
        </MapView>

    )
}

export default Map

const styles = StyleSheet.create({})