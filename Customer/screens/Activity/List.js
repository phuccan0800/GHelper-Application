import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BookingApiCall from '../../api/BookingApi';

const List = ({ navigation }) => {
    const [bookings, setBookings] = useState([]);
    const fadeAnim = useRef([]).current;

    useEffect(() => {
        // Initialize animation values for each item
        fadeAnim.length = bookings.length;
        bookings.forEach((_, index) => {
            fadeAnim[index] = new Animated.Value(0);
        });

        // Animate each item with delay
        bookings.forEach((_, index) => {
            Animated.timing(fadeAnim[index], {
                toValue: 1,
                duration: 500,
                delay: index * 150,
                useNativeDriver: true,
            }).start();
        });
    }, [bookings]);

    useFocusEffect(
        useCallback(() => {
            const getBookingsIncompletedCall = async () => {
                try {
                    const response = await BookingApiCall.getBookingsIncompleted();
                    if (response.status !== 200) {
                        setBookings([]);
                        return;
                    }
                    console.log(response.data);
                    setBookings(response.data.sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated)));
                } catch (error) {
                    console.error(error);
                }
            };
            getBookingsIncompletedCall();
        }, [])
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'going':
                return '#4CAF50';
            case 'arrived':
                return '#2196F3';
            case 'working':
                return '#FF9800';
            case 'available':
                return '#9C27B0';
            case 'completed': return '#4CAF50';
            case 'pending': return '#FFC107';
            default: return '#757575';
        }
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            onPress={() =>
                (item.status === 'accepted' || item.status === 'waiting')
                    ? navigation.navigate('FindWorker', { bookingId: item.id })
                    : navigation.navigate('BookingDetail', { bookingId: item.id, navigation })
            }
        >
            <Animated.View
                style={[
                    styles.bookingCard,
                    {
                        opacity: fadeAnim[index] || 0,
                        transform: [{
                            translateY: fadeAnim[index]?.interpolate({
                                inputRange: [0, 1],
                                outputRange: [50, 0],
                            }) || 0,
                        }],
                    },
                ]}
            >
                <LinearGradient
                    colors={['#ffffff', '#f8f9ff']}
                    style={styles.cardGradient}
                >
                    <View style={styles.headerRow}>
                        <View style={styles.jobTypeContainer}>
                            <LinearGradient
                                colors={['#4c669f', '#3b5998', '#192f6a']}
                                style={styles.iconContainer}
                            >
                                <FontAwesome5 name="broom" size={20} color="#fff" />
                            </LinearGradient>
                            <Text style={styles.jobName}>{item.jobName}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                            <Text style={styles.statusText}>{item.status === 'accepted' ? 'Working' : item.status}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <FontAwesome5 name="map-marker-alt" size={16} color="#4c669f" />
                            <Text style={styles.detailText}>{item.address}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <FontAwesome5 name="clock" size={16} color="#4c669f" />
                            <Text style={styles.detailText}>{formatDate(item.timeCreated)}</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <FontAwesome5 name="money-bill-wave" size={16} color="#4c669f" />
                            <Text style={styles.priceText}>{formatCurrency(item.totalAmount)}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </Animated.View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {!bookings.length > 0 && (
                <View style={styles.container}>
                    <Text style={{ textAlign: 'center', marginTop: 16 }}>No bookings found</Text>
                </View>
            )}

            <FlatList
                data={bookings}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        marginBottom: 60,

        backgroundColor: '#f0f2f5',
    },
    listContainer: {
        padding: 16,
    },
    bookingCard: {
        width: '100%',
        marginBottom: 16,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardGradient: {
        borderRadius: 16,
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    jobTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    jobName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
        color: '#1a1a1a',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 12,
    },
    detailsContainer: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    detailText: {
        fontSize: 15,
        color: '#4a4a4a',
        flex: 1,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 4,
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4c669f',
    },
});

export default List;
