// lib/ui/PhotoGrid.tsx
import React from 'react';
import { View, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { spacing, Radii } from '@theme';

const GAP = spacing(1);
const SIZE = (Dimensions.get('window').width - spacing(4) - GAP * 2) / 3;

type Item = { id: string; uri: string };
type Props = {
  items: Item[];
  onPress?: (id: string) => void;
};

export default function PhotoGrid({ items, onPress }: Props) {
  return (
    <View style={styles.grid}>
      {items.map((it) => (
        <Pressable key={it.id} onPress={() => onPress?.(it.id)} style={styles.cell}>
          <Image source={{ uri: it.uri }} style={styles.img} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  cell: {
    width: SIZE,
    height: SIZE,
    borderRadius: Radii.md,
    overflow: 'hidden',
    backgroundColor: '#E9ECF2',
  },
  img: { width: '100%', height: '100%' },
});
