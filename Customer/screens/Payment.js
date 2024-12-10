import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import ApiCall from '../api/ApiCall';
import styles from './styles';

const Payment = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchTransactions = async () => {
        setLoading(true);
        try {
          const response = await ApiCall.getTransactions();
          if (response.status === 200) {
            setTransactions(response.data.reverse());
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTransactions();
    }, [])
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'failed':
        return '#F44336';
      case 'refunded':
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={localStyles.transactionCard}>
      <View style={localStyles.transactionHeader}>
        <Image
          source={{
            uri: `https://img.icons8.com/color/48/000000/${item.paymentMethod.brand}.png`,
          }}
          style={localStyles.cardIcon}
        />
        <View style={localStyles.transactionDetails}>
          <Text style={localStyles.receiverText}>{item.receiver}</Text>
          <Text style={localStyles.amountText}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: item.currency,
            }).format(item.totalAmount)}
          </Text>
          <Text style={localStyles.dateText}>
            {new Date(item.createdAt).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View
          style={[
            localStyles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={localStyles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <View style={localStyles.paymentMethodRow}>
        <Text style={localStyles.paymentMethodText}>
          Card ending in {item.paymentMethod.last4}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={localStyles.header}>
        <Text style={localStyles.headerTitle}>Payment</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PaymentSetting')}>
          <Ionicons name="settings-outline" size={25} color="black" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={localStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={localStyles.loadingText}>Loading transactions...</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={localStyles.transactionList}
          ListEmptyComponent={
            <View style={localStyles.emptyContainer}>
              <Text style={localStyles.emptyText}>No transactions available.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f4f4f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionList: {
    paddingBottom: 80,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIcon: {
    width: 48,
    height: 48,
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  receiverText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  paymentMethodRow: {
    marginTop: 10,
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2196F3',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default Payment;
