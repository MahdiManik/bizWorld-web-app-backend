import React from 'react'
import { View, Text } from 'react-native'
import { Redirect } from 'expo-router'

// This is a fallback that redirects to consultant listing if someone visits /request-consultant directly
export default function RequestConsultantIndex() {
  return <Redirect href="/consultant-request" />
}
