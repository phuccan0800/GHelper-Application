import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

const styles = StyleSheet.create({
    ...DefaultTheme,

    change_language: {
        height: 40,
        width: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        marginBottom: 10
    },
    change_language_text: {
        color: 'black',
        textAlign: 'center',
        marginTop: 10,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },

    inputContainer: {
        width: '100%',
        alignItems: 'center',
    },

    title: {
        marginTop: 200,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    // input 
    inputLogin: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },

    input: {
        height: 40,
        width: '80%',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    // input: {
    //     height: 40,
    //     width: 100,
    //     fontSize: 18,
    //     width: '100%',
    //     borderColor: 'gray',
    //     borderWidth: 0,
    //     marginBottom: 10,
    //     paddingHorizontal: 10,
    //     // borderBottomWidth: 1,
    //     // borderBottomColor: 'black',
    // },
    inputFocused: {
        borderBottomColor: 'blue',
        borderBottomWidth: 2,
    },

    button: {
        backgroundColor: 'whiteblue',
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'right',
        justifyContent: 'right',
        width: '80%',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
    buttonPrimary: {
        backgroundColor: '#3B82F6', // Màu nền
        borderRadius: 99999, // Độ bo góc
        paddingHorizontal: 24, // Khoảng cách giữa biên và text
        paddingVertical: 10, // Chiều cao
        shadowColor: '#2563EB', // Màu shadow
        shadowOpacity: 0.3, // Độ trong suốt của shadow
        shadowOffset: { width: 0, height: 2 }, // Kích thước shadow
        shadowRadius: 4, // Bán kính shadow
        elevation: 3, // Độ đổ bóng trên Android
        flexDirection: 'row', // Hướng dòng
        alignItems: 'center', // Căn chỉnh item theo chiều cao của nó
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    },
    textButtonPrimary: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        color: '#FFFFFF',
    },
    buttonTetriary: {
        marginTop: 20,
        borderRadius: 9999,
        paddingHorizontal: 8,
        paddingVertical: 6.5,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    textButtonTetriary: {
        fontSize: 14,
        fontWeight: 'bold',
        // textTransform: 'uppercase',
        color: '#3B82F6',
    },
    buttonSpacing: {
        marginTop: 10,
    },

    error: {
        color: 'red',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default styles;
