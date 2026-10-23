from pydantic import BaseModel, ConfigDict
from datetime import date
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