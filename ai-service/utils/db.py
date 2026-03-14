import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

_client: MongoClient = None


def get_db():
    global _client
    if _client is None:
        uri = os.getenv("MONGODB_URI")
        if not uri:
            raise RuntimeError("MONGODB_URI not set in environment")
        _client = MongoClient(uri)
    return _client["pranexusai"]
