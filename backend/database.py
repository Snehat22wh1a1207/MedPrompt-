from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client = None
db = None

async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client.medprompt
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("medId", unique=True)
    print("Connected to MongoDB")

async def close_mongo_connection():
    global client
    if client:
        client.close()
    print("Disconnected from MongoDB")

def get_database():
    return db
