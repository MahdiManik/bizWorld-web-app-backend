import React from 'react'
import { View, TextInput, StyleSheet, Text, Platform } from 'react-native'

type PhoneInputProps = {
  value: string
  onChangeText: (text: string) => void
  error?: string
}

const PhoneInput = ({ value, onChangeText, error }: PhoneInputProps) => {
  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, error && styles.errorBorder]}>
        <View style={styles.countryCodeContainer}>
          <Text style={styles.countryCodeText}>+1</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          returnKeyType="done"
          autoComplete="tel"
          textContentType="telephoneNumber"
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  countryCodeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
    backgroundColor: '#F3F4F6',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 12,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  errorBorder: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
})

export default PhoneInput
