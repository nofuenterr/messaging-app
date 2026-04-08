import { Outlet } from 'react-router-dom';

import FeatureLayoutWrapper from '../../../../../components/ui/FeatureLayoutWrapper';
import GroupNav from '../GroupNav';

export default function GroupLayout() {
  return (
    <FeatureLayoutWrapper>
      <GroupNav />
      <Outlet />
    </FeatureLayoutWrapper>
  );
}
