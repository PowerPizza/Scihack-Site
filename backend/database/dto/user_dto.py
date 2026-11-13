from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from ..models.users_model import Users


class UserLiteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    role: str
    dob: date

    @staticmethod
    def from_model(model: Users):
        return UserLiteResponse.model_validate(model).model_dump(mode="json")


class UserFullResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    gmail: str
    password: str
    dob: date
    phone_no: str
    role: str
    with_google: bool
    created_at: datetime
    updated_at: datetime

    @staticmethod
    def from_model(model: Users):
        return UserFullResponse.model_validate(model).model_dump(mode="json")
