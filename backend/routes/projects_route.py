from flask import Blueprint

api = Blueprint("projects_api", __name__, url_prefix="/api/v1")

@api.get("/projects")
def getProjects():
    pass