import json
from datetime import datetime, timedelta
from jose import jwt
from google import genai # Updated import
import chromadb 
from .config import settings
from .models import FAQItem

# --- AI & RAG ---
class AIService:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY is missing. Check Backend/.env and restart the backend.")

        # Initialize the new Client
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        # USE LOCAL PERSISTENT CLIENT (No separate server needed)
        self.chroma = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
        self.collection = self.chroma.get_or_create_collection("unimind")

    async def get_embedding(self, text):
        try:
            # The embedding model name varies by SDK/version. Try supported options and fail soft.
            for model_name in ("text-embedding-004", "embedding-001"):
                try:
                    res = self.client.models.embed_content(model=model_name, contents=text)
                    return res.embeddings[0].values if res.embeddings else []
                except Exception:
                    continue
            # The new client returns an object with .embeddings attribute
            # Depending on the exact response structure for single content, it might be a list of embeddings
            return []
        except Exception as e: 
            print(f"Embedding unavailable, continuing without vector context: {e}")
            return []

    async def ingest_faqs(self, db):
        # (Same logic as before, just ensuring sync)
        faqs = db.query(FAQItem).all()
        if not faqs: return
        ids = [f.id for f in faqs]
        docs = [f"Q: {f.question}\nA: {f.answer}" for f in faqs]
        embeddings = [await self.get_embedding(d) for d in docs]
        valid_data = [(i, d, e) for i, d, e in zip(ids, docs, embeddings) if e]
        if valid_data:
            self.collection.upsert(
                ids=[x[0] for x in valid_data],
                documents=[x[1] for x in valid_data],
                embeddings=[x[2] for x in valid_data]
            )

    async def retrieve(self, query):
        emb = await self.get_embedding(query)
        if not emb: return ""
        res = self.collection.query(query_embeddings=[emb], n_results=3)
        return "\n".join(res['documents'][0]) if res['documents'] else ""

    async def chat(self, message, history, context):
        prompt = f"""
        You are UniMind, a university assistant. 
        Context from database: {context}
        User History: {history[-3:]}
        User: {message}
        Response (JSON with 'text', 'intent', 'riskLevel' [LOW/HIGH]):
        """
        try:
            # Updated generation call
            # Note: The new client might not be fully async yet in all versions, 
            # but assuming standard usage based on your snippet:
            res = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt
            )
            # Basic cleanup to ensure JSON parsing
            clean_text = res.text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_text)
        except Exception as e:
            err_text = str(e)
            print(f"Chat error ({settings.GEMINI_MODEL}): {err_text}")

            if self._is_quota_error(err_text):
                return self._fallback_chat(
                    message,
                    "Gemini quota is exhausted for this API key/project. Please replace the key or enable billing."
                )

            # Local fallback so the UI still gets a useful answer when Gemini is unavailable.
            return self._fallback_chat(message)

    def _is_quota_error(self, err_text: str) -> bool:
        lower = err_text.lower()
        return "resource_exhausted" in lower or "quota" in lower or "429" in err_text

    def _fallback_chat(self, message, override_text: str | None = None):
        lower = message.lower().strip()

        if override_text:
            text = override_text
        elif not lower:
            text = "Please type a message so I can help."
        elif any(word in lower for word in ["hello", "hi", "hey"]):
            text = "Hello. UniMind is online, but Gemini is currently unavailable. I can still help with rover navigation and dashboard status."
        elif "battery" in lower:
            text = "Current rover battery is shown in the status panel. If you want, I can help interpret the live telemetry."
        elif any(word in lower for word in ["navigation", "route", "destination", "go to"]):
            text = "I can help with navigation. Use the destination panel to select a target and the rover will plan the route."
        elif any(word in lower for word in ["slam", "mapping", "localization"]):
            text = "SLAM is available from the dashboard. If you want, I can explain the current mapping and localization state."
        elif any(word in lower for word in ["computer science", "computer engineering", "department"]):
            text = "Computer science and computer engineering usually cover programming, data structures, algorithms, operating systems, computer architecture, networks, databases, and software engineering."
        else:
            text = "Gemini is temporarily unavailable. I can still help with rover controls, telemetry, SLAM, and destination selection."

        return {
            "text": text,
            "intent": "fallback",
            "riskLevel": "LOW"
        }

ai_service = AIService()

# --- Auth ---
def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=1)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm="HS256")