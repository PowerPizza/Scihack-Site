from flask import Blueprint, g
from sqlalchemy.orm import Session

api = Blueprint("blogs_api", __name__, url_prefix="/api/v1")

@api.get("/blogs")
def getBlogs():
    return {"status": "ok"}