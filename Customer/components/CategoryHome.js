import { FlatList, Text, Touchable, TouchableOpacity, View, Image } from 'react-native';
import React from 'react'
import styles from '../screens/styles';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc'

const items = [
    {
        id: "1",
        image: 'https://placehold.co/48?text=🚲',
        text: 'Xe máy',
        screen: "MapScreen"
    },
    {
        id: "2",
        image: 'https://placehold.co/48?text=🚗',
        text: 'Ô tô',
        screen: "MapScreen"
    },
    {
        id: "3",
        image: 'https://placehold.co/48?text=🍕',
        text: 'Đồ ăn',
        screen: "MapScreen"
    },
    {
        id: "4",
        image: 'https://placehold.co/48?text=📦',
        text: 'Giao hàng',
        screen: "MapScreen"
    },


];

const CategoryHome = () => {
    const navigation = useNavigation();
    return (
        <FlatList
            data={items}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={tw`p-2 pl-6 pb-4 pt-4 bg-gray-200 m-2 w-40 h-62`}
                    onPress={() => navigation.navigate(item.screen)}
                >
                    <View>
                        <Image
                            style={{ width: 120, height: 120, resizeMode: "contain" }}
                            source={{ uri: item.image }}
                        />
                        <Text >{item.text}</Text>
                    </View>
                </TouchableOpacity>
            )}
        />
    );
};

export default CategoryHome