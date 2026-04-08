import { Outlet, useOutletContext } from 'react-router-dom';

import type { User } from '../../../../../../../types/user.types';
import FeatureLayoutWrapper from '../../../../../components/ui/FeatureLayoutWrapper';
import MyProfileNav from '../MyProfileNav';

export default function MyProfileLayout() {
  const user = useOutletContext<User>();

  return (
    <FeatureLayoutWrapper>
      <MyProfileNav />
      <Outlet context={user} />
    </FeatureLayoutWrapper>
  );
}
