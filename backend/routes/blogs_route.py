from flask import Blueprint, g, request
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from database.models.blogs_model import Blogs
from database.dto.blogs_dto import BlogLiteResponse, BlogResponse
import logging

logger = logging.getLogger(__name__)

api = Blueprint("blogs_api", __name__, url_prefix="/api/v1")

@api.get("/blogs")
def getBlogs():
    page_no = request.args.get("page", default=1, type=int)
    data_per_page = 10

    db: Session = g.db
    total_data_count = db.scalar(select(func.count()).select_from(Blogs))
    total_pages = (total_data_count // data_per_page)+1

    if page_no > total_pages:
        return {"error": "Page index out of range."}, 400

    stmt = select(Blogs).order_by(Blogs.publish_date.desc()).offset((page_no - 1)*data_per_page).limit(data_per_page)

    resp = db.execute(stmt).scalars().all()
    blogs = [BlogLiteResponse.from_model(model) for model in resp]

    return {"blogs": blogs, "page": {"total": total_pages, "current": page_no}}


@api.get("/blogs/full/<int:blog_id>")
def getFullBlogById(blog_id):
    try:
        db: Session = g.db
        stmt = select(Blogs).where(Blogs.id == blog_id)

        blog = db.execute(stmt).scalars().one_or_none()
        if blog is None:
            return {"error": f"Blog with id {blog_id} not exists."}, 400
        else:
            return BlogResponse.from_model(blog)
    except BaseException as err:
        logger.error(err)
        return {"error": str(err)}, 500