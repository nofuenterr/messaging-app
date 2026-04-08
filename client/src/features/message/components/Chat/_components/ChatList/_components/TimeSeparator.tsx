import { format, isToday, isYesterday, differenceInDays } from 'date-fns';

// TimeSeparator - always centered with lines
export default function TimeSeparator({ date }: { date: string }) {
  const d = new Date(date);
  let label: string;

  if (isToday(d)) {
    label = `Today at ${format(d, 'h:mm a')}`;
  } else if (isYesterday(d)) {
    label = `Yesterday at ${format(d, 'h:mm a')}`;
  } else if (differenceInDays(new Date(), d) < 7) {
    label = format(d, `EEEE 'at' h:mm a`);
  } else {
    label = format(d, `MMM d, yyyy 'at' h:mm a`);
  }

  return (
    <div className="my-4 flex w-full items-center gap-3">
      <hr className="border-dark-500 flex-1" />
      <span className="text-light-700 shrink-0 text-xs font-medium">{label}</span>
      <hr className="border-dark-500 flex-1" />
    </div>
  );
}
