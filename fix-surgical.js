// fix-surgical.js — Ayurveda ERP: 7 files की surgical सफाई
// चलाना: F:\ayurveda में रखकर  node fix-surgical.js
const fs = require("fs");
const path = require("path");

const FIXES = [
  {
    file: "app/page.js",
    changes: [
      ["bg-teal-600", "bg-green-600"],
      ["hover:bg-teal-700", "hover:bg-green-700"],
    ],
  },
  {
    file: "app/login/page.js",
    changes: [
      ["border-teal-200", "border-green-200"],
      ["text-teal-700", "text-green-700"],
      ["hover:bg-teal-50", "hover:bg-green-50"],
    ],
  },
  {
    file: "app/students/page.js",
    changes: [["focus:ring-indigo-400", "focus:ring-green-500"]],
  },
  {
    file: "app/fee-structure/packages/[id]/edit/EditPackageForm.js",
    changes: [
      [">Semester</label>", ">Professional Year</label>"],
      ["All Semesters", "All Professional Years"],
      ["accent-indigo-600", "accent-green-600"],
    ],
  },
  {
    file: "app/fees/[id]/edit/EditFeeForm.js",
    changes: [[">Semester</label>", ">Professional Year</label>"]],
  },
  {
    file: "app/exams/[id]/report/page.js",
    changes: [[">Semester:</span>", ">Professional Year:</span>"]],
  },
  {
    file: "app/professor/attendance/page.js",
    changes: [["All Semesters", "All Professional Years"]],
  },
];

let totalChanges = 0;
let problems = 0;

for (const { file, changes } of FIXES) {
  const p = path.join(__dirname, file);
  if (!fs.existsSync(p)) {
    console.log(`❌ FILE NOT FOUND: ${file}`);
    problems++;
    continue;
  }
  let text = fs.readFileSync(p, "utf8");
  let fileChanged = false;
  for (const [from, to] of changes) {
    const count = text.split(from).length - 1;
    if (count === 0) {
      console.log(`⚠️  ${file} — नहीं मिला: "${from}" (शायद पहले ही ठीक है)`);
      continue;
    }
    text = text.split(from).join(to);
    console.log(`✅ ${file} — ${count} जगह: "${from}" → "${to}"`);
    totalChanges += count;
    fileChanged = true;
  }
  if (fileChanged) fs.writeFileSync(p, text, "utf8");
}

console.log("");
console.log(`कुल ${totalChanges} बदलाव हुए।`);
if (problems > 0) console.log(`❌ ${problems} file नहीं मिलीं — path check करो।`);
console.log("अब चलाओ: npm run dev — और pages check करो।");