import { useState } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = async (_message: string) => {
    // To be implemented
  };

  return {
    messages,
    sendMessage,
  };
};
