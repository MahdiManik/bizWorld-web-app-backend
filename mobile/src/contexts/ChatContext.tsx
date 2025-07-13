/* eslint-disable no-unused-vars */
import React, { createContext, useState, useContext, ReactNode } from 'react'
import { ChatUser } from '@/components/Chat/ChatUserList'

interface ChatContextType {
  selectedUser: ChatUser | null
  setSelectedUser: (user: ChatUser | null) => void
  isInChatConversation: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)

  const value = {
    selectedUser,
    setSelectedUser,
    isInChatConversation: selectedUser !== null,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
