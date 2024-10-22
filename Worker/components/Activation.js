import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, PanResponder, Alert } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import ApiCall from '../Api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebSocketService from '../services/WebSocketService';

const { height: screenHeight } = Dimensions.get('window');
const BOTTOM_BAR_MAX_HEIGHT = screenHeight * 0.33;
const BOTTOM_BAR_MIN_HEIGHT = screenHeight * 0.15;
const MAX_UPWARD_TRANSLATE_Y = BOTTOM_BAR_MIN_HEIGHT - BOTTOM_BAR_MAX_HEIGHT;
const MAX_DOWNWARD_TRANSLATE_Y = 0;
const DRAG_THRESHOLD = 1;

const Activation = ({ navigation }) => {
    const [isOnline, setIsOnline] = useState(false);
    const animationValue = useRef(new Animated.Value(BOTTOM_BAR_MIN_HEIGHT)).current;
    const lastGestureDy = useRef(0);
    const webSocketRef = useRef(null);

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

    const toggleOnlineStatus = async () => {
        setIsOnline((prevStatus) => {
            const newStatus = !prevStatus;
            if (newStatus && !webSocketRef.current) {
                webSocketRef.current = new WebSocketService();
                webSocketRef.current.connect(
                    null, // Có thể truyền hàm xử lý khi mở kết nối
                    null, // Có thể truyền hàm xử lý khi nhận tin nhắn
                    (error) => {
                        Alert.alert('Lỗi kết nối', 'Mất kết nối đến máy chủ. Vui lòng thử lại.');
                        setIsOnline(false); // Đặt trạng thái online về false
                    }, // Có thể truyền hàm xử lý khi gặp lỗi
                    () => {
                        // Khi kết nối bị đóng, tự động đặt isOnline về false
                        setIsOnline(false);
                        webSocketRef.current = null; // Đảm bảo ref được reset
                    }
                );
            } else {
                if (webSocketRef.current) {
                    webSocketRef.current.close();
                    webSocketRef.current = null;
                }
            }

            return newStatus;
        });
    };


    useEffect(() => {
        return () => {
            if (webSocketRef.current) {
                webSocketRef.current.close();
            }
        };
    }, []);

    return (
        <Animated.View
            style={[styles.modal, bottomBarAnimation]}
            {...panResponder.panHandlers}
        >
            {/* Nút Bật kết nối */}
            <View style={styles.controlContainer}>
                <TouchableOpacity
                    style={[styles.connectButton, { backgroundColor: isOnline ? 'green' : 'gray' }]}
                    onPress={toggleOnlineStatus}
                >

                    <Fontisto name="power" size={18} color="white" />
                    {!isOnline && <Text style={styles.connectButtonText}> Bật kết nối</Text>}
                </TouchableOpacity>
            </View>

            {/* Trạng thái online/offline */}
            <View style={styles.activationView}>
                <Text style={styles.statusText}>
                    <View
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: 999,
                            marginRight: 15,
                            backgroundColor: isOnline ? 'green' : 'red',
                        }}
                    />
                    {isOnline ? 'Bạn đang online, có thể nhận công việc.' : 'Bạn đang offline.'}
                </Text>
            </View>

            {/* Thanh công cụ */}
            <View style={styles.toolbar}>
                <TouchableOpacity style={styles.toolbarButton}>
                    <Text style={styles.toolbarButtonText}>Loại công việc</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarButton}>
                    <Text style={styles.toolbarButtonText}>Tự động nhận việc</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarButton}>
                    <Text style={styles.toolbarButtonText}>Xem thêm</Text>
                </TouchableOpacity>
            </View>

            {/* Thanh thông báo */}
            <View style={styles.notificationBar}>
                <Text style={styles.notificationText}>
                    Không có thông báo nào. Chúc bạn một ngày làm việc thật tràn đầy năng lượng!
                </Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: BOTTOM_BAR_MIN_HEIGHT - BOTTOM_BAR_MAX_HEIGHT,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        paddingTop: 10,
        height: BOTTOM_BAR_MAX_HEIGHT,
    },
    controlContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
        marginBottom: 10,
    },
    connectButton: {
        padding: 10,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    connectButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    activationView: {
        width: '95%',
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        opacity: 0.9,
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    statusText: {
        fontSize: 16,
        color: 'white',
    },
    toolbar: {
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 5,
        backgroundColor: 'black',
        opacity: 0.9,
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    toolbarButton: {
        padding: 10,
        borderRadius: 5,
    },
    toolbarButtonText: {
        color: 'white',
    },
    notificationBar: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        width: '95%',
        alignItems: 'center',
        borderTopWidth: 1,
        backgroundColor: 'black',
        opacity: 0.9,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        elevation: 5,
    },
    notificationText: {
        fontSize: 14,
        color: 'white',
    },
});

export default Activation;
