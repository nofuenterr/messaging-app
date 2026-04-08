import type { Friendship, FriendshipStatus } from '../../../../../../../types/friendship.types';
import ScrollArea from '../../../../../components/ui/ScrollArea';

import SubSection from './SubSection';

interface DirectionalSectionProps {
  incoming: Friendship[];
  outgoing: Friendship[];
  status: Extract<FriendshipStatus, 'pending' | 'declined'>;
  onToggle: (id: number) => void;
}

export default function DirectionalSection({
  incoming,
  outgoing,
  status,
  onToggle,
}: DirectionalSectionProps) {
  if (!incoming.length && !outgoing.length) return null;

  return (
    <ScrollArea scrollbarClassName="translate-x-6">
      <section className="min-h-0 flex-1 overflow-y-auto">
        {incoming.length > 0 && (
          <SubSection
            list={incoming}
            heading="Received"
            status={status}
            direction="incoming"
            onToggle={onToggle}
          />
        )}
        {outgoing.length > 0 && (
          <SubSection
            list={outgoing}
            heading="Sent"
            status={status}
            direction="outgoing"
            onToggle={onToggle}
          />
        )}
      </section>
    </ScrollArea>
  );
}
