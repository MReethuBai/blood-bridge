import os
import json
import uuid
import logging
from datetime import datetime

logger = logging.getLogger("bloodbridge.database")
logger.setLevel(logging.INFO)

# Attempt PyMongo connection
USE_MONGO = False
db_client = None
mongo_db = None

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/bloodbridge")
DB_NAME = os.getenv("DB_NAME", "bloodbridge")

try:
    import pymongo
    from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

    client = pymongo.MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
    # Trigger quick server check
    client.admin.command('ping')
    mongo_db = client[DB_NAME]
    USE_MONGO = True
    logger.info(f"Successfully connected to MongoDB at {MONGODB_URI}")
except Exception as e:
    logger.warning(f"MongoDB connection to {MONGODB_URI} failed or not running: {e}")
    logger.info("Initializing embedded persistent MongoDB fallback storage engine.")

class FallbackCollection:
    """In-memory/JSON-persisted MongoDB-like collection for seamless demo execution."""
    def __init__(self, name, db_file="bloodbridge_fallback_db.json"):
        self.name = name
        self.db_file = db_file
        self._ensure_db()

    def _ensure_db(self):
        if not os.path.exists(self.db_file):
            with open(self.db_file, "w") as f:
                json.dump({}, f)

    def _load_data(self):
        try:
            with open(self.db_file, "r") as f:
                data = json.load(f)
                return data.get(self.name, [])
        except Exception:
            return []

    def _save_data(self, records):
        data = {}
        if os.path.exists(self.db_file):
            try:
                with open(self.db_file, "r") as f:
                    data = json.load(f)
            except Exception:
                data = {}
        data[self.name] = records
        with open(self.db_file, "w") as f:
            json.dump(data, f, indent=2, default=str)

    def _match(self, doc, query):
        if not query:
            return True
        for k, v in query.items():
            if k not in doc:
                return False
            if isinstance(v, dict):
                if "$in" in v and doc[k] not in v["$in"]:
                    return False
                if "$ne" in v and doc[k] == v["$ne"]:
                    return False
            elif doc[k] != v:
                return False
        return True

    def find(self, query=None, limit=0):
        records = self._load_data()
        results = [r for r in records if self._match(r, query)]
        if limit > 0:
            return results[:limit]
        return results

    def find_one(self, query=None):
        records = self._load_data()
        for r in records:
            if self._match(r, query):
                return r
        return None

    def insert_one(self, doc):
        records = self._load_data()
        if "_id" not in doc:
            doc["_id"] = str(uuid.uuid4())
        doc["created_at"] = doc.get("created_at", datetime.utcnow().isoformat())
        records.append(doc)
        self._save_data(records)
        class InsertResult:
            inserted_id = doc["_id"]
        return InsertResult()

    def insert_many(self, docs):
        records = self._load_data()
        inserted_ids = []
        for doc in docs:
            if "_id" not in doc:
                doc["_id"] = str(uuid.uuid4())
            doc["created_at"] = doc.get("created_at", datetime.utcnow().isoformat())
            records.append(doc)
            inserted_ids.append(doc["_id"])
        self._save_data(records)
        class InsertManyResult:
            inserted_ids = inserted_ids
        return InsertManyResult()

    def update_one(self, query, update, upsert=False):
        records = self._load_data()
        modified = 0
        for doc in records:
            if self._match(doc, query):
                if "$set" in update:
                    for k, v in update["$set"].items():
                        doc[k] = v
                modified += 1
                break
        if modified == 0 and upsert:
            new_doc = {"_id": str(uuid.uuid4())}
            for k, v in query.items():
                if not isinstance(v, dict):
                    new_doc[k] = v
            if "$set" in update:
                for k, v in update["$set"].items():
                    new_doc[k] = v
            new_doc["created_at"] = new_doc.get("created_at", datetime.utcnow().isoformat())
            records.append(new_doc)
            modified = 1

        self._save_data(records)
        class UpdateResult:
            modified_count = modified
        return UpdateResult()

    def delete_one(self, query):
        records = self._load_data()
        new_records = []
        deleted = 0
        for doc in records:
            if deleted == 0 and self._match(doc, query):
                deleted = 1
                continue
            new_records.append(doc)
        self._save_data(new_records)
        class DeleteResult:
            deleted_count = deleted
        return DeleteResult()

    def count_documents(self, query=None):
        records = self._load_data()
        return len([r for r in records if self._match(r, query)])

    def distinct(self, key, query=None):
        records = self.find(query)
        vals = set()
        for r in records:
            if key in r:
                vals.add(r[key])
        return list(vals)

    def delete_many(self, query=None):
        if not query:
            self._save_data([])
            return
        records = self._load_data()
        new_records = [doc for doc in records if not self._match(doc, query)]
        self._save_data(new_records)


def get_collection(collection_name):
    if USE_MONGO and mongo_db is not None:
        return mongo_db[collection_name]
    return FallbackCollection(collection_name)

def check_db_health():
    return {
        "status": "connected",
        "engine": "MongoDB (PyMongo)" if USE_MONGO else "Embedded Persistent JSON DB (Fallback)",
        "uri": MONGODB_URI if USE_MONGO else "Local Storage fallback"
    }
