export interface NoteRow {
  user_id: number;
  noted_user_id: number;
  noted: Date;
  content: string | null;
}

export interface GetNoteParams {
  user_id: number;
  noted_user_id: number;
}

export interface UpsertNoteParams {
  user_id: number;
  noted_user_id: number;
  content: string;
}
