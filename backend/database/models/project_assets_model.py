from database.database import Base
from sqlalchemy import String, DateTime, Integer, Text, ForeignKey
from sqlalchemy.orm import MappedColumn, mapped_column
from datetime import date, datetime, timezone
from enum import Enum

class AssetType(Enum):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    LINK = "link"

class ProjectAssets(Base):
    __tablename__ = "project_assets"
    id: MappedColumn[int] = mapped_column(primary_key=True, index=True)
    project_id: MappedColumn[int] = mapped_column(ForeignKey("projects.id"))
    asset_type: MappedColumn[AssetType] = mapped_column(String(30))
    url: MappedColumn[str] = mapped_column(String(255))