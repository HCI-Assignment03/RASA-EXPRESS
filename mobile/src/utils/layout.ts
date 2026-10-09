// Screen-size rules for phones, tablets, portrait and landscape. Pure functions, covered by unit tests.

/** Widest a column of text and forms gets, so lines stay readable on tablets and in landscape. */
export const CONTENT_MAX_WIDTH = 720;

/** Wider limit for screens that lay cards out in a grid (Home) or side by side (sign-in). */
export const WIDE_MAX_WIDTH = 1120;

/** Widest a pop-up sheet gets (decline order, cash sale). */
export const SHEET_MAX_WIDTH = 520;

export type Layout = {
  /** Wider than tall. */
  landscape: boolean;
  /** A short screen: a phone on its side. Big covers and maps are made smaller. */
  short: boolean;
  /** A narrow phone (under 360 points), such as a small Android or an iPhone SE in a split view. */
  compact: boolean;
  /** Room for two columns side by side: a tablet, or a phone in landscape. */
  wide: boolean;
};

export function layoutFor(width: number, height: number): Layout {
  return {
    landscape: width > height,
    short: height < 500,
    compact: width < 360,
    wide: width >= 700,
  };
}

/** How many cards fit in a row: 1 on a phone, 2 on a phone on its side or a small tablet, 3 on a big tablet. */
export function gridColumns(contentWidth: number): 1 | 2 | 3 {
  if (contentWidth >= 1000) return 3;
  if (contentWidth >= 600) return 2;
  return 1;
}

/** The width of one card in a grid row, after the gaps between the cards. */
export function gridItemWidth(contentWidth: number, columns: number, gap: number): number {
  return Math.floor((contentWidth - gap * (columns - 1)) / columns);
}

/**
 * For every `Modal`: on iOS a modal is portrait-only unless it says otherwise, and opening one would
 * turn a phone held sideways back to portrait.
 */
export const ALL_ORIENTATIONS: ('portrait' | 'landscape')[] = ['portrait', 'landscape'];
