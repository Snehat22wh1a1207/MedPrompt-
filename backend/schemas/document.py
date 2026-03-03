from pydantic import BaseModel
from typing import Optional

class AnalyzeTextRequest(BaseModel):
    text: str
    language: str = "en"
    inputType: str = "text"
