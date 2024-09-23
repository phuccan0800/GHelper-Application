import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { Ionicons, AntDesign } from '@expo/vector-icons'

const MessageScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.topBar, styles.area, { paddingBottom: 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Tin nhắn</Text>
                <View style={styles.rightButtons}>
                    <TouchableOpacity >
                        <AntDesign name="questioncircleo" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text>MessageScreen</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    area: {
        marginHorizontal: 15,
    },
    normalText: {
        color: 'white',
        fontSize: 18,
        marginHorizontal: 15,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rightButtons: {
        flexDirection: 'row',
    },
})
export default MessageScreen