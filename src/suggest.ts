import { CONFIG } from "./config";

export function suggestCommitType(): string {
  return CONFIG.commitTypes[Math.floor(Math.random() * CONFIG.commitTypes.length)];
}
