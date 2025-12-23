export interface ITranslationService {
  translate(text: string, sourceLang: string, targetLang: string): Promise<string>;
  simulatePeerResponse(lastUserMessage: string, peerLang: string): Promise<string>;
}
