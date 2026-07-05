import uuid
import datetime
from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from .database import Base

class Session(Base):
    __tablename__ = "sessions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_name = Column(String)
    department = Column(String)
    semester = Column(Integer)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    messages = relationship("Message", back_populates="session")
    critical_case = relationship("CriticalCase", back_populates="session", uselist=False)

class Message(Base):
    __tablename__ = "messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("sessions.id"))
    sender = Column(String) # 'user' or 'ai'
    text = Column(String)
    intent = Column(String, nullable=True)
    risk_level = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    session = relationship("Session", back_populates="messages")

class CriticalCase(Base):
    __tablename__ = "critical_cases"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("sessions.id"))
    risk_level = Column(String)
    status = Column(String, default="new") # new, resolved
    summary = Column(String, nullable=True)
    session = relationship("Session", back_populates="critical_case")

class FAQItem(Base):
    __tablename__ = "faqs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    question = Column(String)
    answer = Column(String)