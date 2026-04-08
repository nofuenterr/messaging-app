import ArticleTitleContainer from '../../../components/ui/ContentWrapper/_components/_components/ArticleTitleContainer';
import ArticleWrapper from '../../../components/ui/ContentWrapper/_components/ArticleWrapper';
import ContentWrapper from '../../../components/ui/ContentWrapper/ContentWrapper';
import Error from '../../../components/ui/Error';
import UserSideProfile from '../../../components/ui/SideProfile/UserSideProfile/UserSideProfile';
import UsersList from '../../../components/ui/UsersList/UsersList';
import UsersListLoading from '../../../components/ui/UsersListLoading';
import { useSideProfile } from '../../../hooks/useSideProfile';
import { useAdminUsers } from '../admin.queries';

export default function AllUsers() {
  const { data: users, isLoading, isError, error } = useAdminUsers();
  const { sideProfile, toggle } = useSideProfile('user');

  if (isLoading) return <UsersListLoading title="All Users" />;
  if (isError) return <Error message={error?.message} />;

  return (
    <ContentWrapper>
      <ArticleWrapper>
        <ArticleTitleContainer title="All Users" />
        <UsersList
          list={users}
          type="users"
          setSideProfile={(id) => id !== null && toggle(id, 'user')}
        />
      </ArticleWrapper>

      {sideProfile.id !== null && <UserSideProfile userId={sideProfile.id} />}
    </ContentWrapper>
  );
}
