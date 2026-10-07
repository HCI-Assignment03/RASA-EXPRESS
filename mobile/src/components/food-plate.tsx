import { View } from 'react-native';

type Props = {
  size?: number;
};

// Colours of the plate illustration used in the Milestone 02 prototype.
const RICE = '#FBF1DC';
const YELLOW = '#F5B301';
const GREEN = '#4C9A2A';
const BROWN = '#B5532A';

/**
 * A drawn plate of rice and curry, used wherever a dish or cook photo would go.
 * The app has no photos yet (Dish.photoUrl is empty), exactly like the prototype.
 */
export function FoodPlate({ size = 96 }: Props) {
  const dot = (color: string, diameter: number, left: number, top: number) => (
    <View
      style={{
        position: 'absolute',
        width: size * diameter,
        height: size * diameter,
        borderRadius: size * diameter,
        backgroundColor: color,
        left: size * left,
        top: size * top,
      }}
    />
  );

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#FFFFFF',
        borderWidth: size * 0.05,
        borderColor: '#F3E3D3',
      }}
    >
      {dot(RICE, 0.34, 0.1, 0.16)}
      {dot(YELLOW, 0.2, 0.52, 0.12)}
      {dot(GREEN, 0.2, 0.14, 0.52)}
      {dot(BROWN, 0.3, 0.46, 0.42)}
    </View>
  );
}
