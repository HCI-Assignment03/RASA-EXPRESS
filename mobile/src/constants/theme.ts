// RASA EXPRESS design tokens, taken from the Milestone 02 high-fidelity prototype.
// Orange is the action colour; green, amber and red are used only for status.

export const colors = {
  primary: '#F26B1D',
  primaryDark: '#D95A10',
  primarySoft: '#FDE7D8',
  coverPeach: '#FBE3CC',
  background: '#FFF8F1',
  surface: '#FFFFFF',
  surfaceMuted: '#F6EDE4',
  text: '#2B2118',
  textMuted: '#7A6A5D',
  border: '#EFE3D6',
  /** Track of a switch that is off. Darker than `border` so it can be seen on a white card. */
  switchOff: '#BFB2A5',
  success: '#2E9E5B',
  successSoft: '#E4F4EA',
  warning: '#B7791F',
  warningSoft: '#FFF3D6',
  danger: '#D64545',
  dangerSoft: '#FBE6E6',
  onPrimary: '#FFFFFF',
  /** Star ratings. */
  star: '#F5B301',
  /** See-through white for the decorative circles and chips on orange panels. */
  onPrimarySoft: 'rgba(255, 255, 255, 0.18)',
  onPrimaryFaint: 'rgba(255, 255, 255, 0.10)',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 8, md: 12, lg: 18, xl: 24, pill: 999 } as const;

/**
 * Soft, warm shadows. Cards float on the cream background instead of having hard borders.
 * `boxShadow` works the same on Android and iOS (React Native new architecture).
 */
export const shadow = {
  card: { boxShadow: '0px 4px 16px rgba(122, 62, 16, 0.08)' },
  raised: { boxShadow: '0px 8px 20px rgba(217, 90, 16, 0.28)' },
  bar: { boxShadow: '0px -4px 18px rgba(122, 62, 16, 0.08)' },
} as const;

// Nothing below 14 px: Milestone 02 issue U06 (readability for low-vision cooks).
export const fontSize = { caption: 14, body: 16, subtitle: 18, title: 22, heading: 28 } as const;

/** Minimum touch target, in points (Milestone 02 wireframe rule: 44). */
export const minTapSize = 44;

export type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
