import dayjs from 'dayjs';
import { ClientError } from '../errors/client-error';

export function isDateBeforeNow(date: string | Date): boolean | void {
  if (!dayjs(date).isValid()) {
    throw new ClientError('Invalid date', 409);
  }
  return dayjs(date).isBefore(new Date());
}

export function isDateBeforeAnotherDate(
  startDate: string | Date,
  endDate: string | Date
): boolean {
  if (!dayjs(startDate).isValid())
    throw new ClientError('Invalid start date', 409);
  if (!dayjs(endDate).isValid()) throw new ClientError('Invalid end date', 409);

  return dayjs(endDate).isBefore(new Date(startDate));
}

export function isDateAfterAnotherDate(
  startDate: string | Date,
  endDate: string | Date
): boolean {
  if (!dayjs(startDate).isValid())
    throw new ClientError('Invalid start date', 409);
  if (!dayjs(endDate).isValid()) throw new ClientError('Invalid end date', 409);

  return dayjs(startDate).isAfter(new Date(endDate));
}

export function differenceInDaysBetweenTwoDates(
  startDate: string | Date,
  endDate: string | Date
): number {
  if (!dayjs(startDate).isValid())
    throw new ClientError('Invalid start date', 409);
  if (!dayjs(endDate).isValid()) throw new ClientError('Invalid end date', 409);

  return dayjs(endDate).diff(startDate, 'days');
}
