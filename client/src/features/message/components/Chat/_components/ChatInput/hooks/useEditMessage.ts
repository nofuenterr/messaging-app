import { useLocation, useParams } from 'react-router-dom';

import { useUpdateDirectMessage, useUpdateGroupMessage } from '../../../../../message.queries';
import { useChatInputStore } from '../../../store/useChatInput';
import { useMessageEditStore } from '../../../store/useMessageEdit';

interface UseEditMessageReturn {
  submitEdit: (content: string) => void;
}

export function useEditMessage(): UseEditMessageReturn {
  const editGroupMessage = useUpdateGroupMessage();
  const editDirectMessage = useUpdateDirectMessage();
  const params = useParams();
  const location = useLocation();
  const { editingMessage, clearEditing } = useMessageEditStore();
  const { reset } = useChatInputStore();

  function submitEdit(content: string) {
    if (!editingMessage) return;

    const isGroupConvo = location.pathname.startsWith('/groups');
    const id = Number(params.id);

    const onSuccess = () => {
      clearEditing();
      reset();
    };

    if (isGroupConvo) {
      editGroupMessage.mutate(
        { groupId: id, messageId: editingMessage.message_id, content },
        { onSuccess }
      );
    } else {
      editDirectMessage.mutate(
        { userId: id, messageId: editingMessage.message_id, content },
        { onSuccess }
      );
    }
  }

  return { submitEdit };
}
