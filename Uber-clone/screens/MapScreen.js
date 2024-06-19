import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Map from "../components/Map";

import tw from 'twrnc';

const MapScreen = () => {
    return (
        <SafeAreaView>
            <View style={tw`h-1/2`}>
                <Map />
            </View>
            <View style={tw`h-1/2`}></View>
        </SafeAreaView>
    )
}

export default MapScreen