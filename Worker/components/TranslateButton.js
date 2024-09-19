// components/TranslateButton.js
import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function TranslateButton() {
    const { changeLanguage, locale } = useContext(LanguageContext);

    const handlePress = () => {
        const newLanguage = locale === 'en' ? 'vi' : 'en';
        changeLanguage(newLanguage);
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.7}>
            <MaterialIcons style={styles.buttonText} name="g-translate" size={24} color="#007AFF" />
            <Text style={styles.buttonText}>
                {locale === 'en' ? 'English' : 'Tiếng Việt'}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center', // Căn giữa các item
        marginLeft: 10, // Thêm khoảng cách từ lề trái

    },
    buttonText: {
        color: '#007AFF',
        fontSize: 16,
        marginLeft: 5,
        shadowColor: '#000',
        fontWeight: 'bold',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default TranslateButton;
