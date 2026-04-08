import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import type { GroupDetail } from '../../../../../types/group.types';
import ContentWrapper from '../../../components/ui/ContentWrapper/ContentWrapper';
import GroupSideProfile from '../../../components/ui/SideProfile/GroupSideProfile/GroupSideProfile';
import UserSideProfile from '../../../components/ui/SideProfile/UserSideProfile/UserSideProfile';
import { useSideProfile } from '../../../hooks/useSideProfile';
import { useGroup } from '../../group/group.queries';
import ChatContainer from '../../message/components/Chat/ChatContainer';
import { useCreateGroupMessage, useGroupMessages } from '../../message/message.queries';
import ConversationLoading from '../components/ConversationLoading';

export default function GroupConversation() {
  const params = useParams();
  const groupId = params.id ? Number(params.id) : undefined;
  const { sideProfile, setSideProfile, toggle } = useSideProfile('group', groupId);

  useEffect(() => {
    if (groupId !== undefined) {
      setSideProfile({ id: groupId, type: 'group' });
    }
  }, [groupId, setSideProfile]);

  const createMessage = useCreateGroupMessage(groupId!);

  const {
    data: messagesData,
    isLoading: messagesLoading,
    isError: messagesError,
    error: messagesErr,
  } = useGroupMessages(groupId!);

  const {
    data: group,
    isLoading: groupLoading,
    isError: groupError,
    error: groupErr,
  } = useGroup(groupId!);

  if (messagesLoading || groupLoading) return <ConversationLoading />;

  if (messagesError || groupError) {
    return (
      <ContentWrapper>
        <p className="flex-1 place-self-center text-center text-xl font-semibold text-balance">
          {messagesErr?.message ?? groupErr?.message}
        </p>
      </ContentWrapper>
    );
  }

  const { info, members, membership } = group as GroupDetail;
  const memberLabel = members.length === 1 ? '1 member' : `${members.length} members`;

  return (
    <ContentWrapper>
      <ChatContainer
        avatar_color={info.group_avatar_color}
        avatar_url={info.group_avatar_url}
        conversation_name={info.group_name}
        messages={messagesData.messages}
        conversation_type={messagesData.conversation.conversation_type}
        isMember={!!membership && membership.left_at === null}
        createMessage={createMessage}
        activeSideProfile={sideProfile}
        onToggleProfile={toggle}
        memberLabel={memberLabel}
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
