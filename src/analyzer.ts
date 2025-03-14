import { getGitDiff } from "./git";
import { enhanceCommitMessage } from "./nlp";
import { formatCommitMessage } from "./provider";

export function analyzeCommitMessage(originalMessage: string): string {
  const diff = getGitDiff();
  if (!diff) return originalMessage;

  const enhancedMessage = enhanceCommitMessage(diff, originalMessage);
  return formatCommitMessage(enhancedMessage);
}
