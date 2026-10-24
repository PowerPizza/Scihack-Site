from database.database import Base
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import MappedColumn, mapped_column
from enum import Enum
from sqlalchemy import Enum as SqlEnum

class AssetType(Enum):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    LINK = "link"

class ProjectAssets(Base):
    __tablename__ = "project_assets"
    id: MappedColumn[int] = mapped_column(primary_key=True, index=True)
    project_id: MappedColumn[int] = mapped_column(ForeignKey("projects.id"))
    asset_type: MappedColumn[AssetType] = mapped_column(SqlEnum(AssetType), nullable=False)
    url: MappedColumn[str] = mapped_column(String(255))