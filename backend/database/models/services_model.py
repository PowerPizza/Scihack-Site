from database.database import Base
from sqlalchemy import String, DateTime, Text
from sqlalchemy.orm import MappedColumn, mapped_column
from datetime import date, datetime, timezone

class Services(Base):
    __tablename__ = "services"

    id: MappedColumn[int] = mapped_column(primary_key=True, index=True)
    title: MappedColumn[str] = mapped_column(String(150))
    description: MappedColumn[str] = mapped_column(Text)
    icon: MappedColumn[str] = mapped_column(Text)
    created_at: MappedColumn[date] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at: MappedColumn[date] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )