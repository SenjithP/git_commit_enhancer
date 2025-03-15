import * as fs from "fs";
import { execSync } from "child_process";
import { askAI } from "./ai-model";

// Get commit message file path
const commitMsgFile = process.argv[2];
if (!commitMsgFile) {
  console.error("❌ Error: No commit message file provided.");
  process.exit(1);
}

// Get list of changed files
let changedFiles: { status: string; filePath: string }[] = [];
try {
  const result = execSync("git diff --name-status --cached", { encoding: "utf8" }).trim();
  changedFiles = result.split("\n").map((line) => {
    const [status, filePath] = line.split("\t");
    return { status, filePath };
  });
} catch (error) {
  console.error("❌ Error fetching changed files:", error);
  process.exit(1);
}

// Get actual changes in files
const fileChanges: Record<string, string> = {};
changedFiles.forEach(({ filePath }) => {
  try {
    const diffOutput = execSync(`git diff --cached --unified=0 ${filePath}`, { encoding: "utf8" });
    fileChanges[filePath] = diffOutput;
  } catch (error) {
    console.error(`❌ Error fetching changes for ${filePath}:`, error);
  }
});

// Generate commit message
let commitMessage = "Updated files:\n";
changedFiles.forEach(({ status, filePath }) => {
  let action = "";
  switch (status) {
    case "A":
      action = `Added ${filePath}`;
      break;
    case "M":
      action = `Modified ${filePath}`;
      break;
    case "D":
      action = `Deleted ${filePath}`;
      break;
    default:
      action = `Changed ${filePath}`;
      break;
  }
  commitMessage += `- ${action}\n`;
});

// Append actual code changes
commitMessage += "\nChanges:\n";
Object.entries(fileChanges).forEach(([filePath, diff]) => {
  commitMessage += `🔹 **${filePath}**\n\`\`\`\n${diff}\n\`\`\`\n`;
});

// **WAIT for AI response before writing to the commit message file**
askAI(commitMessage)
  .then((modifiedCommitMessage) => {
    console.log(`✅ Commit message set: ${modifiedCommitMessage}`);
    fs.writeFileSync(commitMsgFile, modifiedCommitMessage); // Write AI-generated commit message
  })
  .catch((error) => {
    console.error("❌ Error generating commit message:", error);
    fs.writeFileSync(commitMsgFile, commitMessage); // Fallback to original commit message
  });
