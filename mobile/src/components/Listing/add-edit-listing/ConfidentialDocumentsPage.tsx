import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'
import tw from '@/lib/tailwind'
import { Document } from '@/../types/document'

type ConfidentialDocumentsPageProps = {
  documents: Document[]
  setDocuments: (documents: Document[]) => void
  isEditMode?: boolean
}

export const ConfidentialDocumentsPage = ({
  documents,
  setDocuments,
  isEditMode = false,
}: ConfidentialDocumentsPageProps) => {
  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      })

      if (result.canceled) {
        return
      }

      const newDoc = {
        id: Date.now().toString(),
        name: result.assets[0].name,
        uri: result.assets[0].uri,
        type: result.assets[0].mimeType || 'application/pdf',
      }

      setDocuments([...documents, newDoc])
    } catch (error) {
      console.log('Error picking document:', error)
    }
  }

  const handleRemoveDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
  }

  const renderEmptyState = () => (
    <TouchableOpacity
      style={tw`border-2 border-dashed border-gray-300 rounded-md p-8 items-center justify-center`}
      onPress={handleUpload}>
      <View style={tw`bg-gray-100 rounded-full p-4 mb-2`}>
        <Feather name="file" size={24} color="#1e40af" />
      </View>
      <Text style={tw`text-blue-800 font-medium text-center`}>Click here</Text>
      <Text style={tw`text-gray-500 text-center`}>to upload media</Text>
      <Text style={tw`text-gray-400 text-xs mt-1 text-center`}>
        (Max. File size: 25 MB)
      </Text>
    </TouchableOpacity>
  )

  const renderDocumentList = () => (
    <View style={tw`border-2 border-dashed border-gray-300 rounded-md p-4`}>
      <View style={tw`flex-row flex-wrap`}>
        {documents.map((doc) => (
          <View key={doc.id} style={tw`w-1/2 p-1`}>
            <View style={tw`bg-blue-50 rounded-md p-2 relative`}>
              <TouchableOpacity
                style={tw`absolute right-1 top-1 z-10`}
                onPress={() => handleRemoveDocument(doc.id)}>
                <Feather name="x" size={20} color="#4b5563" />
              </TouchableOpacity>
              <View style={tw`items-center justify-center`}>
                <View style={tw`bg-white rounded-md p-2 mb-1`}>
                  <View style={tw`bg-red-500 rounded-sm px-1 py-0.5 mb-1`}>
                    <Text style={tw`text-white text-xs font-bold`}>PDF</Text>
                  </View>
                  <Feather name="file" size={24} color="#9ca3af" />
                </View>
              </View>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={tw`w-full mt-4 flex-row items-center justify-center`}
          onPress={handleUpload}>
          <Feather name="upload" size={20} color="#1e40af" />
          <Text style={tw`text-blue-800 font-medium ml-2`}>Upload file</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <ScrollView style={tw`flex-1 px-4`}>
      <Text style={tw`text-xl font-bold mt-4 mb-6`}>
        Confidential Documents
      </Text>

      {documents.length === 0 ? renderEmptyState() : renderDocumentList()}

      {/* Add some space at the bottom */}
      <View style={tw`h-24`} />
    </ScrollView>
  )
}
