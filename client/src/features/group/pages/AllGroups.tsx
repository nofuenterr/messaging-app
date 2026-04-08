import type { Group } from '../../../../../types/group.types';
import ArticleTitleContainer from '../../../components/ui/ContentWrapper/_components/_components/ArticleTitleContainer';
import ArticleWrapper from '../../../components/ui/ContentWrapper/_components/ArticleWrapper';
import ContentWrapper from '../../../components/ui/ContentWrapper/ContentWrapper';
import Error from '../../../components/ui/Error';
import ScrollArea from '../../../components/ui/ScrollArea';
import GroupSideProfile from '../../../components/ui/SideProfile/GroupSideProfile/GroupSideProfile';
import { useSideProfile } from '../../../hooks/useSideProfile';
import GroupCard from '../components/GroupCard';
import GroupsLoadingPage from '../components/GroupsLoadingPage';
import { useGroups } from '../group.queries';

export default function AllGroups() {
  const { data: groups, isLoading, isError, error } = useGroups();
  const { sideProfile, toggle } = useSideProfile('group');

  if (isLoading) return <GroupsLoadingPage title="All Groups" />;
  if (isError) return <Error message={error?.message} />;

  return (
    <ContentWrapper>
      <ArticleWrapper>
        <ArticleTitleContainer title="All Groups" />
        {groups.length > 0 ? (
          <ScrollArea scrollbarClassName="translate-x-6">
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4 overflow-y-auto">
              {(groups as Group[]).map((group) => (
                <GroupCard
                  key={group.group_id}
                  group={group}
                  onClick={() => toggle(group.group_id, 'group')}
                />
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <EmptyGroups message="There currently are no groups" />
        )}
      </ArticleWrapper>

      {sideProfile.id !== null && <GroupSideProfile groupId={sideProfile.id} />}
    </ContentWrapper>
  );
}

function EmptyGroups({ message }: { message: string }) {
  return (
    <div className="grid flex-1">
      <p className="bg-dark-500 place-self-center rounded-full px-4 py-2 text-xl font-semibold -tracking-tight">
        {message}
      </p>
    </div>
  );
}
