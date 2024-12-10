import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../screens/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import 'react-native-get-random-values';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const SearchBar = () => {
    return (
        <View>
            <GooglePlacesAutocomplete
                placeholder='Where are you ?'
                styles={styles.searchContainer}
                renderLeftButton={() => (
                    <Ionicons style={{ marginTop: 10, marginRight: 5 }} name="location-sharp" size={24} color="black" />
                )}
            />
        </View>
        // <View style={styles.searchContainer}>
        //     <TextInput
        //         placeholder="Tìm địa điểm"
        //         style={styles.searchText}
        //     />
        //     <TouchableOpacity style={styles.searchButton}>
        //         <Ionicons name="search-outline" size={24} color="black" style={styles.searchButtonIcon} />
        //     </TouchableOpacity>
        // </View>
    );
};

export default SearchBar