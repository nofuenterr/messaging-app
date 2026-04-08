import { Navigate, Outlet, useOutletContext } from 'react-router-dom';

import type { User } from '../../../../../../../types/user.types';
import FeatureLayoutWrapper from '../../../../../components/ui/FeatureLayoutWrapper';
import AdminNav from '../AdminNav';

export default function AdminLayout() {
  const user = useOutletContext<User>();

  if (!user) return <Navigate to="/login" replace />;
  if (user.user_role !== 'admin') return <Navigate to="/" replace />;

  return (
    <FeatureLayoutWrapper>
      <AdminNav />
      <Outlet />
    </FeatureLayoutWrapper>
  );
}
