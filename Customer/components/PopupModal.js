import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';

const PopupModal = ({ visible, transaction, onClose }) => {
    const panResponder = React.useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return gestureState.dy > 20; // Bắt đầu khi người dùng kéo xuống
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy > 50) {
                    onClose(); // Đóng pop-up khi kéo xuống đủ
                }
            },
        })
    ).current;

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose} // Đóng modal khi nhấn nút quay lại trên Android
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose} // Đóng modal khi nhấn ra ngoài
            >
                <TouchableOpacity
                    style={styles.modalContent}
                    activeOpacity={1}
                    {...panResponder.panHandlers}
                    onPress={() => { }} // Ngăn không cho nhấn vào nội dung đóng modal
                >
                    <Text style={styles.modalTitle}>{transaction.title}</Text>
                    <Text style={styles.modalAmount}>{transaction.amount}</Text>
                    <Text style={styles.modalDate}>{transaction.date}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end', // Đưa nội dung pop-up xuống dưới
    },
    modalContent: {
        width: '100%',              // Chiều rộng 100%
        padding: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        paddingBottom: 500
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalAmount: {
        fontSize: 16,
        color: '#FF0000',
    },
    modalDate: {
        fontSize: 14,
        color: '#888',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PopupModal;
