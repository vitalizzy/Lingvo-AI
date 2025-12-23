import { ITTSService } from "../domain/ITTSService";

export class WebSpeechTTSService implements ITTSService {
  private synthesis: SpeechSynthesis | null = null;
  private speaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  speak(text: string, language: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject("Speech synthesis not supported");
        return;
      }

      // Cancel any current speaking
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      
      // Try to find a voice for the language
      const voices = this.synthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(language));
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        this.speaking = true;
      };

      utterance.onend = () => {
        this.speaking = false;
        resolve();
      };

      utterance.onerror = (event) => {
        this.speaking = false;
        console.error("TTS Error", event);
        reject(event);
      };

      this.synthesis.speak(utterance);
    });
  }

  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.speaking = false;
    }
  }

  isSpeaking(): boolean {
    return this.speaking;
  }
}
