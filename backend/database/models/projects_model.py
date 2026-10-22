from database.database import Base
from sqlalchemy import String, DateTime, Integer, Text, Boolean
from sqlalchemy.orm import MappedColumn, mapped_column, relationship
from datetime import date, datetime, timezone

from database.models.project_assets_model import ProjectAssets

class Projects(Base):
    __tablename__ = "projects"

    id: MappedColumn[int] = mapped_column(primary_key=True, index=True)
    thumbnail_id: MappedColumn[str] = mapped_column(String(100))
    title: MappedColumn[str] = mapped_column(String(100))
    description: MappedColumn[str] = mapped_column(Text)
    post_id: MappedColumn[int] = mapped_column(Integer)
    assets: MappedColumn[list["ProjectAssets"]] = relationship(cascade="all, delete-orphan")
    likes: MappedColumn[int] = mapped_column(Integer, default=0)
    dislikes: MappedColumn[int] = mapped_column(Integer, default=0)
    category: MappedColumn[str] = mapped_column(String(100))
    starred: MappedColumn[bool] = mapped_column(Boolean)
    created_at: MappedColumn[date] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at: MappedColumn[date] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )