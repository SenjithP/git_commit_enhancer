import { execSync } from "child_process";

export function getGitDiff(): string {
  try {
    return execSync("git diff --cached --unified=0", { encoding: "utf-8" });
  } catch (error) {
    console.error("❌ Error getting git diff:", error);
    return "";
  }
}

export function getLastCommitMessage(): string {
  try {
    return execSync("git log -1 --pretty=%B", { encoding: "utf-8" }).trim();
  } catch (error) {
    console.error("❌ Error getting last commit message:", error);
    return "";
  }
}
