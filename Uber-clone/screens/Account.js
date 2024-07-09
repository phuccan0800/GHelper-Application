import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AccountButton from '../components/AccountButton'

export default class Account extends Component {
  render() {
    return (
      <SafeAreaView>
        <Text>Account</Text>
        <AccountButton />
      </SafeAreaView>
    )
  }
}