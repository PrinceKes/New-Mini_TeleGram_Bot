from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import os
import urllib.parse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Retrieve and encode the MongoDB URI
mongo_uri = os.getenv("MONGO_URI")

parsed_uri = urllib.parse.urlparse(mongo_uri)

encoded_user = urllib.parse.quote_plus(str(parsed_uri.username)) if parsed_uri.username else ''
encoded_password = urllib.parse.quote_plus(str(parsed_uri.password)) if parsed_uri.password else ''

encoded_uri = mongo_uri.replace(parsed_uri.username, encoded_user).replace(parsed_uri.password, encoded_password)

app.config["MONGO_URI"] = encoded_uri

mongo = PyMongo(app)

@app.route('/api/user', methods=['POST'])
def register_user():
    data = request.json
    user_id = data.get("userId")
    user = mongo.db.users.find_one({"user_id": user_id})

    if user:
        mongo.db.users.update_one({"user_id": user_id}, {"$set": data})
    else:
        mongo.db.users.insert_one(data)

    return jsonify({"status": "success"}), 200

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = list(mongo.db.tasks.find())
    for task in tasks:
        task["_id"] = str(task["_id"])
    return jsonify(tasks), 200

@app.route('/api/complete_task', methods=['POST'])
def complete_task():
    data = request.json
    user_id = data.get("user_id")
    task_id = data.get("task_id")
    reward_points = data.get("reward_points")

    mongo.db.users.update_one(
        {"user_id": user_id},
        {"$inc": {"point_balance": reward_points}}
    )

    mongo.db.completed_tasks.insert_one({
        "user_id": user_id,
        "task_id": task_id
    })

    return jsonify({"status": "success"}), 200

if __name__ == '__main__':
    app.run(debug=True)



# from flask import Flask, request, jsonify
# from flask_pymongo import PyMongo
# from bson.objectid import ObjectId
# import os

# app = Flask(__name__)

# app.config["MONGO_URI"] = "mongodb+srv://telegramdb:Adeboye@02@<cluster-address>.mongodb.net/telegram_bot?retryWrites=true&w=majority"
# mongo = PyMongo(app)

# @app.route('/api/user', methods=['POST'])
# def register_user():
#     data = request.json
#     user_id = data.get("userId")
#     user = mongo.db.users.find_one({"user_id": user_id})

#     if user:

#         mongo.db.users.update_one({"user_id": user_id}, {"$set": data})
#     else:

#         mongo.db.users.insert_one(data)

#     return jsonify({"status": "success"}), 200

# @app.route('/api/tasks', methods=['GET'])
# def get_tasks():
#     tasks = list(mongo.db.tasks.find())
#     for task in tasks:
#         task["_id"] = str(task["_id"])
#     return jsonify(tasks), 200

# @app.route('/api/complete_task', methods=['POST'])
# def complete_task():
#     data = request.json
#     user_id = data.get("user_id")
#     task_id = data.get("task_id")
#     reward_points = data.get("reward_points")

#     mongo.db.users.update_one(
#         {"user_id": user_id},
#         {"$inc": {"point_balance": reward_points}}
#     )

#     mongo.db.completed_tasks.insert_one({
#         "user_id": user_id,
#         "task_id": task_id
#     })

#     return jsonify({"status": "success"}), 200

# if __name__ == '__main__':
#     app.run(debug=True)
