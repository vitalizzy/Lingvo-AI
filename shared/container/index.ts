import { GeminiTranslationService } from "../../modules/translation/infrastructure/GeminiTranslationService";
import { WebSpeechSTTService } from "../../modules/audio/infrastructure/WebSpeechSTTService";
import { WebSpeechTTSService } from "../../modules/audio/infrastructure/WebSpeechTTSService";
import { BroadcastSessionService } from "../../modules/session/infrastructure/BroadcastSessionService";

// Singleton instances
export const translationService = new GeminiTranslationService();
export const sttService = new WebSpeechSTTService();
export const ttsService = new WebSpeechTTSService();
export const sessionService = new BroadcastSessionService();
