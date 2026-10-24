from .database import get_db
from sqlalchemy import text

def seed_skill_data():
    db = get_db()
    query = text("""INSERT INTO skills (title, percentage, description, created_at, updated_at) VALUES
     ('HTML', 80, 'Test skill 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
     ('CSS', 70, 'Test skill 2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
     ('JS', 50, 'Test skill 3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
     ('React.js', 40, 'Test skill 4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
     ('Python', 50, 'Test skill 5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ON CONFLICT (id) DO NOTHING""")
    db.execute(query)
    db.flush()
    db.commit()
    db.close()

def seed_users_data():
    db = get_db()
    query = text("""INSERT INTO users (username, gmail, password, dob, phone_no, role, with_google, 
    created_at, updated_at) VALUES 
    ('Jack', 'jack@gmail.com', '123456789', '2002-08-21', '+91 9288182278', 'ADMIN', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
    ('Michal', 'michal@gmail.com', '123456789', '1998-02-02', '+91 9288199392', 'USER', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
    ('Donald', 'donald@gmail.com', '123456789', '2001-05-18', '+91 9288183728', 'USER', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
    ON CONFLICT DO NOTHING""")
    db.execute(query)
    db.flush()
    db.commit()
    db.close()

def seed_data():
    seed_skill_data()
    seed_users_data()
