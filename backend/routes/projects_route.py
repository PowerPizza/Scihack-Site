from flask import Blueprint, g
from sqlalchemy.orm import Session
from sqlalchemy import select
from database.models.projects_model import Projects
from database.dto.project_response_dto import ProjectResponse

api = Blueprint("projects_api", __name__, url_prefix="/api/v1")

@api.get("/projects")
def getProjects():
    try:
        db: Session = g.db

        stmt = select(Projects)
        # TODO: add paging.
        projects = db.execute(stmt).scalars().all()

        response = [ProjectResponse.from_model(project) for project in projects]

        return {"projects": response}
    except BaseException as err:
        return {"error": str(err)}, 500


@api.get("/projects/<int:project_id>")
def getProjectById(project_id):
    try:
        db: Session = g.db
        stmt = select(Projects).where(Projects.id == project_id)
        project = db.execute(stmt).scalars().one_or_none()
        if project is not None:
            return ProjectResponse.from_model(project)
        else:
            return {"error": f"Project with id {project_id} not exists."}, 400
    except BaseException as err:
        return {"error": err}, 500


@api.get("/projects/categories")
def getProjectCategories():
    try:
        db: Session = g.db
        stmt = select(Projects.category).distinct()
        categories = db.execute(stmt).scalars().all()
        return {"categories": categories}
    except BaseException as err:
        return {"error": err}, 500
