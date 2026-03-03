from litellm import completion
import json
import os

async def analyze_medical_document(extracted_text: str, language: str = "en") -> dict:
    language_names = {
        "en": "English",
        "te": "Telugu",
        "hi": "Hindi",
        "ta": "Tamil"
    }
    
    target_language = language_names.get(language, "English")
    
    system_prompt = f"""You are a medical document analysis AI assistant.
Analyze the provided medical document text and return a JSON response with two fields:
1. "overview": A structured JSON object extracting ONLY information that exists in the document.
   Possible fields (include ONLY if data exists):
   - "patient_info": {{"name": "...", "age": "...", "gender": "...", "patient_id": "..."}}
   - "hospital_info": {{"hospital_name": "...", "referring_doctor": "...", "consulting_doctor": "...", "report_date": "..."}}
   - "test_results": [{{"test_name": "...", "value": "...", "reference_range": "...", "is_abnormal": false}}]
   - "abnormal_findings": ["list of abnormal findings"]
   - "medications": [{{"medicine_name": "...", "dosage": "...", "frequency": "...", "duration": "..."}}]
2. "summary": A patient-friendly explanation in {target_language}.
   Rules:
   - Use non-technical, simple language
   - Explain each test result in daily-life meaning
   - Highlight abnormal values
   - Mention possible symptoms only if relevant
   - Give general lifestyle guidance
   - Do NOT prescribe medicines
   - Recommend consulting a doctor if needed
   - Tone: Reassuring, human, personalized

ALL text in the response must be in {target_language}.
Return ONLY valid JSON."""
    
    try:
        response = completion(
            model=os.getenv("LLM_MODEL", "gpt-3.5-turbo"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze this medical document:\n\n{extracted_text}"}
            ],
            temperature=0.3,
            max_tokens=2000,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        import logging
        logging.getLogger(__name__).error("Medical document analysis failed: %s", e)
        return {
            "overview": {"error": "Analysis failed. Please try again."},
            "summary": "We encountered an issue analyzing your document. Please try again or consult a healthcare professional."
        }
