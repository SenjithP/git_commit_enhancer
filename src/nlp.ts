import { CONFIG } from "./config";

export function enhanceCommitMessage(diff: string, originalMessage: string): string {
  const meaningfulWords = diff
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 5)
    .join(", ");

  const commitType = CONFIG.commitTypes.includes(originalMessage.split(" ")[0])
    ? originalMessage.split(" ")[0]
    : "chore";

  return `${commitType}: ${meaningfulWords}...`;
}
