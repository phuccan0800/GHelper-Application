import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Sử dụng thư viện icon
import * as ImagePicker from 'expo-image-picker'; // Cần cài đặt expo-image-picker
import { Audio } from 'expo-av'; // Cần cài đặt expo-av

const MessagePopupModal = ({ visible, onClose, messages, onSend }) => {
    const [message, setMessage] = useState('');
    const [recording, setRecording] = useState(null);

    useEffect(() => {
        // Thiết lập chế độ âm thanh
        const setAudioMode = async () => {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true, // Cho phép ghi âm trên iOS
                // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
                playsInSilentModeIOS: true,
                stayActiveInBackground: true,
                shouldDuckAndroid: true,
                // interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
            });
        };

        setAudioMode();

        // Cleanup
        return () => {
            setRecording(null);
        };
    }, []);

    const handleSend = () => {
        if (message.trim()) {
            onSend({ message, isUser: true });
            setMessage(''); // Xóa ô nhập sau khi gửi
        }
    };

    const handleImagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            onSend({ uri: result.assets[0].uri, type: 'image' });
        }
    };

    const handleAudioRecord = async () => {
        try {
            await Audio.requestPermissionsAsync();
            const { recording } = await Audio.Recording.createAsync();
            setRecording(recording);
        } catch (error) {
            console.error('Error recording audio:', error);
        }
    };

    const handleAudioStop = async () => {
        if (recording) {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            onSend({ uri, type: 'audio' });
            setRecording(null);
        }
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <FlatList
                            data={messages}
                            renderItem={({ item }) => (
                                <View
                                    style={[
                                        styles.messageBubble,
                                        item.isUser ? styles.userMessage : styles.friendMessage,
                                    ]}
                                >
                                    <Text style={styles.messageText}>{item.message}</Text>
                                </View>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.messagesContainer}
                            inverted // Để hiển thị tin nhắn mới nhất ở dưới cùng
                        />
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.inputContainer}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                        >
                            {!message && (
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity onPress={handleImagePick} style={styles.iconButton}>
                                        <Ionicons name="image" size={24} color="#007BFF" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={recording ? handleAudioStop : handleAudioRecord} style={styles.iconButton}>
                                        <Ionicons name={recording ? "mic-off" : "mic"} size={24} color="#007BFF" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            <TextInput
                                style={styles.input}
                                placeholder="Nhập tin nhắn..."
                                value={message}
                                onChangeText={setMessage}
                            />
                            <TouchableOpacity onPress={handleSend}>
                                <Text style={styles.sendButton}>Gửi</Text>
                            </TouchableOpacity>

                        </KeyboardAvoidingView>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '95%',
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007BFF',
    },
    messagesContainer: {
        paddingBottom: 20,
    },
    messageBubble: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        maxWidth: '100%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007BFF',
        color: 'white',
    },
    friendMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f1f1f1',
        color: 'black',
    },
    messageText: {
        fontSize: 16,
        color: 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        marginRight: 10,
    },
    sendButton: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    iconButton: {
        padding: 10,
    },
});

export default MessagePopupModal;
