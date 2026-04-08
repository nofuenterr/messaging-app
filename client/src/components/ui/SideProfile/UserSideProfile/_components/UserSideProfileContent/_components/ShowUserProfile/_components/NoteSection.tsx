import { isAxiosError } from 'axios';
import { useState, type SubmitEvent } from 'react';

import type { UserProfile } from '../../../../../../../../../../../types/user.types';
import { useUpsertNote } from '../../../../../../../../../features/note/note.queries';

interface NoteServerErrors {
  content?: string;
}

export default function NoteSection({
  userId,
  note,
}: {
  userId: number;
  note: UserProfile['note'];
}) {
  const [content, setContent] = useState<string>(note?.content ?? '');

  const editNote = useUpsertNote(userId);

  const serverErrors = isAxiosError(editNote.error)
    ? (editNote.error.response?.data?.errors as NoteServerErrors)
    : undefined;

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    editNote.mutate({ content });
  }

  return (
    <section className="bg-dark-500 grid gap-2 rounded-lg px-3 py-2">
      <h5 className="font-semibold">Note: (only visible to you)</h5>
      <form onSubmit={handleSubmit} className="grid gap-2">
        <div className="grid gap-1">
          <textarea
            autoComplete="off"
            spellCheck={false}
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={255}
            className="hover:bg-dark-400 w-full rounded-md"
          ></textarea>
          {serverErrors?.content && (
            <p className="text-danger text-start text-sm">{serverErrors.content}</p>
          )}
        </div>

        {content !== (note?.content ?? '') && (
          <div className="flex items-center gap-1.5 justify-self-end text-sm font-medium">
            <button
              type="button"
              onClick={() => setContent(note?.content ?? '')}
              className="bg-info hover:bg-info-hover cursor-pointer rounded-md px-2 py-1"
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-success hover:bg-success-hover cursor-pointer rounded-md px-2 py-1"
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
