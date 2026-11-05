from database.database import Base
from sqlalchemy.orm import MappedColumn, mapped_column
from sqlalchemy import ForeignKey, String

class ProjectLinks(Base):
    __tablename__ = "project_links"

    id: MappedColumn[int] = mapped_column(primary_key=True, index=True)
    project_id: MappedColumn[int] = mapped_column(ForeignKey("projects.id"))
    link_text: MappedColumn[str] = mapped_column(String(255))
    link: MappedColumn[str] = mapped_column(String(255))
