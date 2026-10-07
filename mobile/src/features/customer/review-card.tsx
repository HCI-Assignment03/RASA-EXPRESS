import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import { StarRating } from '@/components/star-rating';
import { colors, fontSize, spacing } from '@/constants/theme';
import type { Review, WithId } from '@/types';
import { formatDate } from '@/utils/format';

type Props = {
  review: WithId<Review>;
};

/** One customer review on the C3 Reviews tab. The customer's name is not shown. */
export function ReviewCard({ review }: Props) {
  const overall = (review.food + review.hygiene + review.delivery) / 3;
  const date = review.createdAt ? formatDate(review.createdAt.toDate()) : 'Just now';

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <StarRating value={overall} size={18} />
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={styles.scores}>
        Food {review.food} · Hygiene {review.hygiene} · Delivery {review.delivery}
      </Text>
      {review.comment ? <Text style={styles.comment}>{review.comment}</Text> : null}
      {review.tags.length > 0 ? (
        <View style={styles.tags}>
          {review.tags.map((tag) => (
            <Badge key={tag} label={tag} tone="neutral" />
          ))}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  date: { fontSize: fontSize.caption, color: colors.textMuted },
  scores: { fontSize: fontSize.caption, color: colors.textMuted },
  comment: { fontSize: fontSize.body, color: colors.text },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
