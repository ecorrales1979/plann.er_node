import { formatDateRange } from './formatters';

describe('Test formatDateRange function', () => {
  it('Should format dates on the same month', () => {
    const date1 = '2024-01-09';
    const date2 = '2024-01-15';

    const formattedRange = formatDateRange(date1, date2);

    expect(formattedRange).toEqual('January 9 - 15, 2024');
  });

  it('Should format dates on different months but same year', () => {
    const date1 = '2024-01-09';
    const date2 = '2024-02-15';

    const formattedRange = formatDateRange(date1, date2);

    expect(formattedRange).toEqual('January 9 - February 15, 2024');
  });

  it('Should format dates on different years', () => {
    const date1 = '2024-12-29';
    const date2 = '2025-01-05';

    const formattedRange = formatDateRange(date1, date2);

    expect(formattedRange).toEqual('December 29, 2024 - January 5, 2025');
  });

  it('Should throw if one date is not valid', () => {
    expect(() => formatDateRange('invalid date', '2024-01-01')).toThrow();
    expect(() => formatDateRange('2024-01-01', 'invalid date')).toThrow();
  });
});
