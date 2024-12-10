import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useWorkingContext } from '../context/WorkingContext';
import { useNavigation } from '@react-navigation/native';

const WorkingPopup = () => {
    const { workerState, stopSearching } = useWorkingContext();
    const navigation = useNavigation();

    const currentRoute = navigation.getState()?.routes?.[navigation.getState()?.index]?.name || '';

    // Sửa điều kiện hiển thị
    if (workerState.isSearching || !workerState.worker || currentRoute === 'FindWorker') return null;

    return (
        <Modal transparent visible={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Đã tìm thấy worker!</Text>
                    <Text style={styles.modalText}>Bạn muốn làm gì tiếp theo?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => stopSearching(null)} // Đóng popup
                        >
                            <Text style={styles.buttonText}>Bỏ qua</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={() => {
                                stopSearching(null);
                                navigation.navigate('FindWorker', {
                                    bookingId: workerState.bookingId,
                                    location: workerState.location,
                                }); // Điều hướng đến FindWorker
                            }}
                        >
                            <Text style={styles.buttonText}>Xem</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: '#ccc',
    },
    primaryButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default WorkingPopup;
