import * as noteRepo from './note.repository.js';

export async function getNote({ user_id, noted_user_id }) {
  const note = await noteRepo.getNote({ user_id, noted_user_id });

  return note;
}

export async function upsertNote({ user_id, noted_user_id, content }) {
  const note = await noteRepo.upsertNote({ user_id, noted_user_id, content });

  if (!note) {
    throw new Error('Note not updated');
  }

  return note;
}
