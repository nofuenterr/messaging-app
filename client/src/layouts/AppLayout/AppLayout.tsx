import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

import Error from '../../components/ui/Error';
import Loading from '../../components/ui/Loading';
import { getCurrentUserProfile } from '../../features/user/user.service';

import Sidebar from './Sidebar/Sidebar';

export default function AppLayout() {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: getCurrentUserProfile,
    staleTime: Infinity,
  });

  if (isLoading) return <Loading />;
  if (isError) return <Error message={error?.message} />;

  return (
    <div className="grid h-dvh grid-cols-[auto_1fr]">
      <main className="order-2 flex flex-col">
        <Outlet context={user} />
      </main>
      <Sidebar user={user} />
    </div>
  );
}
