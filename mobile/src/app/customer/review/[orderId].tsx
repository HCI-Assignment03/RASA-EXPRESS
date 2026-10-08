import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { useToast } from '@/components/toast';
import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import { StarInput } from '@/features/customer/star-input';
import { useCook } from '@/hooks/use-cooks';
import { useOrder } from '@/hooks/use-order';
import { useReview } from '@/hooks/use-review';
import type { Order, Review, WithId } from '@/types';
import {
  COMMENT_MAX_LENGTH,
  REVIEW_TAGS,
  validateReview,
  type ReviewErrors,
} from '@/utils/reviews';
import { canReview } from '@/utils/tracking';

// C7 Rate & review.
// Create: rate a delivered order. Read: your own review of it. Update: edit it. Delete: delete it.
export default function ReviewScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const orderState = useOrder(orderId);
  const reviewState = useReview(orderId);

  if (orderState.loading || reviewState.loading) {
    return (
      <Screen edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </Screen>
    );
  }

  const error = orderState.error || reviewState.error;
  if (error || !orderState.order) {
    return (
      <Screen edges={['top', 'bottom']}>
        <Card style={styles.card}>
          <Text style={styles.body}>{error || 'This order could not be found.'}</Text>
          {error ? (
            <Button
              title="Try again"
              icon="refresh"
              onPress={() => {
                orderState.reload();
                reviewState.reload();
              }}
            />
          ) : null}
          <Button title="Go back" variant="ghost" onPress={() => router.back()} />
        </Card>
      </Screen>
    );
  }

  if (!canReview(orderState.order.status)) {
    return (
      <Screen edges={['top', 'bottom']}>
        <BackRow title="Rate your order" />
        <Card style={styles.card}>
          <Text style={styles.body}>You can rate an order once it has been delivered.</Text>
          <Button title="Go back" variant="ghost" onPress={() => router.back()} />
        </Card>
      </Screen>
    );
  }

  return (
    <ReviewForm
      key={reviewState.review?.id ?? 'new'}
      order={orderState.order}
      existing={reviewState.review}
      save={reviewState.save}
      remove={reviewState.remove}
    />
  );
}

type FormProps = {
  order: WithId<Order>;
  existing: WithId<Review> | null;
  save: ReturnType<typeof useReview>['save'];
  remove: ReturnType<typeof useReview>['remove'];
};

function ReviewForm({ order, existing, save, remove }: FormProps) {
  const toast = useToast();
  const { cook } = useCook(order.cookId);

  const [food, setFood] = useState(existing?.food ?? 0);
  const [hygiene, setHygiene] = useState(existing?.hygiene ?? 0);
  const [delivery, setDelivery] = useState(existing?.delivery ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? '');
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [errors, setErrors] = useState<ReviewErrors>({});
  const [busy, setBusy] = useState<'save' | 'delete' | null>(null);

  const toggleTag = (tag: string) =>
    setTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );

  const submit = async () => {
    const input = { food, hygiene, delivery, comment: comment.trim(), tags };
    const found = validateReview(input);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy('save');
    try {
      await save(order, input);
      toast.show(existing ? 'Review updated' : 'Thank you for your review!', 'success');
      router.back();
    } catch {
      toast.show('Could not save your review. Check your connection.', 'error');
      setBusy(null);
    }
  };

  const confirmDelete = () => {
    Alert.alert('Delete your review?', 'It will be removed from the cook page and their rating.', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setBusy('delete');
          try {
            await remove();
            toast.show('Review deleted', 'success');
            router.back();
          } catch {
            toast.show('Could not delete the review. Check your connection.', 'error');
            setBusy(null);
          }
        },
      },
    ]);
  };

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <BackRow title={existing ? 'Your review' : 'Rate your order'} />
      <Text style={styles.muted}>How was the food from {cook?.displayName ?? 'your cook'}?</Text>

      <Card style={styles.card}>
        <StarInput
          label="Food"
          value={food}
          onChange={(stars) => {
            setFood(stars);
            setErrors((e) => ({ ...e, food: undefined }));
          }}
          error={errors.food}
        />
        <StarInput
          label="Hygiene"
          value={hygiene}
          onChange={(stars) => {
            setHygiene(stars);
            setErrors((e) => ({ ...e, hygiene: undefined }));
          }}
          error={errors.hygiene}
        />
        <StarInput
          label="Delivery"
          value={delivery}
          onChange={(stars) => {
            setDelivery(stars);
            setErrors((e) => ({ ...e, delivery: undefined }));
          }}
          error={errors.delivery}
        />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.section}>What stood out?</Text>
        <View style={styles.tags}>
          {REVIEW_TAGS.map((tag) => {
            const selected = tags.includes(tag);
            return (
              <Pressable
                key={tag}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => toggleTag(tag)}
                style={[styles.tag, selected && styles.tagSelected]}
              >
                <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{tag}</Text>
              </Pressable>
            );
          })}
        </View>
        <TextField
          label="Comment (optional)"
          value={comment}
          onChangeText={(text) => {
            setComment(text);
            setErrors((e) => ({ ...e, comment: undefined }));
          }}
          error={errors.comment}
          maxLength={COMMENT_MAX_LENGTH}
          multiline
          placeholder="Tell others about the meal"
        />
        <Text style={styles.counter}>
          {comment.length} / {COMMENT_MAX_LENGTH}
        </Text>
      </Card>

      <Button
        title={existing ? 'Save changes' : 'Submit review'}
        icon="checkmark"
        loading={busy === 'save'}
        disabled={busy === 'delete'}
        onPress={submit}
      />
      {existing ? (
        <Button
          title="Delete review"
          variant="danger"
          loading={busy === 'delete'}
          disabled={busy === 'save'}
          onPress={confirmDelete}
        />
      ) : null}
    </Screen>
  );
}

function BackRow({ title }: { title: string }) {
  return (
    <View style={styles.topRow}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => router.back()}
        style={styles.back}
      >
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { paddingVertical: spacing.xl },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  back: { width: minTapSize, height: minTapSize, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: fontSize.heading, fontWeight: '800', color: colors.text },
  card: { gap: spacing.md },
  section: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  body: { fontSize: fontSize.body, color: colors.text },
  muted: { fontSize: fontSize.body, color: colors.textMuted },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: {
    minHeight: minTapSize,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tagSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  tagText: { fontSize: fontSize.body, color: colors.text },
  tagTextSelected: { fontWeight: '700', color: colors.primaryDark },
  counter: { alignSelf: 'flex-end', fontSize: fontSize.caption, color: colors.textMuted },
});
