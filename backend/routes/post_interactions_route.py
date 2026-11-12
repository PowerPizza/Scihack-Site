from flask import Blueprint, request, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.models.post_interactions_model import PostInteractions, PostActions
from database.dto.post_interaction_dto import PostInteractionRequest
from sqlalchemy.orm import Session
from sqlalchemy import select

api = Blueprint("post_interactions_api", __name__, url_prefix="/api/v1")

@api.post("/post_interaction/like_dislike")
@jwt_required()
def interactLikeOrDislike():
    try:
        # Like/Dislike is only one per user per post, so update if possible before creating new.
        data_ = request.get_json(silent=True)
        user_id = get_jwt_identity()
        if data_ is None:
            return {"error": "Bad request."}, 400

        interaction_req = PostInteractionRequest.model_validate(data_)

        db: Session = g.db
        stmt = select(PostInteractions).where(
            PostInteractions.post_id == interaction_req.post_id,
            PostInteractions.interacted_by == user_id,
            PostInteractions.type == interaction_req.type
        )
        existing_interaction = db.execute(stmt).scalars().one_or_none()

        interaction: PostInteractions
        if existing_interaction is None:
            interaction = PostInteractions(
                post_id=interaction_req.post_id,
                type=interaction_req.type,
                action=interaction_req.action,
                interacted_by=user_id,
            )
        else:
            interaction = existing_interaction
            interaction.action = interaction_req.action

        db.add(interaction)
        db.commit()
        return {}
    except BaseException as err:
        print(err)
        return {"error": str(err)}, 500


@api.post("/post_interaction/comment")
@jwt_required()
def addCommentOnPost():
    pass