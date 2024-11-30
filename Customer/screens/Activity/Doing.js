import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const Doing = () => {
    const tasks = [
        { id: '1', title: 'Lau nhà', startTime: '08:00 AM', status: 'Đang làm' },
        { id: '2', title: 'Nấu ăn', startTime: '09:00 AM', status: 'Đang làm' },
        { id: '3', title: 'Giặt đồ', startTime: '10:00 AM', status: 'Chờ xác nhận' },
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <Text style={styles.taskTitle}>{item.title}</Text>
                        <Text style={styles.taskTime}>Thời gian: {item.startTime}</Text>
                        <Text style={styles.taskStatus}>Trạng thái: {item.status}</Text>
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
    },
    taskItem: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        width: '100%',
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    taskTime: {
        marginTop: 4,
        fontSize: 14,
        color: '#555',
    },
    taskStatus: {
        marginTop: 4,
        fontSize: 14,
        color: '#007bff',
    },
});

export default Doing;
