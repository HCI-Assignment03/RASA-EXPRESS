import { cameBackOnSale, menuAlertText, newDishChange } from '../src/utils/menu-alerts';

const onSale = { available: true, portionsLeft: 5 };
const switchedOff = { available: false, portionsLeft: 5 };
const noPortions = { available: false, portionsLeft: 0 };

describe('cameBackOnSale', () => {
  it('is true when a sold-out dish can be ordered again', () => {
    expect(cameBackOnSale(switchedOff, onSale)).toBe(true);
    expect(cameBackOnSale(noPortions, { available: true, portionsLeft: 3 })).toBe(true);
  });

  it('is false when the dish was already on sale', () => {
    expect(cameBackOnSale(onSale, { available: true, portionsLeft: 6 })).toBe(false);
  });

  it('is false when the dish is still sold out', () => {
    expect(cameBackOnSale(switchedOff, { available: false, portionsLeft: 6 })).toBe(false);
    expect(cameBackOnSale(noPortions, { available: true, portionsLeft: 0 })).toBe(false);
  });

  it('is false when the dish goes off sale', () => {
    expect(cameBackOnSale(onSale, switchedOff)).toBe(false);
  });
});

describe('newDishChange', () => {
  it('announces a new dish that can be ordered', () => {
    expect(newDishChange(onSale)).toBe('added');
  });

  it('stays quiet about a new dish with no portions', () => {
    expect(newDishChange(noPortions)).toBeNull();
  });
});

describe('menuAlertText', () => {
  it('names the cook and the dish', () => {
    expect(menuAlertText('added', "Amma's Kitchen", 'Fish ambul thiyal')).toBe(
      "Amma's Kitchen added Fish ambul thiyal to the menu.",
    );
    expect(menuAlertText('back', "Amma's Kitchen", 'Kiribath')).toBe(
      "Kiribath from Amma's Kitchen is back on the menu.",
    );
  });
});
