import DeleteIcon from '../../../../../components/icons/DeleteIcon';
import { useDeleteUser } from '../../../../../features/admin/admin.queries';
import IconButtonRounded from '../../../IconButtonRounded';
import TooltipComponent from '../../../Tooltip';

import DeleteUserDialog from './_components/DeleteUserDialog';

export default function AdminActions({
  userId,
  displayName,
}: {
  userId: number;
  displayName: string;
}) {
  const deleteUser = useDeleteUser();

  return (
    <TooltipComponent content="Delete">
      <div onClick={(e) => e.stopPropagation()}>
        <DeleteUserDialog
          onDelete={() => {
            deleteUser.mutate(userId);
          }}
          userToDelete={displayName}
        >
          <IconButtonRounded>
            <DeleteIcon />
          </IconButtonRounded>
        </DeleteUserDialog>
      </div>
    </TooltipComponent>
  );
}
