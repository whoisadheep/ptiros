const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

async function setup() {
  console.log("Ensuring Neon tables for student auth & portal exist...");

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      age INTEGER,
      gender VARCHAR(24),
      address TEXT,
      single_child BOOLEAN,
      father_name VARCHAR(120),
      mother_name VARCHAR(120),
      personal_phone VARCHAR(20),
      parent_email VARCHAR(150),
      grade VARCHAR(32) NOT NULL,
      school_name VARCHAR(150),
      school_address TEXT,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(80),
      curriculum VARCHAR(32) NOT NULL,
      parent_name VARCHAR(120),
      parent_phone VARCHAR(20),
      parent_dream TEXT,
      last_year_rank VARCHAR(80),
      last_year_percentage VARCHAR(20),
      pro_sports BOOLEAN,
      competitions TEXT,
      apar_id VARCHAR(64),
      avatar_initials VARCHAR(4) DEFAULT 'ST',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS age INTEGER,
      ADD COLUMN IF NOT EXISTS gender VARCHAR(24),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS single_child BOOLEAN,
      ADD COLUMN IF NOT EXISTS father_name VARCHAR(120),
      ADD COLUMN IF NOT EXISTS mother_name VARCHAR(120),
      ADD COLUMN IF NOT EXISTS personal_phone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS parent_email VARCHAR(150),
      ADD COLUMN IF NOT EXISTS school_address TEXT,
      ADD COLUMN IF NOT EXISTS state VARCHAR(80),
      ADD COLUMN IF NOT EXISTS last_year_rank VARCHAR(80),
      ADD COLUMN IF NOT EXISTS last_year_percentage VARCHAR(20),
      ADD COLUMN IF NOT EXISTS pro_sports BOOLEAN,
      ADD COLUMN IF NOT EXISTS competitions TEXT,
      ADD COLUMN IF NOT EXISTS apar_id VARCHAR(64);
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS student_diary (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date VARCHAR(32) NOT NULL,
      title VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(50) DEFAULT 'reflection',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS student_planner_goals (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(250) NOT NULL,
      time_view VARCHAR(20) NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      deadline VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS student_sim_results (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      track_id VARCHAR(50) NOT NULL,
      track_title VARCHAR(120) NOT NULL,
      fit_score INTEGER NOT NULL,
      resilience_points INTEGER NOT NULL,
      badge_earned VARCHAR(100),
      completed_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS student_career_tests (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      student_name VARCHAR(120) NOT NULL,
      grade VARCHAR(40) NOT NULL,
      top_track_id VARCHAR(50) NOT NULL,
      top_track_title VARCHAR(140) NOT NULL,
      match_confidence INTEGER NOT NULL,
      archetype VARCHAR(100) NOT NULL,
      recommended_stream VARCHAR(160) NOT NULL,
      answers_json JSONB NOT NULL,
      dimension_scores_json JSONB NOT NULL,
      ranked_tracks_json JSONB NOT NULL,
      dossier_unlocked BOOLEAN DEFAULT FALSE,
      dossier_order_id VARCHAR(64),
      completed_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS paid_dossiers (
      id VARCHAR(64) PRIMARY KEY,
      student_name VARCHAR(120) NOT NULL,
      parent_phone VARCHAR(20) NOT NULL,
      amount INTEGER DEFAULT 499,
      currency VARCHAR(10) DEFAULT 'INR',
      status VARCHAR(32) DEFAULT 'payment_pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    ALTER TABLE paid_dossiers
      ADD COLUMN IF NOT EXISTS user_id VARCHAR(64),
      ADD COLUMN IF NOT EXISTS career_test_id VARCHAR(64),
      ADD COLUMN IF NOT EXISTS top_track_title VARCHAR(140);
  `;

  console.log("Neon student auth & portal schema ready.");
}

setup().catch(console.error);
