from database.database import Base
from sqlalchemy import String, DateTime, Integer, Text
from sqlalchemy.orm import MappedColumn, mapped_column
from datetime import date, datetime, timezone

class Skills(Base):
    __tablename__ = "skills"

    id: MappedColumn[int] = mapped_column(primary_key=True, index=True)
    title: MappedColumn[str] = mapped_column(String(50))
    percentage: MappedColumn[int] = mapped_column(Integer, default=0)
    description: MappedColumn[str] = mapped_column(Text, nullable=True)
    created_at: MappedColumn[date] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at: MappedColumn[date] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )
