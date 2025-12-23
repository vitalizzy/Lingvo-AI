export interface ITTSService {
  speak(text: string, language: string): Promise<void>;
  stop(): void;
  isSpeaking(): boolean;
}
