import random
import string
from database import get_database

async def generate_unique_medid() -> str:
    """Generate a unique MedID in format AAA999 (3 uppercase letters + 3 digits)."""
    db = get_database()
    max_attempts = 100
    
    for _ in range(max_attempts):
        letters = ''.join(random.choices(string.ascii_uppercase, k=3))
        digits = ''.join(random.choices(string.digits, k=3))
        medid = f"{letters}{digits}"
        
        # Check uniqueness
        existing = await db.users.find_one({"medId": medid})
        if not existing:
            return medid
    
    raise ValueError("Could not generate unique MedID after maximum attempts")
