import { User, Message } from "../../../shared/types/types";

export type SessionEventType = 'JOIN' | 'MESSAGE' | 'LEAVE' | 'UPDATE_LANG';

export interface SessionEvent {
  type: SessionEventType;
  payload: any;
  sessionId: string;
  senderId: string;
  timestamp: number;
}

export type SessionCallback = (event: SessionEvent) => void;

export interface ISessionService {
  joinSession(sessionId: string, user: User): void;
  leaveSession(sessionId: string, userId: string): void;
  sendMessage(sessionId: string, message: Message): void;
  updateLanguage(sessionId: string, userId: string, language: string): void;
  onEvent(callback: SessionCallback): void;
  offEvent(callback: SessionCallback): void;
}
