import { gridColumns, gridItemWidth, layoutFor } from '../src/utils/layout';

describe('layoutFor', () => {
  it('describes a phone held upright', () => {
    expect(layoutFor(390, 844)).toEqual({
      landscape: false,
      short: false,
      compact: false,
      wide: false,
    });
  });

  it('describes a phone on its side as landscape, short and wide', () => {
    expect(layoutFor(844, 390)).toEqual({
      landscape: true,
      short: true,
      compact: false,
      wide: true,
    });
  });

  it('marks small phones as compact', () => {
    expect(layoutFor(320, 568).compact).toBe(true);
    expect(layoutFor(360, 800).compact).toBe(false);
  });

  it('describes tablets as wide in both orientations, but never short', () => {
    expect(layoutFor(820, 1180)).toMatchObject({ landscape: false, short: false, wide: true });
    expect(layoutFor(1180, 820)).toMatchObject({ landscape: true, short: false, wide: true });
  });
});

describe('gridColumns', () => {
  it('uses one column on phones, two on wider screens and three on big tablets', () => {
    expect(gridColumns(358)).toBe(1);
    expect(gridColumns(599)).toBe(1);
    expect(gridColumns(600)).toBe(2);
    expect(gridColumns(999)).toBe(2);
    expect(gridColumns(1088)).toBe(3);
  });
});

describe('gridItemWidth', () => {
  it('shares the row between the cards after the gaps', () => {
    expect(gridItemWidth(358, 1, 12)).toBe(358);
    expect(gridItemWidth(700, 2, 12)).toBe(344);
    expect(gridItemWidth(1088, 3, 12)).toBe(354);
  });
});
