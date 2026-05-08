import { useState } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState<any[]>([]);

  const sendMessage = async (message: string) => {
    // To be implemented
  };

  return {
    messages,
    sendMessage
  };
};
