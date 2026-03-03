from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017/medprompt"
    jwt_secret: str = "your-secret-key-here"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    llm_model: str = "gpt-3.5-turbo"
    litellm_api_key: Optional[str] = None
    upload_dir: str = "./uploads"
    admin_email: str = "snehat2277@gmail.com"
    frontend_url: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
