import pool from '../../config/database.js';

export async function getNote({ user_id, noted_user_id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
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

export async function upsertNote({ user_id, noted_user_id, content }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `
      SELECT *
      FROM user_note
      WHERE user_id = $1
        AND noted_user_id = $2
      LIMIT 1;
      `,
      [user_id, noted_user_id]
    );

    const note = rows.length > 0;

    let new_note;

    if (note) {
      const { rows } = await client.query(
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
      const { rows } = await client.query(
        `
        INSERT INTO user_note (
          user_id,
          noted_user_id,
          content
        )
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
