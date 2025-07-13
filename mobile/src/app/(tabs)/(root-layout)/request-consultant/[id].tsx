import React from 'react'
import { useLocalSearchParams } from 'expo-router/build/hooks'
import RequestConsultantForm from '@/components/Consautants/ConsultantRequestForm'

export default function RequestConsultantScreen() {
  const params = useLocalSearchParams()

  const id = params.id as string
  const name = params.name as string

  console.log('Request Consultant Screen Params:', { id, name })

  return (
    <RequestConsultantForm
      navigation={{
        goBack: () => {
          const { router } = require('expo-router')
          router.back()
        },
      }}
      route={{
        params: {
          consultantId: id,
          consultantName: decodeURIComponent(name || ''),
        },
      }}
    />
  )
}
