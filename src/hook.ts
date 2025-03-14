import { analyzeCommitMessage } from "./analyzer";
import * as fs from "fs";

console.log(process.argv, "this is to reds");

const commitMsgFile = process.argv[2];
if (!commitMsgFile) {
    console.error("❌ Error: No commit message file provided.");
    process.exit(1);
}

// Read the original commit message
let originalMessage = fs.readFileSync(commitMsgFile, "utf-8").trim();

// Check if the original message is empty or just contains unwanted content
if (originalMessage === "" || originalMessage.includes("diff --git")) {
    console.error("❌ Error: Invalid commit message content.");
    process.exit(1);
}

// If originalMessage is being produced by an interactive message or certain rules, you can clean it further
const cleanMessage = originalMessage.replace(/^\[.*?\]\s*/, ''); // Remove any prefix with square brackets, if applicable

// Analyze the cleaned original commit message
const analyzedMessage = analyzeCommitMessage(cleanMessage);

// Function to create a meaningful commit purpose
const generateMeaningfulCommitPurpose = (original: string): string => {
    // Logic to modify the original message to state its purpose more clearly
    if (original.startsWith("fix")) {
        return `Fix: ${original.slice(4).trim()}`;
    } else if (original.startsWith("feat")) {
        return `Feature: ${original.slice(6).trim()}`;
    } else if (original.startsWith("docs")) {
        return `Documentation: ${original.slice(6).trim()}`;
    } else if (original.startsWith("chore")) {
        return `Chore: ${original.slice(6).trim()}`;
    } else {
        return `Update: ${original.trim()}`; // Default case
    }
};

// Generate the meaningful commit message
const enhancedMessage = generateMeaningfulCommitPurpose(analyzedMessage);

// Write the enhanced message back to the commit message file
fs.writeFileSync(commitMsgFile, enhancedMessage);
console.log(`✅ Commit message enhanced: ${enhancedMessage}`);