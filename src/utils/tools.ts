import dayjs from 'dayjs';

export function isDateBeforeNow(date: string | Date): boolean | void {
  if (!dayjs(date).isValid()) {
    throw new Error('Invalid date');
  }
  return dayjs(date).isBefore(new Date());
}

export function isDateBeforeAnotherDate(
  startDate: string | Date,
  endDate: string | Date
): boolean {
  if (!dayjs(startDate).isValid()) throw new Error('Invalid start date');
  if (!dayjs(endDate).isValid()) throw new Error('Invalid end date');

  return dayjs(endDate).isBefore(new Date(startDate));
}

export function isDateAfterAnotherDate(
  startDate: string | Date,
  endDate: string | Date
): boolean {
  if (!dayjs(startDate).isValid()) throw new Error('Invalid start date');
  if (!dayjs(endDate).isValid()) throw new Error('Invalid end date');

  return dayjs(startDate).isAfter(new Date(endDate));
}

export function differenceInDaysBetweenTwoDates(
  startDate: string | Date,
  endDate: string | Date
): number {
  if (!dayjs(startDate).isValid()) throw new Error('Invalid start date');
  if (!dayjs(endDate).isValid()) throw new Error('Invalid end date');

  return dayjs(endDate).diff(startDate, 'days');
}
