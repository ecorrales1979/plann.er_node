import dayjs from 'dayjs';
import { ClientError } from '../errors/client-error';

export const formatDateRange = (
  from: Date | string,
  to: Date | string
): string => {
  if (!dayjs(from).isValid()) throw new ClientError('Invalid start date', 409);
  if (!dayjs(to).isValid()) throw new ClientError('Invalid end date', 409);

  const startDate = dayjs(from);
  const endDate = dayjs(to);
  const formats = {
    sameMonth: `${startDate.format('MMMM D')} - ${endDate.format('D, YYYY')}`,
    sameYear: `${startDate.format('MMMM D')} - ${endDate.format(
      'MMMM D, YYYY'
    )}`,
    differentYears: `${startDate.format('MMMM D, YYYY')} - ${endDate.format(
      'MMMM D, YYYY'
    )}`,
  };

  if (startDate.isSame(endDate, 'month')) return formats.sameMonth;

  if (startDate.isSame(endDate, 'year')) return formats.sameYear;

  return formats.differentYears;
};
