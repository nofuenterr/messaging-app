import { format } from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { GroupDetail } from '../../../../../../types/group.types';
import { useGroup, useJoinGroup, useLeaveGroup } from '../../../../features/group/group.queries';
import EditIcon from '../../../icons/EditIcon';
import MessageIcon from '../../../icons/MessageIcon';
import AvatarContainer from '../../AvatarContainer';
import IconButtonRounded from '../../IconButtonRounded';
import ScrollArea from '../../ScrollArea';
import TooltipComponent from '../../Tooltip';
import SideProfileLoading from '../_components/SideProfileLoading';
import SideProfileWrapper from '../_components/SideProfileWrapper';

import JoinGroupIcon from './_components/JoinGroupIcon';
import LeaveGroupDialog from './_components/LeaveGroupDialog';
import LeaveGroupIcon from './_components/LeaveGroupIcon';
import ManageGroupDialog from './_components/ManageGroupDialog/ManageGroupDialog';
import MembersSection from './_components/MembersSection';

interface GroupSideProfileProps {
  groupId: number;
}

export default function GroupSideProfile({ groupId }: GroupSideProfileProps) {
  const { data: group, isLoading, isError, error } = useGroup(groupId);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [manage, setManage] = useState<boolean>(false);
  const navigate = useNavigate();
  const leaveGroup = useLeaveGroup();
  const joinGroup = useJoinGroup();

  if (isLoading) return <SideProfileLoading />;
  if (isError)
    return (
      <SideProfileWrapper>
        <p className="flex-1 place-content-center text-center text-xl font-semibold text-balance">
          {error.message}
        </p>
      </SideProfileWrapper>
    );

  const { info, members, membership } = group as GroupDetail;

  const groupCreatedAt = format(info.group_created, 'MMM d, y');
  const memberLabel: string = members.length === 1 ? '1 member' : `${members.length} members`;
  const isMember = !!membership && !membership.left_at;
  const isOwnerOrAdmin =
    membership?.membership_role === 'owner' || membership?.membership_role === 'admin';

  return (
    <SideProfileWrapper>
      <div className="shrink-0">
        <div
          className="relative grid h-30 content-start justify-end bg-cover bg-center bg-no-repeat p-4"
          style={{
            backgroundColor: info.group_avatar_color,
            backgroundImage: `url(${info.group_banner_url})`,
          }}
        >
          <div className="flex items-center gap-2">
            <TooltipComponent content="Message">
              <IconButtonRounded
                className="bg-dark-600/60 hover:bg-dark-600/55"
                onClick={() => navigate(`/groups/${info.group_id}/messages`)}
              >
                <MessageIcon className="group-hover:*:fill-light-900 size-5" />
              </IconButtonRounded>
            </TooltipComponent>

            {isOwnerOrAdmin && (
              <TooltipComponent
                content="Manage Group"
                open={tooltipOpen && !manage}
                onOpenChange={(open) => !manage && setTooltipOpen(open)}
              >
                <ManageGroupDialog
                  key={info.group_id}
                  manage={manage}
                  onClose={() => setManage(false)}
                  group={group}
                >
                  <IconButtonRounded
                    className="bg-dark-600/60 hover:bg-dark-600/55"
                    onClick={() => {
                      setTooltipOpen(false);
                      setManage(true);
                    }}
                  >
                    <EditIcon />
                  </IconButtonRounded>
                </ManageGroupDialog>
              </TooltipComponent>
            )}

            {isMember ? (
              <TooltipComponent content="Leave Group">
                <LeaveGroupDialog onLeave={() => leaveGroup.mutate(groupId)}>
                  <IconButtonRounded className="bg-dark-600/60 hover:bg-dark-600/55">
                    <LeaveGroupIcon />
                  </IconButtonRounded>
                </LeaveGroupDialog>
              </TooltipComponent>
            ) : (
              <TooltipComponent content="Join Group">
                <IconButtonRounded
                  className="bg-dark-600/60 hover:bg-dark-600/55"
                  onClick={() => joinGroup.mutate(groupId)}
                >
                  <JoinGroupIcon />
                </IconButtonRounded>
              </TooltipComponent>
            )}
          </div>

          <AvatarContainer
            avatarUrl={info.group_avatar_url}
            avatarColor={info.group_avatar_color}
            alt={`${info.group_name}'s avatar`}
            className="border-dark-600 absolute inset-s-4 -inset-be-12 size-24 border-4"
          />
        </div>

        <header className="mt-10 overflow-hidden p-4">
          <h4 className="line-clamp-2 overflow-hidden text-2xl font-bold wrap-break-word whitespace-normal">
            {info.group_name}
          </h4>
          <p className="mt-1 font-medium">{memberLabel}</p>
          {info.group_description && (
            <pre className="mt-4 line-clamp-3 overflow-hidden text-wrap wrap-break-word whitespace-normal">
              {info.group_description}
            </pre>
          )}
        </header>
      </div>

      <ScrollArea>
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto px-4 pb-4">
          <section className="bg-dark-500 grid rounded-lg px-3 py-2">
            <h5 className="font-semibold">Established since:</h5>
            <p>{groupCreatedAt}</p>
          </section>

          <MembersSection members={members} memberLabel={memberLabel} />
        </div>
      </ScrollArea>
    </SideProfileWrapper>
  );
}
