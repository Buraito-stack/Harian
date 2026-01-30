import { en } from "./en";
import { id } from "./id";
import type { Language, Translations } from "../types";

export const translations: Record<Language, Translations> = {
  en,
  id,
};

export const languageNames: Record<Language, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};

export const defaultLanguage: Language = "id";
