import dayjs from 'dayjs';

export function isDateBeforeNow(date: string | Date): boolean {
  return dayjs(date).isBefore(new Date());
}

export function isDateBeforeAnotherDate(
  startDate: string | Date,
  endDate: string | Date
): boolean {
  return dayjs(endDate).isBefore(new Date(startDate));
}
