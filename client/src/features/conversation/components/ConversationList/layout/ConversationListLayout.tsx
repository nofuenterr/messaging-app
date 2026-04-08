import { Outlet, useOutletContext } from 'react-router-dom';

import type { User } from '../../../../../../../types/user.types';
import FeatureLayoutWrapper from '../../../../../components/ui/FeatureLayoutWrapper';
import ConversationList from '../ConversationList';

export default function MessageLayout() {
  const user = useOutletContext<User>();

  return (
    <FeatureLayoutWrapper>
      <ConversationList user={user} />
      <Outlet context={user} />
    </FeatureLayoutWrapper>
  );
}
