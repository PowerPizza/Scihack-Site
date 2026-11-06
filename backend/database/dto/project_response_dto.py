from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ProjectAssetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    asset_type: str
    url: str

    @staticmethod
    def from_model(model):
        return ProjectAssetResponse.model_validate(model).model_dump(mode="json")


class ProjectLinkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    link_text: str
    link: str

    @staticmethod
    def from_model(model):
        return ProjectLinkResponse.model_validate(model).model_dump(mode="json")


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    thumbnail_id: str
    title: str
    description: str
    likes: int
    dislikes: int
    category: str
    starred: bool
    created_at: datetime
    updated_at: datetime
    assets: list["ProjectAssetResponse"]
    links: list["ProjectLinkResponse"]

    @staticmethod
    def from_model(model):
        return ProjectResponse.model_validate(model).model_dump(mode="json")
