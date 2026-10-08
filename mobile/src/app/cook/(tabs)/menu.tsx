import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useToast } from '@/components/toast';
import { colors, fontSize, spacing } from '@/constants/theme';
import { DishFormModal, NEW_DISH_FORM } from '@/features/cook/dish-form-modal';
import { MenuDishCard } from '@/features/cook/menu-dish-card';
import { useMenu } from '@/hooks/use-menu';
import type { Dish, WithId } from '@/types';
import { sortMenu } from '@/utils/dish';
import { dishToForm, type DishInput } from '@/utils/dish-form';

// S3 Menu manager.
// Create: add a dish. Read: the cook's dishes. Update: sold-out switch, portions left, edit details.
// Delete: delete a dish.
export default function MenuManagerScreen() {
  const toast = useToast();
  const menu = useMenu();

  // null = form closed, 'new' = adding, otherwise the dish being edited.
  const [editing, setEditing] = useState<'new' | WithId<Dish> | null>(null);
  const [saving, setSaving] = useState(false);

  const failed = () => toast.show('Could not save the change. Check your connection.', 'error');

  const save = async (input: DishInput) => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing === 'new') {
        await menu.add(input);
        toast.show('Dish added to your menu', 'success');
      } else {
        // Editing never switches a dish back on: that stays the cook's choice on the card.
        await menu.edit(editing.id, {
          ...input,
          available: editing.available && input.portionsLeft > 0,
        });
        toast.show('Dish updated', 'success');
      }
      setEditing(null);
    } catch {
      failed();
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailable = (dish: WithId<Dish>, available: boolean) => {
    if (available && dish.portionsLeft <= 0) {
      toast.show('Add some portions first, then switch it on.', 'info');
      return;
    }
    menu.setAvailable(dish.id, available).catch(failed);
  };

  const changePortions = (dish: WithId<Dish>, next: number) => {
    // Going from 0 portions back up puts the dish on sale again.
    menu.setPortions(dish.id, next, dish.portionsLeft === 0).catch(failed);
  };

  const confirmDelete = (dish: WithId<Dish>) => {
    Alert.alert('Delete this dish?', `${dish.name} will be removed from your menu.`, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          menu
            .remove(dish.id)
            .then(() => toast.show('Dish deleted', 'success'))
            .catch(failed);
        },
      },
    ]);
  };

  const onSale = menu.dishes.filter((dish) => dish.available && dish.portionsLeft > 0).length;

  return (
    <Screen scroll>
      <Text style={styles.title}>Menu</Text>
      <Text style={styles.subtitle}>
        {menu.loading
          ? 'Loading your dishes...'
          : `${menu.dishes.length} ${menu.dishes.length === 1 ? 'dish' : 'dishes'}, ${onSale} on sale today`}
      </Text>

      <Button title="Add dish" icon="add" onPress={() => setEditing('new')} />

      {menu.loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : null}

      {menu.error ? (
        <Message text={menu.error}>
          <Button title="Try again" icon="refresh" onPress={menu.reload} />
        </Message>
      ) : null}

      {!menu.loading && !menu.error && menu.dishes.length === 0 ? (
        <Message text="You have no dishes yet. Tap Add dish to create your first one." />
      ) : null}

      {sortMenu(menu.dishes).map((dish) => (
        <MenuDishCard
          key={dish.id}
          dish={dish}
          onToggleAvailable={(available) => toggleAvailable(dish, available)}
          onChangePortions={(next) => changePortions(dish, next)}
          onEdit={() => setEditing(dish)}
          onDelete={() => confirmDelete(dish)}
        />
      ))}

      <DishFormModal
        visible={editing !== null}
        title={editing === 'new' ? 'Add dish' : 'Edit dish'}
        initial={editing && editing !== 'new' ? dishToForm(editing) : NEW_DISH_FORM}
        saving={saving}
        onSave={save}
        onClose={() => setEditing(null)}
      />
    </Screen>
  );
}

function Message({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <Card style={styles.message}>
      <Text style={styles.body}>{text}</Text>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: fontSize.heading, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSize.body, color: colors.textMuted },
  loader: { paddingVertical: spacing.xl },
  message: { gap: spacing.md },
  body: { fontSize: fontSize.body, color: colors.text },
});
