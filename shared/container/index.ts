import { GeminiTranslationService } from "../../modules/translation/infrastructure/GeminiTranslationService";
import { WebSpeechSTTService } from "../../modules/audio/infrastructure/WebSpeechSTTService";
import { WebSpeechTTSService } from "../../modules/audio/infrastructure/WebSpeechTTSService";

// Singleton instances
export const translationService = new GeminiTranslationService();
export const sttService = new WebSpeechSTTService();
export const ttsService = new WebSpeechTTSService();
