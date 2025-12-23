export type STTCallback = (text: string, isFinal: boolean) => void;
export type STTErrorCallback = (error: string) => void;

export interface ISTTService {
  start(language: string, onResult: STTCallback, onError?: STTErrorCallback): void;
  stop(): void;
  isListening(): boolean;
}
