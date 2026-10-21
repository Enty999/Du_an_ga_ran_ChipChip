const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");

function thuThapFile(thuMuc, duoi) {
  const ketQua = [];
  if (!fs.existsSync(thuMuc)) return ketQua;
  for (const muc of fs.readdirSync(thuMuc, { withFileTypes: true })) {
    const duongDan = path.join(thuMuc, muc.name);
    if (muc.isDirectory()) {
      ketQua.push(...thuThapFile(duongDan, duoi));
    } else if (muc.isFile() && muc.name.endsWith(duoi)) {
      ketQua.push(duongDan);
    }
  }
  return ketQua.sort();
}

function tuongDoi(file) {
  return path.relative(root, file);
}

const loi = [];

const fileJs = [
  path.join(root, "server.js"),
  ...thuThapFile(path.join(root, "src"), ".js"),
];
let soLoiJs = 0;
for (const file of fileJs) {
  const kq = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
  });
  if (kq.status !== 0) {
    soLoiJs++;
    loi.push({
      buoc: "Cú pháp JS",
      file: tuongDoi(file),
      chiTiet: (kq.stderr || kq.error || "").toString().trim(),
    });
  }
}
if (soLoiJs === 0) {
  console.log(`✔ Cú pháp JS: ${fileJs.length} file OK`);
} else {
  console.log(`✘ Cú pháp JS: ${soLoiJs}/${fileJs.length} file lỗi`);
}

try {
  const app = require(path.join(root, "src/app"));
  if (typeof app !== "function") {
    throw new Error(
      `src/app không export ra Express app (nhận được kiểu ${typeof app})`,
    );
  }
  console.log("✔ Nạp ứng dụng: src/app OK");
} catch (err) {
  console.log("✘ Nạp ứng dụng: src/app lỗi");
  loi.push({
    buoc: "Nạp ứng dụng",
    file: "src/app.js",
    chiTiet: err && err.stack ? err.stack : String(err),
  });
}

const pug = require("pug");
const filePug = thuThapFile(path.join(root, "src/views"), ".pug");
let soLoiPug = 0;
for (const file of filePug) {
  try {
    pug.compileFile(file);
  } catch (err) {
    soLoiPug++;
    loi.push({
      buoc: "Template Pug",
      file: tuongDoi(file),
      chiTiet: err && err.message ? err.message : String(err),
    });
  }
}
if (soLoiPug === 0) {
  console.log(`✔ Template Pug: ${filePug.length} file OK`);
} else {
  console.log(`✘ Template Pug: ${soLoiPug}/${filePug.length} file lỗi`);
}

if (loi.length > 0) {
  console.log(`\nPhát hiện ${loi.length} lỗi:`);
  for (const { buoc, file, chiTiet } of loi) {
    console.log(`\n[${buoc}] ${file}\n${chiTiet}`);
  }
  process.exit(1);
}

console.log("\nKiểm tra hoàn tất, không có lỗi.");
process.exit(0);
