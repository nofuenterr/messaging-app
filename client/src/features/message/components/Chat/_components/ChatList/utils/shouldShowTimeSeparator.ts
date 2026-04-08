import type { Message } from '../../../../../../../../../types/message.types';

export function shouldShowTimeSeparator(
  current: Message,
  previous: Message | undefined,
  thresholdMs = 5 * 60 * 1000
): boolean {
  if (!previous) return true;
  return new Date(current.sent_at).getTime() - new Date(previous.sent_at).getTime() > thresholdMs;
}
