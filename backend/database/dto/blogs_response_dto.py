from pydantic import BaseModel, ConfigDict
from datetime import date

class BlogLiteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    publish_date: date
    description: str

    @staticmethod
    def from_model(model):
        return BlogLiteResponse.model_validate(model).model_dump(mode="json")


class BlogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    html_content: str
    additional_fonts: str
    title: str
    publish_date: date
    description: str

    @staticmethod
    def from_model(model):
        return BlogResponse.model_validate(model).model_dump(mode="json")
