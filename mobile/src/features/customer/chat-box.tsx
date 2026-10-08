import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useToast } from '@/components/toast';
import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import { useChat } from '@/hooks/use-chat';

const MAX_LENGTH = 200;

/** The chat between the customer and the rider on C6. Create: send a message. */
export function ChatBox({ orderId, riderName }: { orderId: string; riderName: string }) {
  const toast = useToast();
  const chat = useChat(orderId);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (text.trim().length === 0) return;
    setSending(true);
    try {
      await chat.send(text);
      setText('');
    } catch {
      toast.show('Could not send the message. Try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Chat with {riderName}</Text>

      {chat.error ? <Text style={styles.error}>{chat.error}</Text> : null}
      {chat.messages.length === 0 && !chat.error ? (
        <Text style={styles.empty}>No messages yet. Say hello to your rider.</Text>
      ) : null}

      <View style={styles.messages}>
        {chat.messages.slice(-30).map((message) => {
          const mine = message.senderId === chat.myId;
          return (
            <View key={message.id} style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              <Text style={[styles.text, mine && styles.textMine]}>{message.text}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          accessibilityLabel="Message to the rider"
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          placeholderTextColor={colors.textMuted}
          maxLength={MAX_LENGTH}
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send message"
          accessibilityState={{ disabled: sending || text.trim().length === 0 }}
          disabled={sending || text.trim().length === 0}
          onPress={send}
          style={[styles.send, (sending || text.trim().length === 0) && styles.sendDisabled]}
        >
          <Ionicons name="send" size={20} color={colors.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: spacing.md },
  title: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  error: { fontSize: fontSize.caption, color: colors.danger },
  empty: { fontSize: fontSize.body, color: colors.textMuted },
  messages: { gap: spacing.sm },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.surfaceMuted },
  text: { fontSize: fontSize.body, color: colors.text },
  textMine: { color: colors.onPrimary },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: fontSize.body,
    color: colors.text,
  },
  send: {
    width: minTapSize,
    height: minTapSize,
    borderRadius: minTapSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  sendDisabled: { opacity: 0.4 },
});
