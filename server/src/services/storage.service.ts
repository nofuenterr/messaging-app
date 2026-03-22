import path from 'path';

import { supabase } from '../config/supabase.js';

export async function uploadUserAvatar({ user_id, file }) {
  const filePath = `images/users/avatar/${user_id}-${Date.now()}${path.extname(file.originalname)}`;

  const { error } = await supabase.storage.from('uploads').upload(filePath, file.buffer, {
    contentType: file.mimetype,
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);

  return data.publicUrl;
}

export async function uploadGroupAvatar({ group_id, file }) {
  const filePath = `images/groups/avatar/${group_id}-${Date.now()}${path.extname(file.originalname)}`;

  const { error } = await supabase.storage.from('uploads').upload(filePath, file.buffer, {
    contentType: file.mimetype,
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);

  return data.publicUrl;
}
