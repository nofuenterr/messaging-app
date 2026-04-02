import { hash } from 'bcryptjs';

import pool from '../../config/database.js';
import { ADMIN_PASSWORD } from '../../config/env.js';

async function seed() {
  try {
    console.log('Seeding database...');

    const hashedPassword = await hash(ADMIN_PASSWORD || '@dm1nUs3r', 10);

    // Admin Account (idempotent)
    await pool.query(
      `
      INSERT INTO users (username, password_hash, bio, user_role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO UPDATE
        SET password = EXCLUDED.password,
            user_role = 'admin';
      `,
      ['One Autumn Leaf', hashedPassword, 'Administrator account', 'admin']
    );

    // Users
    await pool.query(
      `
      INSERT INTO users
      (created, display_name, username, pronouns, bio, password_hash, avatar_color, user_role)
      VALUES
      ('2024-01-01','Alice','alice','she/her','Frontend dev','H@$hxxx1','#ff6b6b','admin'),
      ('2024-01-02','Bob','bob','he/him','Backend dev','H@$hxxx2','#4dabf7','admin'),
      ('2024-01-03','Charlie','charlie',NULL,'Coffee addict','H@$hxxx3','#69db7c','user'),
      ('2024-01-04','Diana','diana','she/her','Designer','H@$hxxx4','#ffd43b','user'),
      ('2024-01-05','Evan','evan',NULL,NULL,'H@$hxxx5','#9775fa','user'),
      ('2024-01-06','Faye','faye','she/her','Gamer','H@$hxxx6','#f06595','user'),
      ('2024-01-07','George','george','he/him','Music lover','H@$hxxx7','#20c997','user'),
      ('2024-01-08','Hana','hana','she/her','Student','H@$hxxx8','#fab005','user'),
      ('2024-01-09','Ivan','ivan',NULL,'Traveler','H@$hxxx9','#adb5bd','user'),
      ('2024-01-10','Julia','julia','she/her','Artist','H@$hxxx10','#ff922b','user'),
      ('2024-01-11','Kevin','kevin',NULL,NULL,'H@$hxxx11','#868e96','user'),
      ('2024-01-12','DeletedUser','ghost',NULL,NULL,'H@$hxxx12','#ced4da','user');
      `
    );

    await pool.query(`UPDATE users SET deleted='2024-03-01' WHERE id=12;`);

    // Groups
    await pool.query(
      `
      INSERT INTO groups
      (created, owner_id, group_display_name, group_description, avatar_color)
      VALUES
      ('2024-02-01',1,'Dev Talk','Programming discussion','#339af0'),
      ('2024-02-02',2,'Design Hub','UI/UX','#ff8787'),
      ('2024-02-03',3,'Gaming Squad','Games','#69db7c'),
      ('2024-02-04',4,'Study Group','School','#ffd43b'),
      ('2024-02-05',5,'Music Club','Music','#845ef7'),
      ('2024-02-06',6,'Travelers','Trips','#22b8cf'),
      ('2024-02-07',7,'Old Group','Deprecated','#868e96');
      `
    );

    await pool.query(`UPDATE groups SET deleted='2024-05-01' WHERE id=7;`);

    // Membership
    await pool.query(
      `
      INSERT INTO membership (group_id,user_id,membership_role)
      VALUES
      (1,1,'owner'),(1,2,'admin'),(1,3,'member'),(1,4,'member'),
      (2,2,'owner'),(2,4,'member'),(2,6,'member'),
      (3,3,'owner'),(3,5,'member'),(3,6,'member'),(3,7,'member'),
      (4,4,'owner'),(4,1,'member'),(4,8,'member'),
      (5,5,'owner'),(5,7,'member'),(5,9,'member'),
      (6,6,'owner'),(6,8,'member'),(6,10,'member');
      `
    );

    // Conversations
    await pool.query(
      `
      INSERT INTO conversations (created,conversation_type,group_id)
      VALUES
      ('2024-02-01','group',1),
      ('2024-02-02','group',2),
      ('2024-02-03','group',3),
      ('2024-02-04','group',4);
      `
    );

    await pool.query(
      `
      INSERT INTO conversations (created,conversation_type,user1_id,user2_id)
      VALUES
      ('2024-03-01','direct',1,2),
      ('2024-03-02','direct',1,3),
      ('2024-03-03','direct',4,6),
      ('2024-03-04','direct',8,10);
      `
    );

    // Conversation Members
    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,1 FROM conversations WHERE id=1;
      `
    );

    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,2 FROM conversations WHERE id=1;
      `
    );

    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,3 FROM conversations WHERE id=1;
      `
    );

    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,4 FROM conversations WHERE id=1;
      `
    );

    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,2 FROM conversations WHERE id=2;
      `
    );

    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,4 FROM conversations WHERE id=2;
      `
    );

    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,6 FROM conversations WHERE id=2;
      `
    );

    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,3 FROM conversations WHERE id=3;
      `
    );

    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,5 FROM conversations WHERE id=3;
      `
    );

    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,6 FROM conversations WHERE id=3;
      `
    );

    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,7 FROM conversations WHERE id=3;
      `
    );

    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,4 FROM conversations WHERE id=4;
      `
    );

    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,1 FROM conversations WHERE id=4;
      `
    );

    await pool.query(
      `
      INSERT INTO conversation_members
      SELECT id,8 FROM conversations WHERE id=4;
      `
    );

    // DM Members
    await pool.query(
      `
      INSERT INTO conversation_members 
      VALUES
      (5,1),(5,2),
      (6,1),(6,3),
      (7,4),(7,6),
      (8,8),(8,10);
      `
    );

    // Messages
    await pool.query(
      `
      INSERT INTO messages (author_id,conversation_id,content)
      VALUES
      (1,1,'Welcome to Dev Talk'),
      (2,1,'Hello everyone'),
      (3,1,'Nice to be here'),

      (2,2,'Design meeting later'),
      (4,2,'Sure'),

      (3,3,'Anyone playing tonight?'),
      (5,3,'Yes'),

      (1,5,'Hey Bob'),
      (2,5,'Hi Alice'),

      (1,6,'Hey Charlie'),
      (3,6,'Hi'),

      (4,7,'Hi Faye'),
      (6,7,'Hello'),

      (8,8,'Planning trip'),
      (10,8,'Sounds good');
      `
    );

    // System Message
    await pool.query(
      `
      INSERT INTO messages
      (author_id,conversation_id,message_type,system_event_type,content)
      VALUES
      (NULL,1,'system','user_join','George joined');
      `
    );

    // UPDATE latest_message_id
    await pool.query(
      `
      UPDATE conversations
      SET latest_message_id = (
        SELECT id FROM messages m
        WHERE m.conversation_id = conversations.id
        ORDER BY id DESC LIMIT 1
      );
      `
    );

    // Friendships
    await pool.query(
      `
      INSERT INTO friendship VALUES
      ('2024-03-01',1,3,'accepted'),
      ('2024-03-02',1,4,'pending'),
      ('2024-03-03',2,5,'accepted'),
      ('2024-03-04',6,7,'declined'),
      ('2024-03-05',8,10,'accepted');
      `
    );

    // Notes
    await pool.query(
      `
      INSERT INTO user_note VALUES
      (1,3,NOW(),'Good teammate'),
      (2,5,NOW(),'Needs review'),
      (4,4,NOW(),'Self reminder');
      `
    );

    // Reports
    await pool.query(
      `
      INSERT INTO reports
      (reporter_id,target_user_id,target_message_id,reason,report_status)
      VALUES
      (3,5,7,'Spam','open'),
      (4,6,12,'Offensive','reviewed'),
      (8,10,NULL,'Harassment','resolved');
      `
    );

    console.log('Seed complete ✅');
  } catch (err) {
    console.error('Seed error ❌', err);
  } finally {
    await pool.end();
  }
}

seed();
