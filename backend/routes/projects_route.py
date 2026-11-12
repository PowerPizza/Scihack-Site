from flask import Blueprint, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import Session
from sqlalchemy import select, and_, func
from database.models.projects_model import Projects
from database.dto.project_response_dto import ProjectResponse
from database.models.post_interactions_model import PostInteractions, PostActions

api = Blueprint("projects_api", __name__, url_prefix="/api/v1")

@api.get("/projects")
@jwt_required(optional=True)
def getProjects():
    try:
        user_id = get_jwt_identity()
        db: Session = g.db

        likes_query = (
            select(PostInteractions.post_id, func.count().label("like_count")).where(
                PostInteractions.action == PostActions.LIKE
            ).group_by(PostInteractions.post_id).subquery()
        )

        dislikes_query = (
            select(PostInteractions.post_id, func.count().label("dislike_count")).where(
                PostInteractions.action == PostActions.DISLIKE
            ).group_by(PostInteractions.post_id).subquery()
        )

        stmt = select(
                Projects,
                PostInteractions.action.label("user_interaction"),
                func.coalesce(likes_query.c.like_count, 0).label("like_count"),
                func.coalesce(dislikes_query.c.dislike_count, 0).label("dislike_count")
            ).outerjoin(
                PostInteractions,
                and_(
                    PostInteractions.post_id == Projects.id,
                    PostInteractions.interacted_by == user_id
                )
            ).outerjoin(
                likes_query, likes_query.c.post_id == Projects.id
            ).outerjoin(
                dislikes_query, dislikes_query.c.post_id == Projects.id
            )

        # TODO: add paging.
        projects = db.execute(stmt).all()

        response = []
        for project, user_interaction, like_count, dislike_count in projects:
            project_resp = ProjectResponse.model_validate(project)
            project_resp.user_interaction = user_interaction
            project_resp.likes = like_count
            project_resp.dislikes = dislike_count
            response.append(project_resp.model_dump(mode="json"))

        return {"projects": response}
    except BaseException as err:
        return {"error": str(err)}, 500


@api.get("/projects/<int:project_id>")
@jwt_required(optional=True)
def getProjectById(project_id):
    try:
        user_id = get_jwt_identity()
        db: Session = g.db

        likes_query = (
            select(PostInteractions.post_id, func.count().label("like_count")).where(
                PostInteractions.action == PostActions.LIKE
            ).group_by(PostInteractions.post_id).subquery()
        )

        dislikes_query = (
            select(PostInteractions.post_id, func.count().label("dislike_count")).where(
                PostInteractions.action == PostActions.DISLIKE
            ).group_by(PostInteractions.post_id).subquery()
        )

        stmt = select(
            Projects,
            PostInteractions.action.label("user_interaction"),
            func.coalesce(likes_query.c.like_count, 0).label("like_count"),
            func.coalesce(dislikes_query.c.dislike_count, 0).label("dislike_count")
        ).where(Projects.id == project_id).outerjoin(
            PostInteractions,
            and_(
                PostInteractions.post_id == Projects.id,
                PostInteractions.interacted_by == user_id
            )
        ).outerjoin(
            likes_query, likes_query.c.post_id == Projects.id
        ).outerjoin(
            dislikes_query, dislikes_query.c.post_id == Projects.id
        )

        # stmt = select(Projects).where(Projects.id == project_id)
        project, user_interaction, like_count, dislike_count = db.execute(stmt).one()


        if project is not None:
            project_resp = ProjectResponse.model_validate(project)
            project_resp.user_interaction = user_interaction
            project_resp.likes = like_count
            project_resp.dislikes = dislike_count
            return project_resp.model_dump(mode="json")
            # return ProjectResponse.from_model(project)
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
