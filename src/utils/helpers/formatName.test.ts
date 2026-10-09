import { formatMealTypeName } from './formatName';

describe('formatMealTypeName', () => {
  it('replaces underscores with spaces', () => {
    expect(formatMealTypeName('morning_snack')).toBe('morning snack');
  });

  it('leaves display names alone and tolerates empty input', () => {
    expect(formatMealTypeName('Breakfast')).toBe('Breakfast');
    expect(formatMealTypeName(undefined as unknown as string)).toBe('');
  });
});
