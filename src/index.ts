import { analyzeCommitMessage } from "./analyzer";

const userMessage = process.argv.slice(2).join(" ") || "chore: update code";
const enhancedMessage = analyzeCommitMessage(userMessage);

console.log(`✅ Suggested commit message: ${enhancedMessage}`);
