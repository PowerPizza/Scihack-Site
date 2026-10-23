from flask import Blueprint, request
from utils.email_sender import *

api = Blueprint("mail_api", __name__, url_prefix="/api/v1")

@api.post("/mail/verification_code")
def send_verification_code():
    try:
        data_ = request.json
        send_email_verification_code(data_["gmail"], data_["code"])
        return {"message": "Verification code has been sent."}, 200
    except BaseException as e:
        return {"error": str(e)}, 500


@api.post("/mail/contact_application")
def send_contact_application():
    try:
        data_ = request.json
        send_contact_mail(data_["date"], data_["name"], data_["email"], data_["age"], data_["phone_no"], data_["message"])
        return {"message": "contact mail has been sent."}, 200
    except BaseException as e:
        return {"error": str(e)}, 500


@api.post("/mail/hire_application")
def send_hire_application():
    try:
        data_ = request.json
        send_hire_mail(data_["name"], data_["gmail"], data_["date_of_submission"], data_["project_info"])
        return {"message": "Hiring mail has been sent."}, 200
    except BaseException as e:
        return {"error": str(e)}, 500