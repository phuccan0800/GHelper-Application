import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

const styles = StyleSheet.create({
    ...DefaultTheme,
    safeArea: {
        flex: 1,
    },

    normalText: {
        fontSize: 16,
        color: 'black',
    },

    header: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },

    keyboardContainer: {
        flex: 1,
    },

    headerTitle: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },

    tab: {
        padding: 12,
        flex: 1,
        alignItems: 'center',
    },

    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#CCCCCC',
    },

    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#CCCCCC',
    },

    activeTab: {
        borderBottomWidth: 2,
        borderColor: '#6200EE',
    },

    tabText: {
        fontSize: 16,
        color: '#333',
    },

    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerContentText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,

    },

    change_language: {
        height: 40,
        width: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 5,
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
        paddingHorizontal: 10,
    },

    inputContainer: {
        minWidth: 300,
        width: '100%',
        alignItems: 'center',
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
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
        width: '93%',
        borderColor: '#ccc',
        fontSize: 15,
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },

    inputFocused: {
        borderBottomColor: 'blue',
        borderBottomWidth: 2,
    },
    historyButton: {
        fontSize: 16,
        color: '#007bff', // Màu xanh lam cho nút Lịch sử
    },
    tabText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
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
        borderRadius: 5, // Độ bo góc
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
        borderRadius: 5,
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

    // Search Button
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },

    searchText: {
        borderColor: '#D3D3D3',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        flex: 1,
        marginRight: 8,
    },

    searchButton: {
        backgroundColor: '#D3D3D3',
        padding: 8,
        borderRadius: 8,
    },

    searchButtonIcon: {
        width: 24,
        height: 24,
    },

    categoryContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    categoryImage: {
        width: 48,
        height: 48,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 8,
    },
});

export default styles;
