import { AlertDialog } from 'radix-ui';
import type { ReactNode } from 'react';

import AlertDialogCancelButton from '../../../../components/ui/AlertDialogCancelButton';
import AlertDialogConfirmButton from '../../../../components/ui/AlertDialogConfirmButton';
import DialogCloseButton from '../../../../components/ui/DialogCloseButton';

interface LogoutDialogProps {
  children: ReactNode;
  onLogout: () => void;
  disabled: boolean;
}

export default function LogoutDialog({ children, onLogout, disabled }: LogoutDialogProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-dark-900/50 fixed inset-0 z-100 grid content-start overflow-y-auto duration-150" />

        <AlertDialog.Content className="bg-dark-500 border-dark-400 fixed top-1/2 left-1/2 z-100 grid max-h-[85vh] w-full max-w-120 -translate-1/2 gap-2 overflow-y-auto rounded-2xl border p-6 duration-150 focus:outline-none">
          <AlertDialog.Title className="mt-4 text-2xl font-bold">Confirm Logout</AlertDialog.Title>

          <AlertDialog.Description className="text-light-700 font-medium">
            Are you sure you want to logout?
          </AlertDialog.Description>

          <div className="mt-6 flex items-center justify-between gap-4">
            <AlertDialog.Cancel asChild>
              <span>
                <AlertDialogCancelButton />
              </span>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild onClick={onLogout} disabled={disabled}>
              <span>
                <AlertDialogConfirmButton />
              </span>
            </AlertDialog.Action>
          </div>

          <AlertDialog.Cancel asChild>
            <span>
              <DialogCloseButton />
            </span>
          </AlertDialog.Cancel>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
