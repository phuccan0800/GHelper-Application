import { useNavigation } from '@react-navigation/native';
import React, { Component } from 'react';
import { FlatList, Text, Touchable, TouchableOpacity, View, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import tw from 'twrnc';

const data = [
    {
        id: "1",
        title: "Get a ride",
        image: "https://links.papareact.com/3pn",
        screen: "MapScreen"
    },
    {
        id: "2",
        title: "Order food",
        image: "https://links.papareact.com/28w",
        screen: "FoodScreen"
    }
]
const NavOptions = () => {
    const navigation = useNavigation();
    return (
        <FlatList
            data={data}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => navigation.navigate(item.screen)}
                    style={tw`p-2 pl-6 pb-4 pt-4 bg-gray-200 m-2 w-40 h-62`}>
                    <View>
                        <Image
                            style={{ width: 120, height: 120, resizeMode: "contain" }}
                            source={{ uri: item.image }}
                        />
                        <Text style={tw`mt-2 text-lg font-semibold `}>{item.title}</Text>
                        <Icon style={tw`p-2 bg-blue-500 rounded-full w-10 mt-4 left-10 bottom-0`} name="arrowright" color="white" type="antdesign" />
                    </View>
                </TouchableOpacity>
            )}
        />
    );
};


export default NavOptions;
