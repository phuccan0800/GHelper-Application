import { Text, TouchableOpacity, Animated, View } from 'react-native';
import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default class Activity extends Component {
  state = {
    activeTab: 'ongoing',
    animation: new Animated.Value(0),
  };

  // Hàm để chuyển tab
  setActiveTab = (tab) => {
    const { activeTab } = this.state.activeTab;
    // Chỉ thực hiện nếu tab mới khác tab hiện tại
    if (activeTab !== tab) {
      Animated.timing(this.state.animation, {
        toValue: tab === 'ongoing' ? 0 : 1,
        duration: 300,
        useNativeDriver: false, // Chúng ta sẽ điều khiển chiều cao nội dung
      }).start();

      this.setState({ activeTab: tab });
    }
  };

  render() {
    const { activeTab, animation } = this.state;
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hoạt động</Text>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'ongoing' && styles.activeTab,
            ]}
            onPress={() => this.setActiveTab('ongoing')}
          >
            <Text style={styles.tabText}>Đang làm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'reviews' && styles.activeTab,
            ]}
            onPress={() => this.setActiveTab('reviews')}
          >
            <Text style={styles.tabText}>Đánh giá</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.content, { transform: [{ translateY }] }]}>
          {activeTab === 'ongoing' ? (
            <Doing />
          ) : (
            <Review />
          )}
        </Animated.View>
      </SafeAreaView>
    );
  }
}
import { StyleSheet } from 'react-native';
import Doing from './Doing';
import Review from './Review';

const styles2 = StyleSheet.create({


});
