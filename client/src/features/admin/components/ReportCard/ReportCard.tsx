import { format } from 'date-fns';

import type { Report } from '../../../../../../types/report.types';
import Nameplate from '../../../../components/ui/Nameplate';
import type { ProfileType } from '../../../../hooks/useSideProfile';
import { useResolveReport, useReviewReport } from '../../admin.queries';

import ReportActionButton from './_components/ReportActionButton';
import TargetSection from './_components/TargetSection';

interface ReportCardProps {
  report: Report;
  onToggleProfile: (id: number, type: ProfileType) => void;
  activeSideProfile: { id: number | null; type: ProfileType };
}

export default function ReportCard({ report, onToggleProfile }: ReportCardProps) {
  const reportedAt = format(report.reported_at, 'MMM d, y');
  const review = useReviewReport(report.id);
  const resolve = useResolveReport(report.id);

  return (
    <article className="border-light-500 grid gap-5 rounded-xl border p-6">
      <h4 className="text-2xl text-gray-400">#{report.id}</h4>

      <div className="justify-self-start rounded-lg bg-gray-700 px-2 py-1.5">
        <p className="text-md font-medium capitalize">{report.report_status}</p>
      </div>

      {report.reporter_id && (
        <Nameplate
          avatar_color={report.reporter_avatar_color ?? ''}
          avatar_url={report.reporter_avatar_url ?? ''}
          name={report.reporter_display_name ?? report.reporter_username ?? ''}
          subname={report.reporter_username ?? undefined}
          onClick={() => onToggleProfile(report.reporter_id!, 'user')}
        />
      )}

      <div className="mr-auto">
        <p className="text-xl font-medium">Reason: {report.reason}</p>
        <p className="opacity-80">Reported: {reportedAt}</p>
      </div>

      <hr className="text-light-500" />

      <div className="px-4">
        {report.target_username && (
          <TargetSection title="Reported User">
            <Nameplate
              avatar_color={report.target_avatar_color ?? ''}
              avatar_url={report.target_avatar_url ?? ''}
              name={report.target_display_name ?? report.target_username}
              subname={report.target_username}
              onClick={() => onToggleProfile(report.target_user_id!, 'user')}
            />
          </TargetSection>
        )}

        {report.target_group_name && (
          <TargetSection title="Reported Group">
            <Nameplate
              avatar_color={report.target_group_avatar_color ?? ''}
              avatar_url={report.target_group_avatar_url ?? ''}
              name={report.target_group_name}
              onClick={() => onToggleProfile(report.target_group_id!, 'group')}
            />
          </TargetSection>
        )}

        {report.target_message_content && (
          <TargetSection title="Reported Message">
            <p className="text-xl font-medium">{report.target_message_content}</p>
          </TargetSection>
        )}
      </div>

      <div className="flex items-center gap-4">
        {report.report_status === 'open' && <ReportActionButton text="Review" mutation={review} />}
        {report.report_status !== 'resolved' && (
          <ReportActionButton text="Resolve" mutation={resolve} />
        )}
      </div>
    </article>
  );
}
