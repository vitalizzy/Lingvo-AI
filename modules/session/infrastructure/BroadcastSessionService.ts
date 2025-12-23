import { ISessionService, SessionCallback, SessionEvent } from "../domain/ISessionService";
import { User, Message } from "../../../shared/types/types";

export class BroadcastSessionService implements ISessionService {
  private channel: BroadcastChannel;
  private listeners: SessionCallback[] = [];

  constructor() {
    this.channel = new BroadcastChannel('lingvo_session_channel');
    this.channel.onmessage = (event) => {
      this.notifyListeners(event.data);
    };
  }

  joinSession(sessionId: string, user: User): void {
    const event: SessionEvent = {
      type: 'JOIN',
      payload: { user },
      sessionId,
      senderId: user.id,
      timestamp: Date.now()
    };
    this.channel.postMessage(event);
    // Also notify local listeners so we know we joined (optional, but good for consistency)
    // this.notifyListeners(event); 
  }

  leaveSession(sessionId: string, userId: string): void {
    const event: SessionEvent = {
      type: 'LEAVE',
      payload: {},
      sessionId,
      senderId: userId,
      timestamp: Date.now()
    };
    this.channel.postMessage(event);
  }

  sendMessage(sessionId: string, message: Message): void {
    const event: SessionEvent = {
      type: 'MESSAGE',
      payload: { message },
      sessionId,
      senderId: message.senderId,
      timestamp: Date.now()
    };
    this.channel.postMessage(event);
  }

  updateLanguage(sessionId: string, userId: string, language: string): void {
    const event: SessionEvent = {
      type: 'UPDATE_LANG',
      payload: { language },
      sessionId,
      senderId: userId,
      timestamp: Date.now()
    };
    this.channel.postMessage(event);
  }

  onEvent(callback: SessionCallback): void {
    this.listeners.push(callback);
  }

  offEvent(callback: SessionCallback): void {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  private notifyListeners(event: SessionEvent) {
    this.listeners.forEach(listener => listener(event));
  }
}
