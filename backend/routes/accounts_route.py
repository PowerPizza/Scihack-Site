from flask import Blueprint, g, request
from sqlalchemy.orm import Session
from sqlalchemy import select
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.models.users_model import Users
from typing import Optional
from database.dto.user_response_dto import UserFullResponse

api = Blueprint("accounts_api", __name__, url_prefix="/api/v1")

@api.get("/account")
@jwt_required()
def get_full_account():
    db: Session = g.db
    try:
        user_id = get_jwt_identity()
        stmt = select(Users).where(Users.id == user_id)
        user: Optional[Users] = db.execute(stmt).scalars().first()
        if user is None:
            return {"error": "access denied."}, 401
        else:
            return UserFullResponse.from_model(user), 200
    except BaseException as e:
        return {"error": str(e)}, 500


@api.put("/account")
@jwt_required()
def update_account():
    data = request.get_json(silent=True)
    db: Session = g.db
    user_id = get_jwt_identity()
    try:
        stmt = select(Users).where(Users.id == user_id)
        user: Optional[Users] = db.execute(stmt).scalars().first()
        if user is None:
            return {"error": "User not found."}, 404
        else:
            user.username = data.get("username", user.username)
            user.gmail = data.get("gmail", user.gmail)
            user.password = data.get("password", user.password)
            user.dob = data.get("dob", user.dob)
            user.phone_no = data.get("phone_no", user.phone_no)
            db.add(user)
            db.commit()
            return {"message": "Changes has been saved."}, 200
    except BaseException as e:
        print(e)
        db.rollback()
        return {"error": str(e)}, 500

@api.delete("/account")
@jwt_required()
def delete_account():
    db: Session = g.db
    user_id = get_jwt_identity()
    try:
        stmt = select(Users).where(Users.id == user_id)
        user: Optional[Users] = db.execute(stmt).scalars().first()
        if user is None:
            return {"error": "User not found."}, 404
        else:
            db.delete(user)
            db.commit()
            return {"message": "Account deleted successfully."}, 200
    except BaseException as e:
        print(e)
        db.rollback()
        return {"error": str(e)}, 500
