import dayjs from 'dayjs';

export const formatDateRange = (
  from: Date | string,
  to: Date | string
): string => {
  if (!dayjs(from).isValid()) throw new Error('Invalid start date');
  if (!dayjs(to).isValid()) throw new Error('Invalid end date');

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
