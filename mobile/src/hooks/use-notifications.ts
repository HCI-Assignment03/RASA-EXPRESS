import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import {
  markNotificationsRead,
  setNotificationRead,
  subscribeToNotifications,
} from '@/services/notifications';
import type { AppNotification, WithId } from '@/types';

/** The signed-in customer's alerts, newest first, live. */
export function useNotifications() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [notifications, setNotifications] = useState<WithId<AppNotification>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!uid) return;
    return subscribeToNotifications(
      uid,
      (next) => {
        setNotifications(next);
        setError('');
        setLoading(false);
      },
      () => {
        setError('Could not load your alerts. Check your connection and try again.');
        setLoading(false);
      },
    );
  }, [uid, attempt]);

  const unread = notifications.filter((notification) => !notification.read);

  const reload = () => {
    setLoading(true);
    setError('');
    setAttempt((count) => count + 1);
  };

  return {
    notifications,
    unreadCount: unread.length,
    loading,
    error,
    reload,
    markRead: (id: string, read = true) => setNotificationRead(id, read),
    markAllRead: () => markNotificationsRead(unread.map((notification) => notification.id)),
  };
}
