import type { ConversationWithLatestMessage } from '../../../../../../types/message.types';
import type { User } from '../../../../../../types/user.types';
import NavSectionWrapper from '../../../../components/ui/NavSection/NavSectionWrapper';
import { useConversationsWithLatestMessage } from '../../conversation.queries';
import ConversationItem from '../ConversationItem';

interface ConversationListProps {
  user: User;
}

export default function ConversationList({ user }: ConversationListProps) {
  const { data: conversations, isLoading, isError, error } = useConversationsWithLatestMessage();

  if (isLoading) {
    return (
      <section className="bg-dark-900 flex h-dvh min-h-0 w-90 flex-1 flex-col gap-6 px-6 py-8">
        <h1 className="text-2xl font-semibold">Messages</h1>

        <nav>
          <ul className="grid gap-3">
            <li className="bg-dark-600 h-18 rounded-full"></li>
            <li className="bg-dark-600 h-18 rounded-full"></li>
            <li className="bg-dark-600 h-18 rounded-full"></li>
            <li className="bg-dark-600 h-18 rounded-full"></li>
            <li className="bg-dark-600 h-18 rounded-full"></li>
            <li className="bg-dark-600 h-18 rounded-full"></li>
            <li className="bg-dark-600 h-18 rounded-full"></li>
            <li className="bg-dark-600 h-18 rounded-full"></li>
            <li className="bg-dark-600 h-18 rounded-full"></li>
            <li className="bg-dark-600 h-18 rounded-full"></li>
          </ul>
        </nav>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bg-dark-900 grid h-dvh min-h-0 w-90 flex-1 place-content-center px-6 py-8">
        <h1 className="text-center text-xl font-semibold text-balance">{error?.message}</h1>
      </section>
    );
  }

  return (
    <NavSectionWrapper title="Messages">
      {(conversations as ConversationWithLatestMessage[]).map((convo) => (
        <ConversationItem key={convo.conversation_id} convo={convo} user={user} />
      ))}
    </NavSectionWrapper>
  );
}
