import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import PopupModal from './PopupModal';

const PaymentInformation = ({ transaction }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <>
            <TouchableOpacity style={[styles.transactionItem,]} onPress={toggleModal}>
                <View style={styles.transactionContent}>
                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                    <Text style={styles.transactionAmount}>{transaction.amount}</Text>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <TouchableOpacity onPress={toggleModal}>
                    <Image source={'../assets/arrow.png'} style={styles.arrowIcon} />
                </TouchableOpacity>
            </TouchableOpacity>

            {modalVisible && (
                <View>
                    <PopupModal
                        visible={modalVisible}
                        transaction={transaction}
                        onClose={toggleModal}
                    />
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    transactionItem: {
        backgroundColor: '#f8f8f8',
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    transactionContent: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    transactionAmount: {
        fontSize: 14,
        color: '#FF0000',
    },
    transactionDate: {
        fontSize: 12,
        color: '#888',
    },
    arrowIcon: {
        width: 24,
        height: 24,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu tối cho nền
        zIndex: 1,

    },
});

export default PaymentInformation;
