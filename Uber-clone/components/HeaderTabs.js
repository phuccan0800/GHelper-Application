import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HeaderTabs() {
    return (
        <View style={{
            // flexDirection: "row", 
            alignSelf: "center",
        }}>
            <Text></Text>
            <HeaderButton Text="Test Button" />
            <HeaderButton Text="Test Button 2" />
            {/* HeaderButton */}
        </View>
    )
}

const HeaderButton = (props) => (
    <View >
        <TouchableOpacity
            style={{
                backgroundColor: "black",
                paddingHorizontal: 16,
                paddingVertical: 5,
                borderRadius: 30
            }}>
            <Text style={{
                color: "white",

            }}> {props.Text}</Text>
        </TouchableOpacity>
    </View>

)
