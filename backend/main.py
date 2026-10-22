import base64
import os
import time
from  uuid import uuid4
import bson.errors
import requests
import traceback
from bson import ObjectId
from flask import Flask, render_template, request, json, session, g, jsonify, Blueprint
from dotenv import load_dotenv
from flask.sansio.scaffold import T_before_request
from pymongo import MongoClient
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
from oauth2client.service_account import ServiceAccountCredentials
from flask_apscheduler import APScheduler
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from email_sender import *
from google.oauth2 import id_token
from google.auth.transport import requests as grequests

# Importing models is necessary for setup_database()
from database.models.users_model import Users
from database.models.skills_model import Skills
from database.models.projects_model import Projects
from database.models.project_assets_model import ProjectAssets
from database.models.blogs_model import Blogs
from database.models.post_interactions_model import PostInteractions
from database.models.services_model import Services

from database.database import setup_database, get_db
from database.seed_data import seed_data

from routes.skills_route import api as skills_api

from database.dto.skill_response_dto import SkillResponseDto

from sqlalchemy.orm import Session
from sqlalchemy import select

from enumerations.post_action import PostActions
from enumerations.post_types import PostTypes

load_dotenv()

class GoogleDriveDB(GoogleDrive):
    def __init__(self):
        gauth = GoogleAuth()
        gauth.LoadClientConfigFile = lambda *args: print(">>> CALLED AN ERROR CAUSING FUNCTION 1")
        gauth.LocalWebserverAuth = lambda *args: print(">>> CALLED AN ERROR CAUSING FUNCTION 2")
        gauth.credentials = ServiceAccountCredentials.from_json_keyfile_name(os.path.join(os.getcwd(), "client_secrets.json"), "https://www.googleapis.com/auth/drive")
        gauth.ServiceAuth()
        super().__init__(gauth)

