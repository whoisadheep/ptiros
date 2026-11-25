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
      grade VARCHAR(32) NOT NULL,
      school_name VARCHAR(150),
      city VARCHAR(100) NOT NULL,
      curriculum VARCHAR(32) NOT NULL,
      parent_name VARCHAR(120),
      parent_phone VARCHAR(20),
      parent_dream TEXT,
      avatar_initials VARCHAR(4) DEFAULT 'ST',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
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

  console.log("Neon student auth & portal schema ready.");
}

setup().catch(console.error);
