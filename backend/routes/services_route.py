from flask import Blueprint, g
from sqlalchemy.orm import Session
from sqlalchemy import select
from database.models.services_model import Services
from database.dto.service_dto import ServiceResponse

api = Blueprint("services_api", __name__, url_prefix="/api/v1")

@api.get("/services")
def getServices():
    try:
        db: Session = g.db
        stmt = select(Services)
        resp = db.execute(stmt).scalars().all()

        services = [ServiceResponse.from_model(model) for model in resp]
        return {"services": services}
    except BaseException as err:
        return {"error": str(err)}, 500


@api.get("/services/<int:service_id>")
def getServiceById(service_id):
    try:
        db: Session = g.db
        stmt = select(Services).where(Services.id == service_id)
        service = db.execute(stmt).scalars().one_or_none()

        if service is None:
            return {"error": f"Service with id {service_id} not exists."}, 400
        else:
            return ServiceResponse.from_model(service)
    except BaseException as err:
        return {"error": str(err)}, 500
