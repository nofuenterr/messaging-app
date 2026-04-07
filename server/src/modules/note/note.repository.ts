import type { PoolClient } from 'pg';

import pool from '../../config/database.js';
import type { NoteRow, GetNoteParams, UpsertNoteParams } from '../../types/note.types.js';

export async function getNote(
  { user_id, noted_user_id }: GetNoteParams,
  client?: PoolClient
): Promise<NoteRow | undefined> {
  const db = client ?? pool;

  const { rows } = await db.query<NoteRow>(
    `
    SELECT *
    FROM user_note
    WHERE user_id = $1
      AND noted_user_id = $2
    LIMIT 1;
    `,
    [user_id, noted_user_id]
  );

  return rows[0];
}

export async function upsertNote({
  user_id,
  noted_user_id,
  content,
}: UpsertNoteParams): Promise<Pick<NoteRow, 'user_id' | 'noted_user_id'> | undefined> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query<NoteRow>(
      `
      SELECT *
      FROM user_note
      WHERE user_id = $1
        AND noted_user_id = $2
      LIMIT 1;
      `,
      [user_id, noted_user_id]
    );

    const noteExists = rows.length > 0;
    let new_note: Pick<NoteRow, 'user_id' | 'noted_user_id'> | undefined;

    if (noteExists) {
      const { rows } = await client.query<Pick<NoteRow, 'user_id' | 'noted_user_id'>>(
        `
        UPDATE user_note
        SET content = $3
        WHERE user_id = $1
          AND noted_user_id = $2
        RETURNING user_id, noted_user_id;
        `,
        [user_id, noted_user_id, content]
      );

      new_note = rows[0];
    } else {
      const { rows } = await client.query<Pick<NoteRow, 'user_id' | 'noted_user_id'>>(
        `
        INSERT INTO user_note (user_id, noted_user_id, content)
        VALUES ($1, $2, $3)
        RETURNING user_id, noted_user_id;
        `,
        [user_id, noted_user_id, content]
      );

      new_note = rows[0];
    }

    await client.query('COMMIT');

    return new_note;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
