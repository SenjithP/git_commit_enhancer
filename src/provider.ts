import { CONFIG } from "./config";

export function formatCommitMessage(commitMsg: string): string {
  return commitMsg.length > CONFIG.maxLength ? commitMsg.slice(0, CONFIG.maxLength) + "..." : commitMsg;
}
