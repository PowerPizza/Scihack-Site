from pydantic import BaseModel
from database.models.post_interactions_model import PostTypes, PostActions

class PostInteractionRequest(BaseModel):
    post_id: int
    type: PostTypes
    action: PostActions | None = None
