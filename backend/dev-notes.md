# Developer Notes During Development
* db instance is available at g.db where g is import from flask.

> To create a new api route in feature.  
Create new file in routes/
And add the following code there
```python
from flask import Blueprint

api = Blueprint("mail_api", __name__, url_prefix="/api/v1")

@api.get("/mail")
def xyz():
    pass
```
then in main.py import the route and register blueprint in `__init__()`
