import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import BookingApiCall from '../../api/BookingApi';

const Review = () => {
    const reviews = [
        { id: '1', reviewer: 'Nguyễn Văn A', content: 'Làm việc rất chăm chỉ!', rating: 5 },
        { id: '2', reviewer: 'Trần Thị B', content: 'Công việc được hoàn thành tốt.', rating: 4 },
        { id: '3', reviewer: 'Lê Văn C', content: 'Cần cải thiện thời gian hoàn thành.', rating: 3 },
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={reviews}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reviewItem}>
                        <View style={styles.reviewHeader}>
                            <FontAwesome name="user-circle" size={24} color="#333" />
                            <Text style={styles.reviewerName}>{item.reviewer}</Text>
                        </View>
                        <Text style={styles.reviewContent}>{item.content}</Text>
                        <Text style={styles.reviewRating}>
                            Đánh giá: {item.rating} <FontAwesome name="star" size={14} color="#ffc107" />
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        width: '100%',
        backgroundColor: '#f9f9f9',
    },
    reviewItem: {
        marginBottom: 16,
        padding: 16,
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 5,
        borderLeftColor: '#ffc107',
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    reviewContent: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    reviewRating: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: '600',
        color: '#ffc107',
    },
});

export default Review;
