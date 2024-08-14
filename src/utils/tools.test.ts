import { isDateBeforeAnotherDate, isDateBeforeNow } from './tools';

describe('Test isDateBeforeNow function', () => {
  it('Should return true if date is before now', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-08-14'));
    const result = isDateBeforeNow(new Date('2024-07-01'));
    expect(result).toBeTruthy();
  });

  it('Should return false if date is after now', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-08-14'));
    const result = isDateBeforeNow(new Date('2024-09-01'));
    expect(result).toBeFalsy();
  });

  it('Should be possible to use a date as string', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-08-14'));
    const result = isDateBeforeNow('2024-08-01');
    expect(result).toBeTruthy();
  });

  it('Should throw if param can not be converted to a date', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-08-14'));
    expect(() => isDateBeforeNow('invalid date format')).toThrow();
  });
});

describe('Test isDateBeforeAnotherDate function', () => {
  it('Should return true if date is before another date', () => {
    const result = isDateBeforeAnotherDate(
      new Date('2024-08-14'),
      new Date('2024-08-01')
    );
    expect(result).toBeTruthy();
  });

  it('Should return false if date is after another date', () => {
    const result = isDateBeforeAnotherDate(
      new Date('2024-08-14'),
      new Date('2024-08-21')
    );
    expect(result).toBeFalsy();
  });

  it('Should be possible to use dates as string', () => {
    const result = isDateBeforeAnotherDate('2024-08-14', '2024-08-01');
    expect(result).toBeTruthy();
  });

  it('SHould throw if a param can not be converted to a date', () => {
    expect(() => isDateBeforeAnotherDate('invalid date', '2024-08-01')).toThrow(
      'Invalid start date'
    );
    expect(() => isDateBeforeAnotherDate('2024-08-01', 'invalid date')).toThrow(
      'Invalid end date'
    );
  });
});
