import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ContentWrapper from '../../../components/ui/ContentWrapper/ContentWrapper';
import GroupSideProfile from '../../../components/ui/SideProfile/GroupSideProfile/GroupSideProfile';
import UserSideProfile from '../../../components/ui/SideProfile/UserSideProfile/UserSideProfile';
import { useSideProfile } from '../../../hooks/useSideProfile';
import ChatContainer from '../../message/components/Chat/ChatContainer';
import { useCreateDirectMessage, useDirectMessages } from '../../message/message.queries';
import { useUserProfile } from '../../user/user.queries';
import ConversationLoading from '../components/ConversationLoading';

export default function DirectConversation() {
  const params = useParams();
  const userId = params.id ? Number(params.id) : undefined;
  const { sideProfile, setSideProfile, toggle } = useSideProfile('user', userId!);

  useEffect(() => {
    if (userId !== undefined) {
      setSideProfile({ id: userId, type: 'user' });
    }
  }, [userId, setSideProfile]);

  const createMessage = useCreateDirectMessage(userId!);

  const {
    data: messagesData,
    isLoading: messagesLoading,
    isError: messagesError,
    error: messagesErr,
  } = useDirectMessages(userId!);

  const {
    data: profile,
    isLoading: userLoading,
    isError: userError,
    error: userErr,
  } = useUserProfile(userId!);

  if (messagesLoading || userLoading) return <ConversationLoading />;

  if (messagesError || userError) {
    return (
      <ContentWrapper>
        <p className="flex-1 place-self-center text-center text-xl font-semibold text-balance">
          {messagesErr?.message ?? userErr?.message}
        </p>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <ChatContainer
        isBlocked={profile.user.is_blocked}
        avatar_color={profile.user.avatar_color}
        avatar_url={profile.user.avatar_url}
        conversation_name={profile.user.display_name ?? profile.user.username}
        messages={messagesData.messages}
        createMessage={createMessage}
        conversation_type={messagesData?.conversation?.conversation_type}
        onToggleProfile={toggle}
        activeSideProfile={sideProfile}
      />
      {sideProfile.id !== null &&
        (sideProfile.type === 'user' ? (
          <UserSideProfile userId={sideProfile.id} />
        ) : (
          <GroupSideProfile groupId={sideProfile.id} />
        ))}
    </ContentWrapper>
  );
}
