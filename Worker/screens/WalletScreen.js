import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiCall from '../Api/api';
const { useToast } = require('../context/ToastContext');

// Component chính
const WalletScreen = ({ route, navigation }) => {
    const [balance, setBalance] = useState(route.params.balance || 0);
    const [isLoading, setIsLoading] = useState(false);
    const showToast = useToast();

    // Hàm quay lại
    const handleGoBack = () => {
        navigation.goBack();
    };

    // Hàm xử lý rút tiền
    const handleWithdraw = () => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn rút tiền không?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đồng ý', onPress: () => processWithdraw() },
            ],
            { cancelable: true }
        );
    };

    // Hàm gọi API rút tiền
    const processWithdraw = async () => {
        setIsLoading(true);
        try {
            const response = await ApiCall.withdrawBalance(balance);
            if (response.status === 200) {
                setBalance(0);
                showToast({ type: 'success', message: response.data.message });
            } else {
                showToast({ type: 'error', message: response.message });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header onGoBack={handleGoBack} title="Ví tiền mặt" />
            <BalanceBox balance={balance} />
            <WithdrawButton
                isLoading={isLoading}
                onWithdraw={handleWithdraw}
            />
        </View>
    );
};

// Component Header
const Header = ({ onGoBack, title }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
    </View>
);

// Component hiển thị số dư
const BalanceBox = ({ balance }) => (
    <View style={styles.balanceBox}>
        <Text style={styles.balanceText}>Số dư tiền mặt</Text>
        <Text style={styles.balanceAmount}>{balance.toLocaleString()} đ</Text>
    </View>
);

// Component nút rút tiền
const WithdrawButton = ({ isLoading, onWithdraw }) => (
    <TouchableOpacity
        style={styles.withdrawButton}
        onPress={onWithdraw}
        disabled={isLoading}
    >
        {isLoading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text style={styles.withdrawText}>Rút tiền</Text>
        )}
    </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10,
    },
    balanceBox: {
        backgroundColor: '#E5F9E0',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 30,
    },
    balanceText: {
        fontSize: 16,
        color: '#555',
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    withdrawButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    withdrawText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default WalletScreen;
