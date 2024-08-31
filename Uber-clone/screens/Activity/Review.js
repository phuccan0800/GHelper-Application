import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

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
                        <Text style={styles.reviewerName}>{item.reviewer}</Text>
                        <Text style={styles.reviewContent}>{item.content}</Text>
                        <Text style={styles.reviewRating}>Đánh giá: {item.rating} sao</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 16,
    },
    reviewItem: {
        marginBottom: 16,
        padding: 16,
        width: "100%",
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    reviewerName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    reviewContent: {
        marginTop: 4,
        fontSize: 14,
        color: '#555',
    },
    reviewRating: {
        marginTop: 4,
        fontSize: 14,
        color: '#007bff',
    },
});

export default Review;
