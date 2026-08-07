import "../env.js";
import { prisma } from "../database.js";

const languages = [
  { name: "Português", code: "pt-BR" },
  { name: "English", code: "en-US" },
  { name: "Español", code: "es-ES" },
  { name: "Français", code: "fr-FR" },
  { name: "Deutsch", code: "de-DE" },
  { name: "Italiano", code: "it-IT" },
  { name: "日本語", code: "ja-JP" },
  { name: "한국어", code: "ko-KR" },
  { name: "中文", code: "zh-CN" },
  { name: "Русский", code: "ru-RU" },
  { name: "العربية", code: "ar-SA" },
  { name: "Nederlands", code: "nl-NL" },
  { name: "Polski", code: "pl-PL" },
  { name: "Svenska", code: "sv-SE" },
  { name: "Türkçe", code: "tr-TR" },
  { name: "हिन्दी", code: "hi-IN" },
];

const createLanguages = async () => {
  console.log("\nSeeding languages...");
  await prisma.languages.createMany({ data: languages });
  console.log("\nFinish seeding languages.");

  process.exit(0);
};

createLanguages();
