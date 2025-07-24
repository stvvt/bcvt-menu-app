import { useFormatter } from 'next-intl';

const FormatDate = ({ date }: { date: Date }) => {
  const format = useFormatter();
  return format.dateTime(date, { dateStyle: 'long' });
};

export default FormatDate;