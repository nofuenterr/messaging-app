import type { PoolClient } from 'pg';

import type { NoteRow, GetNoteParams, UpsertNoteParams } from '../../types/note.types.js';

import * as noteRepo from './note.repository.js';

export async function getNote(
  { user_id, noted_user_id }: GetNoteParams,
  client?: PoolClient
): Promise<NoteRow | undefined> {
  return noteRepo.getNote({ user_id, noted_user_id }, client);
}

export async function upsertNote({
  user_id,
  noted_user_id,
  content,
}: UpsertNoteParams): Promise<void> {
  const note = await noteRepo.upsertNote({ user_id, noted_user_id, content });

  if (!note) {
    throw new Error('Note not updated');
  }
}
