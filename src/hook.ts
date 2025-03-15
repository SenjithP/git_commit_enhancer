import * as fs from "fs";
import { execSync } from "child_process";
import { askAI } from "./ai-model";

const commitMsgFile = process.argv[2];
if (!commitMsgFile) {
  console.error("❌ Error: No commit message file provided.");
  process.exit(1);
}

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

const fileChanges: Record<string, string> = {};
changedFiles.forEach(({ filePath }) => {
  try {
    const diffOutput = execSync(`git diff --cached --unified=0 ${filePath}`, { encoding: "utf8" });
    fileChanges[filePath] = diffOutput;
  } catch (error) {
    console.error(`❌ Error fetching changes for ${filePath}:`, error);
  }
});

let commitMessage = "Updated files:\n";
changedFiles.forEach(({ status, filePath }) => {
  const action = status === "A" ? `Added ${filePath}` : status === "M" ? `Modified ${filePath}` : status === "D" ? `Deleted ${filePath}` : `Changed ${filePath}`;
  commitMessage += `- ${action}\n`;
});

commitMessage += "\nChanges:\n";
Object.entries(fileChanges).forEach(([filePath, diff]) => {
  commitMessage += `🔹 **${filePath}**\n\n${diff}\n\n`;
});

askAI(commitMessage)
  .then((modifiedCommitMessage) => {
    fs.writeFileSync(commitMsgFile, modifiedCommitMessage);
    console.log(`✅ Commit message set: ${modifiedCommitMessage}`);
  })
  .catch((error) => {
    console.error("❌ Error generating commit message:", error);
  });