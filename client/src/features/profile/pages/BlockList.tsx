import ArticleTitleContainer from '../../../components/ui/ContentWrapper/_components/_components/ArticleTitleContainer';
import ArticleWrapper from '../../../components/ui/ContentWrapper/_components/ArticleWrapper';
import ContentWrapper from '../../../components/ui/ContentWrapper/ContentWrapper';
import Error from '../../../components/ui/Error';
import UserSideProfile from '../../../components/ui/SideProfile/UserSideProfile/UserSideProfile';
import UsersList from '../../../components/ui/UsersList/UsersList';
import UsersListLoading from '../../../components/ui/UsersListLoading';
import { useSideProfile } from '../../../hooks/useSideProfile';
import { useBlockList } from '../../block/block.queries';

export default function BlockList() {
  const { data: blocklist, isLoading, isError, error } = useBlockList();
  const { sideProfile, toggle } = useSideProfile('user');

  if (isLoading) return <UsersListLoading title="Blocked Users" />;
  if (isError) return <Error message={error?.message} />;

  return (
    <ContentWrapper>
      <ArticleWrapper>
        <ArticleTitleContainer title="Blocked Users" />
        {blocklist.length > 0 ? (
          <UsersList
            list={blocklist}
            type="block"
            setSideProfile={(id) => id !== null && toggle(id, 'user')}
          />
        ) : (
          <NoBlockedUsers message="There currently are no blocked users" />
        )}
      </ArticleWrapper>

      {sideProfile.id !== null && <UserSideProfile userId={sideProfile.id} />}
    </ContentWrapper>
  );
}

function NoBlockedUsers({ message }: { message: string }) {
  return (
    <div className="grid flex-1">
      <p className="bg-dark-500 place-self-center rounded-full px-4 py-2 text-xl font-semibold -tracking-tight">
        {message}
      </p>
    </div>
  );
}
