from pydantic import BaseModel, ConfigDict
from ..models.skills_model import Skills

class SkillResponseDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    percentage: int
    description: str

    @staticmethod
    def from_model(model: Skills):
        return SkillResponseDto.model_validate(model).model_dump(mode="json")

