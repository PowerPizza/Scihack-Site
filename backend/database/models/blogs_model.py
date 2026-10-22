from database.database import Base
from sqlalchemy import String, DateTime, Integer, Text
from sqlalchemy.orm import MappedColumn, mapped_column
from datetime import date, datetime, timezone

class Blogs(Base):
    __tablename__ = "blogs"

    id: MappedColumn[int] = mapped_column(primary_key=True, index=True)
    html_content: MappedColumn[str] = mapped_column(Text, nullable=True)

