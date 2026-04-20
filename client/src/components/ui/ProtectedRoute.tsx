import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { checkAuth } from '../../utils/auth';

import Loading from './Loading';

export default function ProtectedRoute() {
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>('loading');

  useEffect(() => {
    checkAuth().then((ok) => setStatus(ok ? 'auth' : 'unauth'));
  }, []);

  if (status === 'loading') return <Loading />;
  if (status === 'unauth') return <Navigate to="/auth/login" replace />;
  return <Outlet />;
}
