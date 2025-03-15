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
  // Fetch changed files, excluding deleted files (D)
  const result = execSync("git diff --name-status --cached --diff-filter=ACMRT", { encoding: "utf8" }).trim();

  changedFiles = result
    .split("\n")
    .filter(Boolean) // Remove empty lines
    .map((line) => {
      const [status, filePath] = line.split("\t");
      return { status, filePath };
    });

  if (changedFiles.length === 0) {
    console.log("✅ No valid changed files to process.");
    process.exit(0);
  }
} catch (error) {
  console.error("❌ Error fetching changed files:", error);
  process.exit(1);
}

const fileChanges: Record<string, string> = {};

changedFiles.forEach(({ filePath }) => {
  try {
    const diffOutput = execSync(`git diff --cached --unified=0 -- ${filePath}`, { encoding: "utf8" });
    fileChanges[filePath] = diffOutput;
  } catch (error) {
    console.error(`⚠️ Skipping ${filePath} (unable to fetch changes):`, error);
  }
});

let commitMessage = "Updated files:\n";
changedFiles.forEach(({ status, filePath }) => {
  const action = status === "A" ? `Added ${filePath}` :
                 status === "M" ? `Modified ${filePath}` :
                 status === "R" ? `Renamed ${filePath}` :
                 status === "T" ? `Type changed ${filePath}` :
                 `Changed ${filePath}`;
  commitMessage += `- ${action}\n`;
});

commitMessage += "\nChanges:\n";
Object.entries(fileChanges).forEach(([filePath, diff]) => {
  commitMessage += `🔹 **${filePath}**\n\n${diff}\n\n`;
});

// Call AI for commit message enhancement
askAI(commitMessage)
  .then((modifiedCommitMessage) => {
    fs.writeFileSync(commitMsgFile, modifiedCommitMessage);
    console.log(`✅ Commit message set: ${modifiedCommitMessage}`);
  })
  .catch((error) => {
    console.error("❌ Error generating commit message:", error);
  });
