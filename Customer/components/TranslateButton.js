import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { translate, change_language } from '../translator/translator';
import styles from '../screens/styles';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';

const TranslateButton = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const currentScreen = useRoute().name;

  const handleLanguageChange = () => {
    change_language();
    navigation.reset({
      index: 0,
      routes: [{ name: currentScreen }],
    });
  };
  return (
    <View>
      <TouchableOpacity style={styles.change_language} onPress={handleLanguageChange}>
        <Text style={styles.change_language_text}>{translate('change_language')}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default TranslateButton