is_requested = False
class WebSvr(Flask):
    websoc = None
    mongodb = None
    project_collection_name = "projects_data"  # in mongo-db
    services_collection_name = "services_data"  # in mongo-db
    users_collection_name = "users_data"  # in mongo-db
    skills_collection_name = "skills_data"  # in mongo-db
    blog_collection_name = "blog_data"  # in mongo-db
    post_interactions_collection_name = "post_interactions_data"  # in mongo-db
    gdrive = None

    def setup_mongo_db_client(self):
        mongodb_cli = MongoClient(host=os.getenv("MONGODB_HOST"), port=int(os.getenv("MONGODB_PORT")), tls=True)
        self.mongodb = mongodb_cli[os.getenv("MONGODB_DBNAME")]
        print("**MONGO-DB CONNECTED !!!")

    def setup_bday_wish_task(self):
        sch = APScheduler()
        sch.init_app(self)
        @sch.task('cron', id="birthday_wish_task", hour=0, minute=0)
        # @sch.task('cron', id="birthday_wish_task", minute="*")  # IT WILL SEND MAIL PER MINUTE
        def check_bday():
            coll_ = self.mongodb.get_collection(self.users_collection_name)
            bday_users = coll_.find({"dob": str(datetime.now().date())}, {"user_name": True, "gmail": True, "_id": False})
            with ThreadPoolExecutor(max_workers=10) as tp:
                for item in bday_users:
                    tp.submit(send_birthday_mail, cli_name=item["user_name"], to_=item["gmail"])
                    print(f"**BIRTHDAY_MAIL : sent successfully to {item['user_name']} at {item['gmail']}.")
        sch.start()

    def __init__(self):
        super().__init__(__name__, template_folder="../dist", static_folder="../dist", static_url_path="/")
        self.secret_key = os.getenv("SECRET_KEY")
        self.config.from_mapping({"SCHEDULER_API_ENABLED": True})
        self.gdrive = GoogleDriveDB()
        print("**Google Drive Connected !!!")
        self.setup_mongo_db_client()
        self.setup_bday_wish_task()

        setup_database()
        seed_data()

        self.before_request(self._create_db_session)
        self.teardown_request(self._close_db_session)

        self.register_blueprint(skills_api)

    def _create_db_session(self):
        g.db = get_db()


    def _close_db_session(self, exception=None):
        db = g.pop("db", None)
        if db is not None:
            try:
                if exception is not None:
                    db.rollback()
            finally:
                try:
                    db.close()
                finally: pass

    def _get_db(self) -> Session:
        return g.db

    def setup_protected_endpoints(self):
        @self.route("/upload_to_drive", methods=["POST"])
        def upload_to_drive():
            if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv("ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                return json.dumps({"error": "ACCESS_DENIED"})
            # try:
            file_ = request.data
            temp_file_name = str(uuid4()).replace("-", "")
            with open(temp_file_name, "wb") as fp:
                fp.write(file_)
            drive_file = self.gdrive.CreateFile({"title": temp_file_name})
            drive_file.SetContentFile(temp_file_name)
            drive_file.Upload()
            drive_file.InsertPermission({
                'type': 'anyone',
                'value': 'anyone',
                'role': 'reader'
            })
            drive_file_id = drive_file["id"]
            drive_file.content.close()
            os.remove(temp_file_name)
            return json.dumps({"status": "success", "file_id": drive_file_id})
            # except BaseException as e:
            #     return json.dumps({"status": "failed", "error": f"{e}"})

        @self.route("/upload_textual_data", methods=["POST"])
        def upload_textual_data():
            if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv("ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                return json.dumps({"error": "ACCESS_DENIED"})

            data_ = json.loads(request.data.decode())
            project_coll = self.mongodb.get_collection(self.project_collection_name)
            insertion_res = project_coll.insert_one(data_)
            return json.dumps({"status": "success", "doc_id": str(insertion_res.inserted_id)}) if insertion_res.acknowledged else json.dumps({"status": "failed"})

        @self.route("/delete_from_drive", methods=["POST"])
        def delete_from_drive():
            if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv("ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                return json.dumps({"error": "ACCESS_DENIED"})
            try:
                data_ = json.loads(request.data.decode())
                for id_ in data_["ids"]:
                    file_ = self.gdrive.CreateFile({"id": id_})
                    file_.Delete()
                return json.dumps({"status": "success", "deleted": len(data_["ids"])})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/delete_project", methods=["POST"])
        def delete_project():
            try:
                data_ = json.loads(request.data.decode())
                if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv("ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                    return json.dumps({"error": "ACCESS_DENIED"})
                for id_ in [data_["thumbnail_id"]] + data_["images"] + data_["videos"]:
                    file_ = self.gdrive.CreateFile({"id": id_})
                    file_.Delete()
                project_coll = self.mongodb.get_collection(self.project_collection_name)
                project_coll.delete_one({"_id": bson.ObjectId(data_["_id"])})
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/set_project_stared", methods=["POST"])
        def set_project_stared():
            try:
                data_ = json.loads(request.data.decode())
                if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv("ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                    return json.dumps({"error": "ACCESS_DENIED"})
                project_coll = self.mongodb.get_collection(self.project_collection_name)
                project_coll.update_one({"_id": ObjectId(data_["_id"])}, {"$set": {"stared": data_["stared"]}})
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/add_service", methods=["POST"])
        def add_service():
            try:
                if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv("ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                    return json.dumps({"error": "ACCESS_DENIED"})

                data_ = json.loads(request.data.decode())
                services_coll = self.mongodb.get_collection(self.services_collection_name)
                insert_res = services_coll.insert_one(data_)
                return json.dumps({"status": "success", "doc_id": str(insert_res.inserted_id)}) if insert_res.acknowledged else json.dumps({"status": "failed"})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/delete_service", methods=["POST"])
        def delete_service():
            try:
                if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv("ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                    return json.dumps({"error": "ACCESS_DENIED"})

                data_ = json.loads(request.data.decode())
                services_coll = self.mongodb.get_collection(self.services_collection_name)
                services_coll.delete_one({"_id": bson.ObjectId(data_["_id"])})
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/add_skill", methods=["POST"])
        def add_skill():
            if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv("ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                return json.dumps({"error": "ACCESS_DENIED"})
            try:
                data_ = json.loads(request.data.decode())
                skills_coll = self.mongodb.get_collection(self.skills_collection_name)
                outp_ = skills_coll.insert_one({"title": data_['skill_title'], "percentage": int(data_['skill_percentage']), "description": data_['skill_desc']})
                assert outp_.acknowledged, "Failed to add skill."
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})
            
        @self.route("/delete_skill", methods=["POST"])
        def delete_skill():
            if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv("ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                return json.dumps({"error": "ACCESS_DENIED"})
            try:
                data_ = json.loads(request.data.decode())
                skills_coll = self.mongodb.get_collection(self.skills_collection_name)
                outp_ = skills_coll.delete_one({"_id": bson.ObjectId(data_['skill_id'])})
                assert outp_.acknowledged, "Failed to delete skill."
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/edit_skills", methods=["POST"])
        def edit_skills():
            if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv("ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                return json.dumps({"error": "ACCESS_DENIED"})
            try:
                data_ = json.loads(request.data.decode())
                skills_coll = self.mongodb.get_collection(self.skills_collection_name)
                outp_ = skills_coll.update_one({"_id": bson.ObjectId(data_['skill_id'])}, {"$set": {"title": data_["new_title"], "percentage": int(data_["new_percentage"]), "description": data_["new_desc"]}})
                assert outp_.acknowledged, "Failed to edit skill."
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/get_font_families", methods=["POST"])
        def get_font_families():
            if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv(
                    "ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                return json.dumps({"error": "ACCESS_DENIED"})
            try:
                r = requests.get(f"https://www.googleapis.com/webfonts/v1/webfonts?key={os.getenv('GOOGLE_FONT_API_KEY')}")
                return json.dumps({"families": [item["family"] for item in r.json()["items"]]})
            except BaseException as e:
                return json.dumps({"error": str(e)})

        @self.route("/add_blog", methods=["POST"])
        def add_blog_post():
            try:
                if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv(
                        "ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                    return json.dumps({"error": "ACCESS_DENIED"})
                data_ = json.loads(base64.b64decode(request.data.decode()).decode())
                col_ = self.mongodb.get_collection(self.blog_collection_name)
                blog_id = data_["blog_id"]
                del data_["blog_id"]
                if blog_id:
                    col_.update_one({"_id": ObjectId(blog_id)}, {"$set": data_})
                else:
                    db_resp = col_.insert_one(data_)
                    blog_id = db_resp.inserted_id
                return json.dumps({"status": "success", "blog_id": str(blog_id)})
            except BaseException as e:
                return json.dumps({"status": "error", "error": str(e)})

        @self.route("/get_blog_title_date", methods=["POST"])
        def get_blog_title_date():
            if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv(
                    "ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                return json.dumps({"error": "ACCESS_DENIED"})
            col_ = self.mongodb.get_collection(self.blog_collection_name)
            to_ret = []
            for item in col_.find({}, {"title": True, "publish_date": True}):
                item["_id"] = str(item["_id"])
                to_ret.append(item)
            return json.dumps({"blogs": to_ret})

        @self.route("/delete_blog", methods=["POST"])
        def delete_blog():
            if session.get("admin_uname") != os.getenv("ADMIN_USERNAME") or session.get("admin_pass") != os.getenv(
                    "ADMIN_PASSWORD") or session.get("admin_key") != os.getenv("ADMIN_KEY"):
                return json.dumps({"error": "ACCESS_DENIED"})
            try:
                data_ = json.loads(request.data.decode())
                col_ = self.mongodb.get_collection(self.blog_collection_name)
                col_.delete_one({"_id": ObjectId(data_["blog_id"])})
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "error", "error": str(e)})

    def setup_public_endpoints(self):
        @self.route("/get_project_categories", methods=["POST"])
        def get_project_categories():
            project_coll = self.mongodb.get_collection(self.project_collection_name)
            categories = project_coll.distinct("category")
            return json.dumps({"categories": categories})

        @self.route("/get_projects", methods=["POST"])
        def get_projects():
            data_ = json.loads(request.data.decode())
            project_coll = self.mongodb.get_collection(self.project_collection_name)
            to_ret = []
            to_exclude = {}
            if "exclude" in data_:
                to_exclude = {item: False for item in data_["exclude"]}

            for item in project_coll.find({}, to_exclude).skip(data_["start"]).limit(data_["end"]):
                item["_id"] = str(item["_id"])
                to_ret.append(item)
            return json.dumps({"projects": to_ret})

        @self.route("/get_project_by_id", methods=["POST"])
        def get_project_by_id():
            try:
                data_ = json.loads(request.data.decode())
                project_coll = self.mongodb.get_collection(self.project_collection_name)
                to_ret = project_coll.find_one({"_id": bson.ObjectId(data_["id"])})
                if to_ret is None:
                    return json.dumps({"status": "failed", "error": "This project no longer exists, maybe deleted by admin. Reload the page for updates."})
                to_ret["_id"] = str(to_ret["_id"])
                return json.dumps({"status": "success", "project": to_ret})
            except bson.errors.InvalidId as no_id_found:
                return json.dumps({"status": "failed", "error": str(no_id_found)})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/send_verification_code", methods=["POST"])
        def send_verification_code():
            try:
                data_ = json.loads(request.data.decode())
                send_email_verification_code(data_["gmail"], data_["code"])
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/send_contact_application", methods=["POST"])
        def send_contact_application():
            try:
                data_ = json.loads(request.data.decode())
                send_contact_mail(data_["date"], data_["name"], data_["email"], data_["age"], data_["phone_no"], data_["message"])
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/send_hire_application", methods=["POST"])
        def send_hire_application():
            try:
                data_ = json.loads(request.data.decode())
                send_hire_mail(data_["cli_name"], data_["cli_gmail"], data_["date_of_submission"], data_["project_info"])
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "error", "error": str(e)})

        @self.route("/get_services", methods=["POST"])
        def send_services():
            data_ = json.loads(request.data.decode())
            services_coll = self.mongodb.get_collection(self.services_collection_name)
            to_ret = []
            for item in services_coll.find({}, {ex: 0 for ex in data_["exclude"]}):
                item["_id"] = str(item["_id"])
                to_ret.append(item)
            return json.dumps({"services": to_ret})

        @self.route("/get_service_by_id", methods=["POST"])
        def get_service_by_id():
            try:
                data_ = json.loads(request.data.decode())
                services_coll = self.mongodb.get_collection(self.services_collection_name)
                to_ret = services_coll.find_one({"_id": bson.ObjectId(data_["_id"])}, {"service_icon": 0, "_id": 0})
                return json.dumps({"status": "success", "data": to_ret})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        # @self.get("/get_skills")
        # def get_skills():
        #     db = self._get_db()
        #     try:
        #         statement = select(Skills).order_by(Skills.percentage)
        #         skills = db.execute(statement).scalars().all()
        #         skills_to_send = [SkillResponseDto.from_model(skill) for skill in skills]
        #         to_ret = {"status": "success", "skills": skills_to_send}
        #         return jsonify(to_ret)
        #     except BaseException as e:
        #         return jsonify({"status": "failed", "error": str(e)})

        @self.route("/get_blog_posts", methods=["GET"])
        def getBlogPosts():
            # returns blog post list with only description, title and publish date for preview only.
            data_ = request.args
            col_ = self.mongodb.get_collection(self.blog_collection_name)
            resp_ = col_.find({}, {"html_content": False, "additional_fonts": False}).skip(int(data_["from"])).limit(int(data_["to"]))
            to_ret = []
            for item in resp_:
                item["_id"] = str(item["_id"])
                to_ret.append(item)
            return json.dumps({"posts": to_ret, "total_posts": col_.count_documents({})})

        @self.route("/get_blog_post", methods=["POST"])
        def getBlogPost():
            # return any particular blog with given blog id.
            try:
                data_ = json.loads(request.data.decode())
                col_ = self.mongodb.get_collection(self.blog_collection_name)
                to_ret = col_.find_one({"_id": ObjectId(data_["blog_id"])}, {"_id": False, "description": False})
                return {"status": "success", "blog_data": to_ret}
            except BaseException as e:
                return {"status": "error", "error": str(e)}

        @self.route("/post_interactions", methods=["POST"])
        def saveBlogPostInteraction():
            data_ = request.json
            col_ = self.mongodb.get_collection(self.post_interactions_collection_name)
            try:
                to_add = {
                    "post_id": data_["post_id"],
                    "user_id": data_["user_id"],
                    "type": PostTypes(data_["type"]).value,
                    "action": PostActions(data_["action"]).value,
                    "comment": data_["comment"]
                }
                col_.insert_one(to_add)
            except BaseException as e:
                return {"status": "failed", "error": str(e)}

            return {"status": "success"}

    def setup_login_ep(self):
        @self.route("/check_admin_verification", methods=["POST"])
        def check_admin_verification():
            if session.get("admin_uname") == os.getenv("ADMIN_USERNAME") and session.get("admin_pass") == os.getenv("ADMIN_PASSWORD") and session.get("admin_key") == os.getenv("ADMIN_KEY"):
                return "LOGIN_SUCCESS"
            else:
                return "LOGIN_FAILED"

        @self.route("/admin_verification", methods=["POST"])
        def admin_verification():
            data_ = json.loads(request.data.decode())
            if data_["uname"] == os.getenv("ADMIN_USERNAME") and data_["password"] == os.getenv("ADMIN_PASSWORD") and data_["key"] == os.getenv("ADMIN_KEY"):
                session["admin_uname"] = data_["uname"]
                session["admin_pass"] = data_["password"]
                session["admin_key"] = data_["key"]
                return "LOGIN_SUCCESS"
            else:
                return "LOGIN_FAILED"

        @self.route("/signup/add_account", methods=["POST"])
        def onSignup():
            data_ = json.loads(request.data.decode())
            users_coll = self.mongodb.get_collection(self.users_collection_name)
            if users_coll.find_one({"gmail": data_["gmail"]}) is not None:
                return json.dumps({"status": "failed", "error": "Account already exists!"})
            data_["with_google"] = False
            users_coll.insert_one(data_)
            session["user_creds"] = {"gmail": data_["gmail"], "password": data_["password"], "with_google": False}
            return json.dumps({"status": "success"})

        @self.route("/signup/account_exists", methods=["POST"])
        def onAccountExists():
            data_ = json.loads(request.data.decode())
            users_coll = self.mongodb.get_collection(self.users_collection_name)
            if users_coll.find_one({"gmail": data_["gmail"]}) is not None:
                return json.dumps({"status": "success", "exists": True})
            return json.dumps({"status": "success", "exists": False})

        @self.route("/login/with_account", methods=["POST"])
        def onLoginWithAccount():
            data_ = json.loads(request.data.decode())
            users_coll = self.mongodb.get_collection(self.users_collection_name)
            from_db = users_coll.find_one({"gmail": data_["gmail"], "password": data_["password"], "with_google": False})
            if from_db is None:
                return json.dumps({"status": "failed", "error": "Invalid credentials or account doesn't exists."})
            else:
                session["user_creds"] = {"gmail": data_["gmail"], "password": data_["password"], "with_google": False}
                return json.dumps({"status": "success"})

        @self.route("/login/get_status", methods=["POST"])
        def onGetLoginStatus():
            if "user_creds" in session:
                return json.dumps({"status": "success", "is_login": True})
            else:
                return json.dumps({"status": "success", "is_login": False})

        @self.route("/login/get_creds", methods=["POST"])
        def onGetLoginCreds():
            try:
                users_coll = self.mongodb.get_collection(self.users_collection_name)
                session_creds = session["user_creds"]
                if session_creds["with_google"]:
                    from_db = users_coll.find_one({"gmail": session_creds["gmail"], "with_google": True},{"_id": False})
                else:
                    from_db = users_coll.find_one({"gmail": session_creds["gmail"], "password": session_creds["password"]}, {"_id": False})
                assert from_db, "No login credentials found"
                return json.dumps({"status": "success"} | from_db)
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/logout", methods=["POST"])
        def onLogout():
            try:
                del session["user_creds"]
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/modify_account", methods=["POST"])
        def onModifyAccount():
            try:
                data_ = json.loads(request.data.decode())
                session_creds = session["user_creds"]
                user_coll = self.mongodb.get_collection(self.users_collection_name)
                if session_creds["with_google"]:
                    user_coll.update_one({"gmail": session_creds["gmail"], "with_google": True}, {"$set": data_})
                else:
                    user_coll.update_one({"gmail": session_creds["gmail"], "password": session_creds["password"], "with_google": False}, {"$set": data_})
                if "gmail" in data_:
                    session["user_creds"] = session_creds | {"gmail": data_["gmail"]}
                if "password" in data_:
                    session["user_creds"] = session_creds | {"password": data_["password"]}
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/delete_account", methods=["POST"])
        def onDeleteAccount():
            try:
                user_coll = self.mongodb.get_collection(self.users_collection_name)
                session_creds = session["user_creds"]
                if session_creds["with_google"]:
                    user_coll.delete_one({"gmail": session_creds["gmail"], "with_google": True})
                else:
                    user_coll.delete_one({"gmail": session_creds["gmail"], "password": session_creds["password"], "with_google": False})
                onLogout()
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

        @self.route("/login_with_google", methods=["POST"])
        def loginWithGoogle():
            try:
                token_ = request.data.decode()
                id_info = id_token.verify_oauth2_token(token_, grequests.Request(), os.getenv("GOOGLE_SIGNUP_CLIENT_ID"))
                col_ = self.mongodb.get_collection(self.users_collection_name)
                found_ = col_.find_one({"gmail": id_info["email"]})
                if found_ is None:
                    to_put = {"user_name": id_info["name"], "gmail": id_info["email"], "password": None, "dob": None, "phone_no": None, "with_google": True}
                    col_.insert_one(to_put)
                elif found_ and not found_.get("with_google"):
                    return json.dumps({"status": "failed", "error": "MANUAL_ACCOUNT_DETECTED"})
                session["user_creds"] = {"gmail": id_info["email"], "with_google": True}
                return json.dumps({"status": "success"})
            except BaseException as e:
                return json.dumps({"status": "failed", "error": str(e)})

    def launch(self):
        self.websoc.run(self, host="0.0.0.0", port=8080, allow_unsafe_werkzeug=True)

# --------------------------------------------------------------

web_svr = WebSvr()
web_svr.setup_protected_endpoints()
web_svr.setup_public_endpoints()
web_svr.setup_login_ep()

@web_svr.route("/")
@web_svr.route("/skills")
@web_svr.route("/projects")
@web_svr.route("/project_view")
@web_svr.route("/experience")
@web_svr.route("/services")
@web_svr.route("/about_me")
@web_svr.route("/contact")
@web_svr.route("/administrator")
@web_svr.route("/hire_me")
@web_svr.route("/signup")
@web_svr.route("/login")
@web_svr.route("/blog")
@web_svr.route("/blog_preview")
@web_svr.errorhandler(404)
def home(*args):
    return render_template("index.html")

if __name__ == "__main__":
    web_svr.run(host="0.0.0.0", port=8080)
    # web_svr.run(host="127.0.0.1", port=8080)