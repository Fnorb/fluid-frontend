const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Directories
const DIST_DIR = path.resolve(__dirname, "dist");
const GH_PAGES_DIR = path.resolve(__dirname, "gh-pages");

/**
 * Runs a shell command and pipes its output to the console.
 * @param {string} cmd - The command to execute.
 * @param {object} opts - Options for execSync (e.g., cwd for current working directory).
 */
function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...opts });
}

/**
 * Deletes all contents within a specified folder, excluding Git-related files/folders.
 * This is crucial for git worktrees where .git is a file.
 * @param {string} folder - The path to the folder to clear.
 */
function deleteWorktreeContents(folder) {
  if (!fs.existsSync(folder)) {
    console.log(`Folder not found, skipping content deletion: ${folder}`);
    return;
  }
  console.log(`Clearing non-Git contents of: ${folder}`);
  fs.readdirSync(folder).forEach((file) => {
    const filePath = path.join(folder, file);
    // IMPORTANT: Do NOT delete the .git file (for worktrees) or .gitignore
    // The .git file is how the worktree maintains its connection to the main repo.
    if (file === ".git" || file === ".gitignore") {
      console.log(`Skipping Git-related file: ${filePath}`);
      return;
    }
    fs.rmSync(filePath, { recursive: true, force: true });
  });
}

/**
 * Recursively copies files and directories from source to destination.
 * @param {string} src - The source path.
 * @param {string} dest - The destination path.
 */
function copyRecursive(src, dest) {
  // Ensure the destination directory exists
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src).forEach((item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // If it's a directory, recurse
      copyRecursive(srcPath, destPath);
    } else {
      // If it's a file, copy it
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// --- Deployment Workflow ---

console.log("🚀 Starting GitHub Pages deployment...");

try {
  // Step 0: Ensure the gh-pages worktree is set up
  console.log("\n--- Step 0: Checking gh-pages worktree setup ---");
  if (
    !fs.existsSync(GH_PAGES_DIR) ||
    !fs.existsSync(path.join(GH_PAGES_DIR, ".git"))
  ) {
    console.log(
      `'${GH_PAGES_DIR}' directory or its .git file not found. Setting up git worktree...`
    );
    try {
      // Ensure the gh-pages branch exists remotely before adding worktree
      // This will fetch the branch if it exists on origin, or fail if it doesn't.
      run("git fetch origin gh-pages");
      run(`git worktree add ${GH_PAGES_DIR} gh-pages`);
      console.log("Git worktree 'gh-pages' successfully added.");
      // Add gh-pages to .gitignore in the main repo if not already there
      const gitignorePath = path.resolve(__dirname, ".gitignore");
      let gitignoreContent = "";
      if (fs.existsSync(gitignorePath)) {
        gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
      }
      if (!gitignoreContent.includes("gh-pages/")) {
        fs.appendFileSync(
          gitignorePath,
          "\n# Ignore the GitHub Pages worktree directory\ngh-pages/\n"
        );
        console.log("Added 'gh-pages/' to .gitignore in the main repository.");
      }
    } catch (worktreeError) {
      console.error(`Error setting up git worktree: ${worktreeError.message}`);
      console.error(
        "Please ensure the 'gh-pages' branch exists on your remote (e.g., by running 'git push origin gh-pages' once manually)."
      );
      process.exit(1); // Exit if worktree setup fails
    }
  } else {
    console.log("Git worktree 'gh-pages' is already set up.");
  }

  // Step 1: Build the project
  console.log("\n--- Step 1: Building the project ---");
  run("npm run build");
  console.log("Build complete.");

  // Step 2: Clear gh-pages worktree folder (safely, preserving Git files)
  console.log(
    "\n--- Step 2: Clearing gh-pages directory (excluding Git files) ---"
  );
  deleteWorktreeContents(GH_PAGES_DIR); // Using the new, safer function
  console.log("gh-pages directory cleared of old build output.");

  // Step 3: Copy dist/ into gh-pages/
  console.log("\n--- Step 3: Copying build output to gh-pages ---");
  // Ensure the dist directory exists before copying
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error(
      `Error: 'dist' directory not found at ${DIST_DIR}. Please ensure 'npm run build' creates it.`
    );
  }
  copyRecursive(DIST_DIR, GH_PAGES_DIR);
  console.log("Build output copied to gh-pages.");

  // Step 4: Commit and push from the gh-pages worktree
  console.log("\n--- Step 4: Committing and pushing to gh-pages branch ---");
  // Ensure we are in the gh-pages worktree for git commands
  run("git add .", { cwd: GH_PAGES_DIR });

  // Check if there are any changes to commit in the worktree
  const statusOutput = execSync("git status --porcelain", { cwd: GH_PAGES_DIR })
    .toString()
    .trim();
  if (statusOutput) {
    run(`git commit -m "Deploy ${new Date().toISOString()}"`, {
      cwd: GH_PAGES_DIR,
    });
    // Explicitly push to the gh-pages branch on the origin remote
    run("git push origin gh-pages", { cwd: GH_PAGES_DIR });
    console.log("Changes committed and pushed to gh-pages branch.");
  } else {
    console.log(
      "No changes to commit in gh-pages directory. Skipping commit and push."
    );
  }

  console.log("\n✅ Deployed to GitHub Pages successfully!");
} catch (error) {
  console.error("\n❌ Deployment failed!");
  console.error(error.message);
  process.exit(1); // Exit with a non-zero code to indicate failure
}
