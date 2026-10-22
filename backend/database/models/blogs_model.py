from database.database import Base
from sqlalchemy import String, DateTime, Text, Date
from sqlalchemy.orm import MappedColumn, mapped_column
from datetime import date, datetime, timezone

class Blogs(Base):
    __tablename__ = "blogs"

    id: MappedColumn[int] = mapped_column(primary_key=True, index=True)
    html_content: MappedColumn[str] = mapped_column(Text, nullable=True)
    additional_fonts: MappedColumn[str] = mapped_column(Text)
    title: MappedColumn[str] = mapped_column(String(150))
    publish_date: MappedColumn[date] = mapped_column(Date)
    description: MappedColumn[str] = mapped_column(Text)
    created_at: MappedColumn[date] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at: MappedColumn[date] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )