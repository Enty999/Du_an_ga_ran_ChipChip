const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "..");

if (!fs.existsSync(path.join(root, ".git"))) {
  process.exit(0);
}

try {
  execSync("git config core.hooksPath .githooks", {
    cwd: root,
    stdio: "ignore",
  });
  console.log(
    "✔ Đã bật git hook pre-push (.githooks): mỗi lần git push sẽ tự chạy npm run build",
  );
} catch (err) {
  console.log("⚠ Không bật được git hook (không tìm thấy git), bỏ qua.");
}
