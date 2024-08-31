import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import React, { Component } from 'react'
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context'
import PaymentInformation from '../components/PaymentInformation';

const transactions = [
  { id: '1', title: 'Giao dịch 1', amount: '100.000 VNĐ', date: '01/08/2024' },
  { id: '2', title: 'Giao dịch 2', amount: '200.000 VNĐ', date: '02/08/2024' },
  { id: '3', title: 'Giao dịch 3', amount: '150.000 VNĐ', date: '03/08/2024' },
  { id: '4', title: 'Giao dịch 4', amount: '50.000 VNĐ', date: '04/08/2024' },
];

const Payment = () => {
  const renderTransaction = ({ item }) => <PaymentInformation transaction={item} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={localStyles.transactionList}
      />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  transactionList: {
    paddingBottom: 16,
  },
});

export default Payment;