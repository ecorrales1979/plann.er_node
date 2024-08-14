import { isDateBeforeNow } from './tools';

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
