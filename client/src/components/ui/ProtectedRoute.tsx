import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { queryClient } from '../../api/queryClient';
import { checkAuth } from '../../utils/auth';

import Loading from './Loading';

export default function ProtectedRoute() {
  const cachedUser = queryClient.getQueryData(['users', 'me']);
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>(
    cachedUser ? 'auth' : 'loading'
  );

  useEffect(() => {
    if (cachedUser) return;
    checkAuth().then((ok) => setStatus(ok ? 'auth' : 'unauth'));
  }, []);

  if (status === 'loading') return <Loading />;
  if (status === 'unauth') return <Navigate to="/auth/login" replace />;
  return <Outlet />;
}
