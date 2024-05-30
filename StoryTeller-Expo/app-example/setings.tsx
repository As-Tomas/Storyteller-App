import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

export default function settings() {
  return (
    <View>
      <Text>settings</Text>
      <Link href="/"> Navigate to home</Link>
    </View>
  )
}

const styles = StyleSheet.create({})