import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { AntDesign } from '@expo/vector-icons';

const { height: screenHeight } = Dimensions.get('window');

const ChooseLocation = ({ onLocationSelect, closeModal }) => {
    const [selectedLocation, setSelectedLocation] = useState({
        latitude: 16.060180824608043,
        longitude: 108.22103004793924,
    });
    const [inputLocation, setInputLocation] = useState('');
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;

    // Bắt đầu animation xuất hiện modal
    const showModal = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // Bắt đầu animation ẩn modal
    const hideModal = () => {
        Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            closeModal();
        });
    };

    // Hiện modal khi component được render
    React.useEffect(() => {
        showModal();
    }, []);

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    const handleLocationSelect = () => {
        const location = { lat: 16.060180824608043, long: 108.22103004793924 }; // Vị trí ví dụ
        setSelectedLocation(location);
        onLocationSelect(location); // Gọi hàm để trả về vị trí cho RentJob
    };

    return (
        <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Select Your Location</Text>
                <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
                    <AntDesign name="close" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Input Location */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.locationInput}
                    placeholder="Enter a location..."
                    value={inputLocation}
                    onChangeText={(text) => setInputLocation(text)}
                />
                <TouchableOpacity style={styles.chooseButton} onPress={handleLocationSelect}>
                    <Text style={styles.chooseButtonText}>Choose Location</Text>
                </TouchableOpacity>
            </View>

            {/* Map */}
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                onPress={handleMapPress}
            >
                <Marker coordinate={selectedLocation} title="Selected Location" />
            </MapView>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.selectedLocationText}>
                    Selected: {selectedLocation.latitude.toFixed(5)}, {selectedLocation.longitude.toFixed(5)}
                </Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: screenHeight,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: 'center',
    },
    locationInput: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
        marginRight: 8,
    },
    chooseButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    chooseButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    map: {
        flex: 1,
    },
    footer: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    selectedLocationText: {
        fontSize: 14,
        color: '#555',
    },
});

export default ChooseLocation;
