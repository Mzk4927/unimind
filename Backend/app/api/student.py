from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Session as DBSession, Message, CriticalCase
from ..services import ai_service, create_token
from pydantic import BaseModel

router = APIRouter()

class StartSession(BaseModel):
    name: str
    dept: str
    semester: int

class ChatRequest(BaseModel):
    session_id: str
    message: str

@router.post("/start")
def start(data: StartSession, db: Session = Depends(get_db)):
    sess = DBSession(student_name=data.name, department=data.dept, semester=data.semester)
    db.add(sess)
    db.commit()
    db.refresh(sess)
    return {"token": create_token({"sub": sess.id}), "session_id": sess.id}

@router.post("/chat")
async def chat(req: ChatRequest, db: Session = Depends(get_db)):
    # 1. Save User Message
    user_msg = Message(session_id=req.session_id, sender="user", text=req.message)
    db.add(user_msg)
    
    # 2. Get Context & Generate
    context = await ai_service.retrieve(req.message)
    # Fetch recent history
    history = db.query(Message).filter(Message.session_id == req.session_id).order_by(Message.timestamp).all()
    history_text = [{"role": m.sender, "text": m.text} for m in history]
    
    ai_res = await ai_service.chat(req.message, history_text, context)
    
    # 3. Save AI Message
    ai_msg = Message(
        session_id=req.session_id, 
        sender="ai", 
        text=ai_res['text'], 
        intent=ai_res.get('intent'), 
        risk_level=ai_res.get('riskLevel')
    )
    db.add(ai_msg)
    
    # 4. Critical Case Logic
    if ai_res.get('riskLevel') == 'HIGH':
        case = CriticalCase(session_id=req.session_id, risk_level="HIGH", summary="High risk detected by AI")
        db.add(case)
        
    db.commit()
    
    # Return full history
    all_msgs = db.query(Message).filter(Message.session_id == req.session_id).all()
    return {"response": ai_res['text'], "history": all_msgs}