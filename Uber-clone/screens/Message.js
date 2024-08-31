import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import styles from './styles';
import MessagePopupModal from '../components/MessagePopupModal';

const Message = () => {
  const [activeTab, setActiveTab] = useState('chat'); // Trò Chuyện là tab mặc định
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);

  const messages = [
    { id: 1, title: 'Người bạn 1', message: 'Chào bạn! Bạn có rảnh không?', time: '10:30 AM' },
    { id: 2, title: 'Người bạn 2', message: 'Nhớ gửi cho tôi tài liệu đó nhé.', time: '09:15 AM' },
    { id: 3, title: 'Người bạn 3', message: 'Bạn đã xem bộ phim đó chưa? Thật sự hay đấy!', time: '08:45 AM' },
    { id: 4, title: 'Người bạn 4', message: 'Chúc mừng sinh nhật!', time: 'Yesterday' },
    // Thêm các tin nhắn khác nếu cần
  ];

  const notifications = [
    { id: 1, title: 'Thông báo 1', message: 'Bạn đã nhận được một tin nhắn mới.', time: '10:30 AM' },
    { id: 2, title: 'Thông báo 2', message: 'Đã có cập nhật mới cho ứng dụng.', time: '09:15 AM' },
    // Thêm các thông báo khác nếu cần
  ];

  const renderMessage = (message) => (
    <TouchableOpacity
      key={message.id}
      style={localStyles.messageItem}
      onPress={() => {
        // Khi nhấn vào tin nhắn, mở modal với danh sách tin nhắn của người đó
        setSelectedMessages([
          { id: 1, message: 'Tin nhắn đầu tiên của ' + message.title, isUser: false },
          { id: 2, message: 'Tin nhắn thứ hai của ' + message.title, isUser: false },
          { id: 3, message: 'Tin nhắn thứ ba của ' + message.title, isUser: false },
          { id: 4, message: 'Tin nhắn của tôi', isUser: true }, // Tin nhắn của bạn
          // Thêm nhiều tin nhắn hơn nếu cần
        ]);
        setModalVisible(true); // Hiển thị modal
      }}
    >
      <View style={localStyles.iconCircle} />
      <View style={localStyles.messageContent}>
        <Text style={localStyles.messageTitle}>{message.title}</Text>
        <Text style={localStyles.messageText}>
          {message.message.length > 30 ? message.message.substring(0, 30) + '...' : message.message}
        </Text>
        <Text style={localStyles.messageTime}>{message.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin nhắn</Text>
      </View>
      <View style={localStyles.tabs}>
        <TouchableOpacity
          style={[localStyles.tab, activeTab === 'chat' && localStyles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={localStyles.tabText}>Trò Chuyện</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[localStyles.tab, activeTab === 'notification' && localStyles.activeTab]}
          onPress={() => setActiveTab('notification')}
        >
          <Text style={localStyles.tabText}>Thông báo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={localStyles.content}>
        {activeTab === 'chat' ? messages.map(renderMessage) : notifications.map(renderMessage)}
      </ScrollView>

      {/* Modal hiển thị cuộc hội thoại */}
      <MessagePopupModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        messages={selectedMessages}
      />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007BFF',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007BFF',
    marginRight: 16,
  },
  messageContent: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 14,
    color: '#555',
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
  },
});

export default Message;
