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
