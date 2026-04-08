import { isToday, isYesterday, format } from 'date-fns';

export default function formatTime(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = diffMs / 60000;

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${Math.floor(diffMins)}m ago`;
  if (isToday(d)) return format(d, 'h:mm a');
  if (isYesterday(d)) return 'Yesterday';
  if (diffMs < 7 * 24 * 60 * 60 * 1000) return format(d, 'EEE'); // "Mon"
  return format(d, 'MM/dd/yy');
}
