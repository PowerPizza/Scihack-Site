from database.database import Base
from sqlalchemy import String, DateTime, Integer, Text, ForeignKey
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import MappedColumn, mapped_column
from datetime import date, datetime, timezone
from enum import Enum
from .users_model import Users

class PostActions(Enum):
    LIKE = "like"
    DISLIKE = "dislike"
    NONE = "none"

class PostTypes(Enum):
    BLOG = "blog"
    PROJECT = "project"

class PostInteractions(Base):
    __tablename__ = "post_interactions"

    id: MappedColumn[int] = mapped_column(primary_key=True, index=True)
    post_id: MappedColumn[int] = mapped_column(Integer)
    type: MappedColumn[PostTypes] = mapped_column(SqlEnum(PostTypes), nullable=False)
    action: MappedColumn[PostActions] = mapped_column(SqlEnum(PostActions), nullable=False)
    comment: MappedColumn[str] = mapped_column(Text, nullable=True)
    interacted_by: MappedColumn[Users] = mapped_column(ForeignKey("users.id"))
    created_at: MappedColumn[date] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: MappedColumn[date] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=True
    )