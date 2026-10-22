from .database import get_db
from sqlalchemy import text

def seed_skill_data():
    db = get_db()
    query = text("""INSERT INTO skills (id, title, percentage, description, created_at, updated_at) VALUES
     (1, 'HTML', 80, 'Test skill 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
     (2, 'CSS', 70, 'Test skill 2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
     (3, 'JS', 50, 'Test skill 3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
     (4, 'React.js', 40, 'Test skill 4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
     (5, 'Python', 50, 'Test skill 5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ON CONFLICT (id) DO NOTHING""")
    db.execute(query)
    db.flush()
    db.commit()
    db.close()

def seed_data():
    seed_skill_data()
