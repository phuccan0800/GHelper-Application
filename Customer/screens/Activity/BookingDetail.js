import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from '../../context/ToastContext';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BookingApiCall from '../../api/BookingApi';
import ReviewApiCall from '../../api/ReviewApi';

const BookingDetail = ({ route, navigation }) => {
    const { bookingId } = route.params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [selectedRating, setSelectedRating] = useState(0);

    const showToast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Đặt trạng thái loading trước khi gọi API
            try {
                const response = await BookingApiCall.getBookingDetail(bookingId);
                if (response.status === 200) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Error while fetching booking detail:', error);
            } finally {
                setLoading(false); // Tắt trạng thái loading sau khi gọi API xong
            }
        };
        fetchData();
    }, [bookingId]);

    const formatCurrency = (amount) =>
        amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const handleSubmitRating = async () => {
        try {
            if (selectedRating === 0) {
                showToast({ message: 'Please select a rating', type: 'warning' });
                return;
            }

            const response = await ReviewApiCall.submitReview({
                workerId: worker.workerId.id,
                bookingId: bookingId, // Đảm bảo truyền bookingId
                rating: selectedRating,
                comment, // Gửi comment kèm theo
            });

            if (response.status === 201) {
                showToast({ message: 'Rating submitted successfully', type: 'success' });
                setSelectedRating(0); // Reset rating
                setComment(''); // Reset comment
            } else {
                showToast({ message: response.message, type: 'error' });
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('An error occurred. Please try again.');
        }
    };



    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6a11cb" />
                <Text style={styles.loadingText}>Loading booking details...</Text>
            </View>
        );
    }

    const { booking, worker, review } = data || {};

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Booking Details</Text>
            </LinearGradient>

            {/* Main Content */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Booking Information */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Booking Information</Text>
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="map-marker-alt" size={18} color="#6a11cb" />
                        <Text style={styles.infoText}>{booking.address}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="access-time" size={18} color="#6a11cb" />
                        <Text style={styles.infoText}>{formatDate(booking.timeCreated)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="broom" size={18} color="#6a11cb" />
                        <Text style={styles.infoText}>
                            Cleaning Type: {booking.options.cleaningType}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="door-open" size={18} color="#6a11cb" />
                        <Text style={styles.infoText}>
                            Number of Rooms: {booking.options.numberOfRooms}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="info-circle" size={18} color="#6a11cb" />
                        <Text style={styles.infoText}>
                            Status: {booking.workerFindingStatus}
                        </Text>
                    </View>
                </View>

                {/* Payment Information */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Payment Information</Text>
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="money-bill-wave" size={18} color="#4caf50" />
                        <Text style={styles.infoText}>
                            Total: {formatCurrency(booking.transactionId.totalAmount)}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="money-check-alt" size={18} color="#ffc107" />
                        <Text style={styles.infoText}>
                            Commission: {formatCurrency(booking.transactionId.adminCommission)}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="wallet" size={18} color="#2196f3" />
                        <Text style={styles.infoText}>
                            Worker Earnings: {formatCurrency(booking.transactionId.workerEarnings)}
                        </Text>
                    </View>
                </View>

                {/* Rate Worker */}
                {worker && worker.workerId && (
                    <View style={styles.card}>
                        {/* Worker Information */}
                        <View style={styles.workerContainer}>
                            <Image
                                source={{
                                    uri: `${worker.workerId.user_id.avtImg}`,
                                }}
                                style={styles.workerImage}
                            />
                            <View style={styles.workerDetails}>
                                <Text style={styles.workerName}>
                                    {worker.workerId.user_id.name}
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <FontAwesome5 name="star" size={16} color="#ffd700" />
                                    <Text style={styles.ratingText}>
                                        {worker.workerId.rating} / 5
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Check if User Already Reviewed */}
                        {review ? (
                            // Display Review Information
                            <View>
                                <Text style={styles.alreadyReviewedText}>You rated:</Text>
                                <View style={styles.ratingRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FontAwesome5
                                            key={star}
                                            name="star"
                                            size={32}
                                            color={review.rating >= star ? '#ffd700' : '#ccc'}
                                        />
                                    ))}
                                </View>
                                {review.comment && (
                                    <Text style={styles.reviewComment}>"{review.comment}"</Text>
                                )}
                            </View>
                        ) : (
                            // Rating Input
                            <View>
                                {/* Rating Stars */}
                                <View style={styles.ratingRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity
                                            key={star}
                                            onPress={() => setSelectedRating(star)}
                                            style={styles.starButton}
                                        >
                                            <FontAwesome5
                                                name="star"
                                                size={32}
                                                color={selectedRating >= star ? '#ffd700' : '#ccc'}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Comment Input */}
                                <TextInput
                                    style={styles.commentInput}
                                    placeholder="Write a comment (optional)"
                                    placeholderTextColor="#888"
                                    multiline
                                    value={comment}
                                    onChangeText={setComment}
                                />

                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleSubmitRating}
                                >
                                    <Text style={styles.submitButtonText}>Submit Rating</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}


            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f9' },
    header: { padding: 20, flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 10 },
    headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    scrollContainer: { padding: 10 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    infoText: { marginLeft: 10, fontSize: 16, color: '#555' },
    workerContainer: { flexDirection: 'row', alignItems: 'center' },
    workerImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
    workerDetails: { flex: 1 },
    workerName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    workerText: { fontSize: 14, color: '#555' },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    ratingText: { marginLeft: 5, fontSize: 14, color: '#555' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#6a11cb' },
    viewButton: {
        backgroundColor: '#6a11cb',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    viewButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    starButton: {
        marginHorizontal: 5,
    },
    submitButton: {
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
        fontSize: 16,
        color: '#333',
        height: 80,
        textAlignVertical: 'top', // Đảm bảo văn bản bắt đầu từ trên cùng
    },
    alreadyReviewedText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginVertical: 10,
    },
    reviewComment: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#777',
        marginTop: 10,
    },


});

export default BookingDetail;
