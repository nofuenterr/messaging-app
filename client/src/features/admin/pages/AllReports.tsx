import type { Report } from '../../../../../types/report.types';
import ArticleTitleContainer from '../../../components/ui/ContentWrapper/_components/_components/ArticleTitleContainer';
import ArticleWrapper from '../../../components/ui/ContentWrapper/_components/ArticleWrapper';
import ContentWrapper from '../../../components/ui/ContentWrapper/ContentWrapper';
import ScrollArea from '../../../components/ui/ScrollArea';
import GroupSideProfile from '../../../components/ui/SideProfile/GroupSideProfile/GroupSideProfile';
import UserSideProfile from '../../../components/ui/SideProfile/UserSideProfile/UserSideProfile';
import { useSideProfile } from '../../../hooks/useSideProfile';
import { useAdminReports } from '../admin.queries';
import ReportCard from '../components/ReportCard/ReportCard';

export default function AllReports() {
  const { data: reports, isLoading, isError, error } = useAdminReports();
  const { sideProfile, toggle } = useSideProfile('user');

  if (isLoading)
    return (
      <div>
        <p>Loading reports...</p>
      </div>
    );
  if (isError)
    return (
      <div>
        <p>{error?.message}</p>
      </div>
    );

  return (
    <ContentWrapper>
      <ArticleWrapper>
        <ArticleTitleContainer title="All Reports" />
        {reports.length > 0 ? (
          <ScrollArea scrollbarClassName="translate-x-6">
            <ul className="grid gap-8 overflow-y-auto">
              {(reports as Report[]).map((report) => (
                <li key={report.id}>
                  <ReportCard
                    report={report}
                    onToggleProfile={toggle}
                    activeSideProfile={sideProfile}
                  />
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <p>There currently are no reports.</p>
        )}
      </ArticleWrapper>

      {sideProfile.id !== null &&
        (sideProfile.type === 'user' ? (
          <UserSideProfile userId={sideProfile.id} />
        ) : (
          <GroupSideProfile groupId={sideProfile.id} />
        ))}
    </ContentWrapper>
  );
}
