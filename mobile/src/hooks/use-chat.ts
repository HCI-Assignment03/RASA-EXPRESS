import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { sendMessage, subscribeToMessages } from '@/services/chat';
import type { ChatMessage, WithId } from '@/types';

/** The chat of one order, live, with a send action for the signed-in user. */
export function useChat(orderId: string) {
  const { user } = useAuth();
  const uid = user?.uid;
  const [messages, setMessages] = useState<WithId<ChatMessage>[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    return subscribeToMessages(
      orderId,
      (next) => {
        setMessages(next);
        setError('');
      },
      () => setError('Could not load the chat. Check your connection.'),
    );
  }, [orderId]);

  return {
    messages,
    error,
    /** The id of the signed-in user, to tell their messages from the other person's. */
    myId: uid ?? '',
    send: async (text: string) => {
      if (uid && text.trim().length > 0) await sendMessage(orderId, uid, text);
    },
  };
}
