from pydantic import BaseModel, ConfigDict

class ServiceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    icon: str

    @staticmethod
    def from_model(model):
        return ServiceResponse.model_validate(model).model_dump(mode="json")