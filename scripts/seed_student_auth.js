const { neon } = require("@neondatabase/serverless");
const crypto = require("crypto");

const sql = neon(process.env.DATABASE_URL);

function hashPassword(pass) {
  return crypto.createHash("sha256").update(pass).digest("hex");
}

async function setup() {
  console.log("Setting up Neon tables for student auth & portal...");

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

  // Seed demo students
  const pHash = hashPassword("student123");

  // Demo 1: Aarav Sharma (Class 10, Robotics & AI)
  await sql`
    INSERT INTO users (
      id, name, email, password_hash, grade, school_name, city, curriculum,
      parent_name, parent_phone, parent_dream, avatar_initials
    ) VALUES (
      'usr_demo_aarav', 'Aarav Sharma', 'aarav@demo.ptiros.in', ${pHash}, 'Class 10', 'Delhi Public School, R.K. Puram', 'Delhi NCR', 'CBSE',
      'Rajesh Sharma', '9876543210', 'Wants stable engineering/technology career', 'AS'
    ) ON CONFLICT (email) DO NOTHING;
  `;

  // Demo 2: Meera Nair (Class 11, Corporate Law)
  await sql`
    INSERT INTO users (
      id, name, email, password_hash, grade, school_name, city, curriculum,
      parent_name, parent_phone, parent_dream, avatar_initials
    ) VALUES (
      'usr_demo_meera', 'Meera Nair', 'meera@demo.ptiros.in', ${pHash}, 'Class 11', 'The Mother''s International School', 'Bengaluru', 'ICSE',
      'Suresh Nair', '9812345678', 'Seeking corporate law & public leadership', 'MN'
    ) ON CONFLICT (email) DO NOTHING;
  `;

  // Demo 3: Vihaan Patel (Class 12, Medicine & BioTech)
  await sql`
    INSERT INTO users (
      id, name, email, password_hash, grade, school_name, city, curriculum,
      parent_name, parent_phone, parent_dream, avatar_initials
    ) VALUES (
      'usr_demo_vihaan', 'Vihaan Patel', 'vihaan@demo.ptiros.in', ${pHash}, 'Class 12', 'St. Xavier''s High School', 'Ahmedabad', 'CBSE',
      'Kiran Patel', '9899887766', 'Wants stable medical/healthcare career', 'VP'
    ) ON CONFLICT (email) DO NOTHING;
  `;

  // Seed Aarav Diary
  await sql`
    INSERT INTO student_diary (id, user_id, date, title, content, category)
    VALUES 
    ('dia_aarav_01', 'usr_demo_aarav', 'Nov 12, 2026', 'Completed Robotics Simulator Mission: Kalman Filter', 'Navigated the Mars Rover latency crisis! Re-tuned the sensor threshold to 15 Hz. Realized I enjoy embedded engineering more than pure web dev.', 'simulator'),
    ('dia_aarav_02', 'usr_demo_aarav', 'Nov 09, 2026', 'Discussion with Dad about Stream Selection', 'Shared the PTIROS Parent Dossier with Mom & Dad. Dad was surprised by the Mid-Career salary jump for AI Systems Architects in Bengaluru. Feeling much less pressure now.', 'family'),
    ('dia_aarav_03', 'usr_demo_aarav', 'Nov 06, 2026', 'Hansei Reflection: Math Olympiad Prep', 'Need to practice coordinate geometry with tighter time constraints. 25 minutes per section was too slow.', 'academic')
    ON CONFLICT (id) DO NOTHING;
  `;

  // Seed Aarav Planner Goals
  await sql`
    INSERT INTO student_planner_goals (id, user_id, title, time_view, completed, deadline)
    VALUES
    ('g_aarav_01', 'usr_demo_aarav', 'Finish Proportional Control Circuit simulation', 'daily', true, 'Today'),
    ('g_aarav_02', 'usr_demo_aarav', 'Solve 15 JEE Foundation Kinematics numericals', 'daily', false, 'Today 6 PM'),
    ('g_aarav_03', 'usr_demo_aarav', 'Prepare 3 dilemma questions for Dr. Aryan Sharma (Mentor call)', 'daily', false, 'Tomorrow'),
    ('g_aarav_04', 'usr_demo_aarav', 'Complete Class 10 Science Term 2 syllabus review', 'monthly', false, 'Nov 30, 2026'),
    ('g_aarav_05', 'usr_demo_aarav', 'Participate in Regional Robotics Exhibition (RoboCup Junior)', 'monthly', true, 'Nov 18, 2026'),
    ('g_aarav_06', 'usr_demo_aarav', 'Finalize Class 11 stream: PCM with Computer Science vs Economics', 'yearly', false, 'March 2027')
    ON CONFLICT (id) DO NOTHING;
  `;

  // Seed Aarav Simulation Results
  await sql`
    INSERT INTO student_sim_results (id, user_id, track_id, track_title, fit_score, resilience_points, badge_earned)
    VALUES
    ('sim_aarav_01', 'usr_demo_aarav', 'ai-robotics', 'AI & Autonomous Robotics', 92, 120, 'Autonomous Systems Architect'),
    ('sim_aarav_02', 'usr_demo_aarav', 'quant-finance', 'Algorithmic Finance & FinTech', 81, 75, 'Risk Model Strategist')
    ON CONFLICT (id) DO NOTHING;
  `;

  // Seed Meera Diary
  await sql`
    INSERT INTO student_diary (id, user_id, date, title, content, category)
    VALUES 
    ('dia_meera_01', 'usr_demo_meera', 'Nov 13, 2026', 'Section 27 Contract Redlining Review', 'Caught the non-compete clause loophole in the Law simulation! Senior Associate mentor memo was very clear. I want to target NLSIU Bengaluru.', 'simulator')
    ON CONFLICT (id) DO NOTHING;
  `;

  // Seed Meera Planner Goals
  await sql`
    INSERT INTO student_planner_goals (id, user_id, title, time_view, completed, deadline)
    VALUES
    ('g_meera_01', 'usr_demo_meera', 'Complete CLAT Legal Reasoning mock section (40 Qs)', 'daily', true, 'Today'),
    ('g_meera_02', 'usr_demo_meera', 'Review Adv. Sneha Mukherjee''s notes on Tech M&A Law', 'daily', false, 'Tomorrow 4 PM')
    ON CONFLICT (id) DO NOTHING;
  `;

  // Seed Meera Simulation Results
  await sql`
    INSERT INTO student_sim_results (id, user_id, track_id, track_title, fit_score, resilience_points, badge_earned)
    VALUES
    ('sim_meera_01', 'usr_demo_meera', 'corporate-law', 'Corporate Law & Public Policy', 88, 90, 'Contract Risk Specialist')
    ON CONFLICT (id) DO NOTHING;
  `;

  console.log("Neon student auth, profiles, diary & planner seed completed successfully!");
}

setup().catch(console.error);
