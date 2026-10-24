from flask import Blueprint, g, jsonify, request
from sqlalchemy.orm import Session
from sqlalchemy import select
from database.models.users_model import Users, Role
from typing import Optional
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database.dto.user_response_dto import UserLiteResponse

api = Blueprint("auth_api", __name__, url_prefix="/api/v1")

@api.get("/auth")
@jwt_required()
def get_login_creds():
    try:
        user_id = get_jwt_identity()
        db: Session = g.db

        stmt = select(Users).where(Users.id == user_id)
        user:Optional[Users] = db.execute(stmt).scalars().first()
        if user is not None:
            return UserLiteResponse.from_model(user), 200
        else:
            return {"error": "User doesn't exist."}, 401
    except BaseException as e:
        return {"error": str(e)}, 500


@api.post("/auth/login")
def login():
    try:
        user_data = request.json

        db:Session = g.db
        statement = select(Users).where(Users.gmail == user_data["gmail"], Users.password == user_data["password"])
        user:Optional[Users] = db.execute(statement).scalars().first()

        if user is not None:
            token = create_access_token(
                identity=str(user.id),
                additional_claims={
                    "role": user.role
                }
            )
            return {"token": token}, 200
        else:
            return {"error": "User not found."}, 401
    except BaseException as e:
        return {"error": str(e)}, 500


@api.get("/auth/gmail_exists")
def check_gmail_exists():
    try:
        gmail = request.args.get("gmail")
        db: Session = g.db
        stmt = select(Users.id).where(Users.gmail == gmail)
        existing = db.execute(stmt).scalars().first()
        if existing is not None:
            return {"exists": True}, 200
        else:
            return {"exists": False}, 200
    except BaseException as e:
        return {"error": str(e)}, 500


@api.post("/auth/signup")
def signup():
    db: Session = g.db
    try:
        data_ = request.get_json(silent=True)
        if not isinstance(data_, dict):
            return {"error": "Invalid request body."}, 400
        else:
            user = Users(
                username=data_["username"],
                gmail=data_["gmail"],
                password=data_["password"],
                dob=data_["dob"],
                phone_no=data_["phone_no"],
                role=Role.USER,
                with_google=data_["with_google"]
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            token = create_access_token(
                identity=str(user.id),
                additional_claims={
                    "role": user.role.value
                }
            )
            return {"token": token}, 200
    except BaseException as e:
        db.rollback()
        print(e)
        return {"error": str(e)}, 500
