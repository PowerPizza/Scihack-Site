from flask import Blueprint, g, jsonify
from sqlalchemy.orm import Session
from sqlalchemy import select
from database.models.skills_model import Skills
from database.dto.skill_response_dto import SkillResponseDto

api = Blueprint("skills_api", __name__, url_prefix="/api/v1")

@api.get("/skills")
def get_skills():
    db:Session = g.db
    try:
        statement = select(Skills).order_by(Skills.percentage)
        skills = db.execute(statement).scalars().all()
        skills_to_send = [SkillResponseDto.from_model(skill) for skill in skills]
        return {"skills": skills_to_send}
    except BaseException as e:
        return {"error": str(e)}, 500