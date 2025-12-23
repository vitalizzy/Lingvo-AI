import { ISTTService, STTCallback, STTErrorCallback } from "../domain/ISTTService";

export class WebSpeechSTTService implements ISTTService {
  private recognition: any = null;
  private isListeningState: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
      }
    }
  }

  start(language: string, onResult: STTCallback, onError?: STTErrorCallback): void {
    if (!this.recognition) {
      onError?.("Speech recognition not supported in this browser.");
      return;
    }

    if (this.isListeningState) {
      this.stop();
    }

    this.recognition.lang = language;
    
    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
          onResult(finalTranscript, true);
        } else {
          interimTranscript += event.results[i][0].transcript;
          onResult(interimTranscript, false);
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      onError?.(event.error);
      this.isListeningState = false;
    };

    this.recognition.onend = () => {
      // Auto-restart if supposed to be listening (unless stopped manually)
      if (this.isListeningState) {
        try {
          this.recognition.start();
        } catch (e) {
          this.isListeningState = false;
        }
      }
    };

    try {
      this.recognition.start();
      this.isListeningState = true;
    } catch (e) {
      console.error("Failed to start recognition", e);
      onError?.("Failed to start recognition");
    }
  }

  stop(): void {
    if (this.recognition) {
      this.isListeningState = false;
      this.recognition.stop();
    }
  }

  isListening(): boolean {
    return this.isListeningState;
  }
}
