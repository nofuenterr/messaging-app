import { useLocation, useParams } from 'react-router-dom';

import type { Message } from '../../../../../../../../../types/message.types';
import { useDeleteDirectMessage, useDeleteGroupMessage } from '../../../../../message.queries';

interface UseDeleteMessageReturn {
  deleteMessage: (message: Message) => void;
}

export function useDeleteMessage(): UseDeleteMessageReturn {
  const deleteGroupMessage = useDeleteGroupMessage();
  const deleteDirectMessage = useDeleteDirectMessage();
  const params = useParams();
  const location = useLocation();

  function deleteMessage(message: Message) {
    const isGroupConvo = location.pathname.startsWith('/groups');
    const id = Number(params.id);

    if (isGroupConvo) {
      deleteGroupMessage.mutate({ groupId: id, messageId: message.message_id });
    } else {
      deleteDirectMessage.mutate({ userId: id, messageId: message.message_id });
    }
  }

  return { deleteMessage };
}
