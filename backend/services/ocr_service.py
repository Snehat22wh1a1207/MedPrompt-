import pytesseract
from PIL import Image
import pdfplumber
import io

async def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """Extract text from uploaded file using OCR or PDF parsing."""
    extension = filename.lower().split('.')[-1]
    
    if extension == 'pdf':
        return extract_from_pdf(file_content)
    elif extension in ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'dcm']:
        return extract_from_image(file_content)
    else:
        raise ValueError(f"Unsupported file format: {extension}")

def extract_from_pdf(file_content: bytes) -> str:
    text_parts = []
    with pdfplumber.open(io.BytesIO(file_content)) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
    
    full_text = "\n".join(text_parts)
    
    if not full_text.strip():
        try:
            from pdf2image import convert_from_bytes
            images = convert_from_bytes(file_content)
            for img in images:
                text_parts.append(pytesseract.image_to_string(img))
            full_text = "\n".join(text_parts)
        except Exception:
            pass
    
    return full_text

def extract_from_image(file_content: bytes) -> str:
    image = Image.open(io.BytesIO(file_content))
    text = pytesseract.image_to_string(image)
    return text
