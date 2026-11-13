import os
import json
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
LOCAL_DB_FILE = Path("data/local_storage.json")

client = None
db = None
using_mongo = False

if MONGODB_URI:
    try:
        from pymongo import MongoClient
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
        client.admin.command("ping")
        db = client["banking_intelligence"]
        using_mongo = True
        print("[Database] Successfully connected to MongoDB.")
    except Exception as e:
        print(f"[Database] Could not connect to MongoDB ({e}). Falling back to local storage.")
        using_mongo = False
        client = None
        db = None


class LocalStorageFallback:
    """Fallback local datastore for predictions and audit logs."""
    def __init__(self, filepath=LOCAL_DB_FILE):
        self.filepath = filepath
        self.filepath.parent.mkdir(parents=True, exist_ok=True)
        if not self.filepath.exists():
            self._save({
                "predictions": [],
                "audit_logs": [],
                "agent_sessions": []
            })

    def _load(self):
        try:
            with open(self.filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {"predictions": [], "audit_logs": [], "agent_sessions": []}

    def _save(self, data):
        with open(self.filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)

    def insert_prediction(self, record):
        data = self._load()
        data["predictions"].insert(0, record)
        # Keep last 500
        data["predictions"] = data["predictions"][:500]
        self._save(data)

    def get_predictions(self, module=None, limit=50):
        data = self._load()
        preds = data.get("predictions", [])
        if module:
            preds = [p for p in preds if p.get("module") == module]
        return preds[:limit]

    def insert_audit_log(self, record):
        data = self._load()
        data["audit_logs"].insert(0, record)
        data["audit_logs"] = data["audit_logs"][:500]
        self._save(data)

    def get_audit_logs(self, limit=50):
        data = self._load()
        return data.get("audit_logs", [])[:limit]


local_db = LocalStorageFallback()


def record_prediction(module: str, model_version: str, input_summary: dict, output: dict, request_id: str):
    record = {
        "request_id": request_id,
        "module": module,
        "model_version": model_version,
        "input_summary": input_summary,
        "output": output,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    if using_mongo and db is not None:
        try:
            db["predictions"].insert_one(record)
            return record
        except Exception as e:
            print(f"Error persisting to MongoDB: {e}")
    local_db.insert_prediction(record)
    return record


def record_audit_log(actor_id: str, action: str, resource_type: str, outcome: str, details: dict = None):
    record = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "actor_id": actor_id,
        "action": action,
        "resource_type": resource_type,
        "outcome": outcome,
        "details": details or {}
    }
    if using_mongo and db is not None:
        try:
            db["audit_logs"].insert_one(record)
            return record
        except Exception as e:
            print(f"Error persisting audit log to Mongo: {e}")
    local_db.insert_audit_log(record)
    return record


def get_stored_predictions(module: str = None, limit: int = 50):
    if using_mongo and db is not None:
        try:
            query = {"module": module} if module else {}
            cursor = db["predictions"].find(query, {"_id": 0}).sort("created_at", -1).limit(limit)
            return list(cursor)
        except Exception:
            pass
    return local_db.get_predictions(module=module, limit=limit)


def get_stored_audit_logs(limit: int = 50):
    if using_mongo and db is not None:
        try:
            cursor = db["audit_logs"].find({}, {"_id": 0}).sort("timestamp", -1).limit(limit)
            return list(cursor)
        except Exception:
            pass
    return local_db.get_audit_logs(limit=limit)


def check_database_status():
    if using_mongo and client:
        try:
            client.admin.command("ping")
            return {"status": "connected", "type": "MongoDB"}
        except Exception as e:
            return {"status": "degraded", "type": "MongoDB", "error": str(e)}
    return {"status": "connected", "type": "Local JSON Store"}
