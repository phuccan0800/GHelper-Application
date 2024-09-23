import React, { useState, useRef } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Animated, Dimensions, PanResponder } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TextInput } from 'react-native-paper';

const { height: screenHeight } = Dimensions.get('window');
const BOTTOM_BAR_MAX_HEIGHT = screenHeight * 0.95;
const BOTTOM_BAR_MIN_HEIGHT = screenHeight * 0.2;
const MAX_UPWARD_TRANSLATE_Y = BOTTOM_BAR_MIN_HEIGHT - BOTTOM_BAR_MAX_HEIGHT;
const MAX_DOWNWARD_TRANSLATE_Y = 0;
const DRAG_THRESHOLD = 1;

const ChooseLocation = ({ onLocationSelect, navigation }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const animationValue = useRef(new Animated.Value(MAX_UPWARD_TRANSLATE_Y)).current;
    const lastGestureDy = useRef(0);
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                animationValue.setOffset(lastGestureDy.current);
            },
            onPanResponderMove: (evt, gesture) => {
                animationValue.setValue(gesture.dy);
            },
            onPanResponderRelease: (evt, gesture) => {
                animationValue.flattenOffset();
                if (gesture.dy > 0) {
                    if (gesture.dy <= DRAG_THRESHOLD) {
                        springAnimation('up');
                    } else {
                        springAnimation('down');
                    }
                } else {
                    if (gesture.dy >= -DRAG_THRESHOLD) {
                        springAnimation('down');
                    } else {
                        springAnimation('up');
                    }
                }
            },
        })
    ).current;

    const springAnimation = (direction) => {

        lastGestureDy.current = direction === 'down' ? MAX_DOWNWARD_TRANSLATE_Y : MAX_UPWARD_TRANSLATE_Y;
        Animated.spring(animationValue, {
            toValue: lastGestureDy.current,
            useNativeDriver: false,
        }).start();
    };

    const bottomBarAnimation = {
        transform: [{
            translateY: animationValue.interpolate({
                inputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
                outputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
                extrapolate: 'clamp',
            })
        }],
    }

    // Hàm để chọn vị trí (ví dụ)
    const handleLocationSelect = () => {
        const location = { lat: 10.762622, long: 106.660172 }; // Vị trí ví dụ
        setSelectedLocation(location);
        onLocationSelect(location); // Gọi hàm để trả về vị trí cho RentJob
    };

    return (
        <Animated.View
            style={[styles.modal, bottomBarAnimation]}
            {...panResponder.panHandlers}
        >
            <View style={styles.topBar}>
                <View></View>
                <Text style={{
                    right: '50%',
                    fontSize: 15,
                    left: '50%',
                    fontWeight: 'bold',
                }}>Bạn đang ở đâu ?</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{
                marginHorizontal: 15,
                alignItems: 'center',
            }}>
                <TextInput mode='flat' underlineColor='transparent' style={styles.locationInput}></TextInput>
                <Button title="Chọn vị trí" onPress={handleLocationSelect} />
                {selectedLocation && <Text>{selectedLocation.lat}, {selectedLocation.long}</Text>}
            </View>
        </Animated.View>

    );
};
const styles = StyleSheet.create({
    modal: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        flex: 1,
        alignContent: 'center',
        bottom: BOTTOM_BAR_MIN_HEIGHT - BOTTOM_BAR_MAX_HEIGHT,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        height: BOTTOM_BAR_MAX_HEIGHT,
        elevation: 1
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
    },
    closeButton: {

        justifyContent: 'flex-end',
    },

    locationInput: {
        width: '100%',
        height: 40,
        elevation: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
        paddingLeft: 10,
    }

});

export default ChooseLocation;
