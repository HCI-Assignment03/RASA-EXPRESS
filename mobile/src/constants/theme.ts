// RASA EXPRESS design tokens, taken from the Milestone 02 high-fidelity prototype.
// Orange is the action colour; green, amber and red are used only for status.

export const colors = {
  primary: '#F26B1D',
  primaryDark: '#D95A10',
  primarySoft: '#FDE7D8',
  background: '#FFF8F1',
  surface: '#FFFFFF',
  surfaceMuted: '#F6EDE4',
  text: '#2B2118',
  textMuted: '#7A6A5D',
  border: '#EFE3D6',
  success: '#2E9E5B',
  successSoft: '#E4F4EA',
  warning: '#B7791F',
  warningSoft: '#FFF3D6',
  danger: '#D64545',
  dangerSoft: '#FBE6E6',
  onPrimary: '#FFFFFF',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;

// Nothing below 14 px: Milestone 02 issue U06 (readability for low-vision cooks).
export const fontSize = { caption: 14, body: 16, subtitle: 18, title: 22, heading: 28 } as const;

/** Minimum touch target, in points (Milestone 02 wireframe rule: 44). */
export const minTapSize = 44;

export type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
