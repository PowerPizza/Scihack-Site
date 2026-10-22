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
        to_ret = {"status": "success", "skills": skills_to_send}
        return jsonify(to_ret)
    except BaseException as e:
        return jsonify({"status": "failed", "error": str(e)})