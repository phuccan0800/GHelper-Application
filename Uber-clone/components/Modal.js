import React, { useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const SuccessModal = ({ visible, onClose, onNavigate, message }) => {
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                onNavigate();
                onClose();
            }, 1500);
        }
    }, [visible, onNavigate, onClose]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>{message}</Text>
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
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default SuccessModal;
