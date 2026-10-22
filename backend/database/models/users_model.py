from database.database import Base
from sqlalchemy import String, Date, Boolean, DateTime
from sqlalchemy.orm import MappedColumn, mapped_column
from datetime import date, datetime, timezone
from enum import Enum

class Role(Enum):
    ADMIN = "admin"
    CO_ADMIN = "co_admin"
    USER = "user"


class Users(Base):
    __tablename__ = "users"

    id: MappedColumn[int] = mapped_column(primary_key=True, index=True)
    username: MappedColumn[str] = mapped_column(String(50))
    gmail: MappedColumn[str] = mapped_column(String(70), unique=True)
    password: MappedColumn[str] = mapped_column(String(255))
    dob: MappedColumn[date] = mapped_column(Date())
    phone_no: MappedColumn[str] = mapped_column(String(20))
    role: MappedColumn[Role] = mapped_column(String(50))
    with_google: MappedColumn[bool] = mapped_column(Boolean(), default=False)
    created_at: MappedColumn[date] = mapped_column(
        DateTime(timezone=True),
        default=lambda : datetime.now(timezone.utc)
    )
    updated_at: MappedColumn[date] = mapped_column(
        DateTime(timezone=True),
        default=lambda : datetime.now(timezone.utc),
        onupdate=lambda : datetime.now(timezone.utc)
    )
