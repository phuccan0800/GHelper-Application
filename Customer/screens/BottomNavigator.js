import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import Home from './Home'
import Activity from './Activity/Activity'
import Payment from './Payment'
import Message from './Message'
import Account from './Account'

import { translate } from '../translator/translator';

const Tab = createBottomTabNavigator()
const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        elevation: 0,
        height: 80,
        background: "#ffffff",
    }
}

export default function BottomNavigator() {
    return (

        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <AntDesign name="home" size={24} color={focused ? "#16247d" : "black"} />
                                <Text style={{ fontSize: 12, color: focused ? "#16247d" : "black" }}>{translate('Home')}</Text>
                            </View>
                        )
                    }
                }}
            />
            <Tab.Screen
                name="Activity"
                component={Activity}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Feather name="activity" size={24} color={focused ? "#16247d" : "black"} />
                                <Text style={{ fontSize: 12, color: "#16247d" }}>{translate('Order')}</Text>
                            </View>
                        )
                    }
                }} />
            <Tab.Screen name="Message" component={Message}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <AntDesign name="message1" size={24} color={focused ? "#16247d" : "black"} />
                                <Text style={{ fontSize: 12, color: "#16247d" }}>{translate('Message')}</Text>
                            </View>
                        )
                    }
                }} />
            <Tab.Screen
                name="Payment"
                component={Payment}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <MaterialIcons name="payment" size={24} color={focused ? "#16247d" : "black"} />
                                <Text style={{ fontSize: 12, color: "#16247d" }}>{translate('Payment')}</Text>
                            </View>
                        )
                    }
                }}
            />
            <Tab.Screen name="Account" component={Account}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <MaterialIcons name="manage-accounts" size={24} color={focused ? "#16247d" : "black"} />
                                <Text style={{ fontSize: 12, color: "#16247d" }}>{translate('Account')}</Text>
                            </View>
                        )
                    }
                }} />
        </Tab.Navigator>

    )
}
