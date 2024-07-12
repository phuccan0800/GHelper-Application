import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import AccountButton from '../components/AccountButton'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Account = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem('userData')
      setUser(JSON.parse(userData))
    }
    getUser()
  }, [])

  return (
    <SafeAreaView>
      <Text>{user.firstName} {user.lastName}</Text>
      <AccountButton />
    </SafeAreaView>
  )
}

export default Account