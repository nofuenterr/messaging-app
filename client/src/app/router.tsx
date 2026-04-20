import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Loading from '../components/ui/Loading';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import AdminLayout from '../features/admin/components/AdminNav/layout/AdminLayout';
import Login from '../features/auth/pages/Login';
import Signup from '../features/auth/pages/Signup';
import MessagesLayout from '../features/conversation/components/ConversationList/layout/ConversationListLayout';
import GroupLayout from '../features/group/components/GroupNav/layout/GroupLayout';
import MyProfileLayout from '../features/profile/components/MyProfileNav/layout/MyProfileLayout';
import AppLayout from '../layouts/AppLayout/AppLayout';

const Error = lazy(() => import('../components/ui/Error'));


const ChatEmptyState = lazy(() => import('../features/message/pages/ChatEmptyState'));
const DirectMessages = lazy(() => import('../features/conversation/pages/DirectConversation'));
const GroupMessages = lazy(() => import('../features/conversation/pages/GroupConversation'));

const CurrentUserProfile = lazy(() => import('../features/profile/layouts/CurrentUserProfile'));
const CurrentUserFriendList = lazy(() => import('../features/profile/pages/FriendList/FriendList'));
const CurrentUserBlocklist = lazy(() => import('../features/profile/pages/BlockList'));

const AllGroups = lazy(() => import('../features/group/pages/AllGroups'));
const CurrentUserGroups = lazy(() => import('../features/group/pages/CurrentUserGroups'));

const AllUsers = lazy(() => import('../features/admin/pages/AllUsers'));
const AllReports = lazy(() => import('../features/admin/pages/AllReports'));

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* App */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <Suspense fallback={<Loading />}>
                <AppLayout />
              </Suspense>
            }
            errorElement={<Error />}
          >
            <Route errorElement={<Error />}>
              {/* Messages */}
              <Route path="/" element={<MessagesLayout />}>
                <Route index element={<ChatEmptyState />} /> {/* "/" */}
                <Route path="users/:id/messages" element={<DirectMessages />} />
                <Route path="groups/:id/messages" element={<GroupMessages />} />
              </Route>

              {/* Profile */}
              <Route path="users/me" element={<MyProfileLayout />}>
                <Route index element={<CurrentUserProfile />} />
                <Route path="friends" element={<CurrentUserFriendList />} />
                <Route path="blocks" element={<CurrentUserBlocklist />} />
              </Route>

              {/* Groups */}
              <Route path="groups" element={<GroupLayout />}>
                <Route index element={<AllGroups />} />
                <Route path="me" element={<CurrentUserGroups />} />
              </Route>

              {/* Admin */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index path="users" element={<AllUsers />} />
                <Route path="reports" element={<AllReports />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
