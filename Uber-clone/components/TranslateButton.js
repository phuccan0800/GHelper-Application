import { View, Text, TouchableOpacity } from 'react-native'
import React, {useState } from 'react'
import { translate, change_language } from '../translator/translator';
import styles from '../assets/styles';

const TranslateButton = () => {
  const [screenReload, setScreenReload] = useState(false);
  const handleLanguageChange = () => {
        change_language();
        setScreenReload(prevState => !prevState);
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