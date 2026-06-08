import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const DRY = !process.argv.includes("--apply");

function getAllFiles(dir) {
  let files = [];
  for (const entry of readdirSync(dir)) {
    if (["node_modules", ".next", ".git"].includes(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files = files.concat(getAllFiles(full));
    else if (full.endsWith(".js")) files.push(full);
  }
  return files;
}

const replacements = [
  [/`Sem \$\{cert\.student_semester\}`/g, "`${cert.student_semester}`"],
  [/`Sem \$\{s\.semester\}`/g, "`${s.semester}`"],
  [/`Sem \$\{sem\}`/g, "`${sem}`"],
  [/`Sem \$\{exam\.semester\}`/g, "`${exam.semester}`"],
  [/`Sem \$\{fee\.student_semester\}`/g, "`${fee.student_semester}`"],
  [/`Sem \$\{form\.semester\}`/g, "`${form.semester}`"],
  [/`Sem \$\{row\.semester\}`/g, "`${row.semester}`"],
  [/ Sem \$\{s\.semester \|\| "—"\}/g, ' ${s.semester || "—"}'],
  [/· Sem \$\{s\.semester\}/g, "· ${s.semester}"],
  [/" Sem " \+ \(f\.semester/g, '" " + (f.semester'],
  [/" Sem " \+ s\.semester/g, '" " + s.semester'],
  [/Sem \{s\.semester\}/g, "{s.semester}"],
  [/Sem \{sem\}/g, "{sem}"],
  [/Sem \{sec\}/g, "{sec}"],
  [/Sem \{s\}/g, "{s}"],
  [/Sem \{student\.semester\}/g, "{student.semester}"],
  [/Sem \{form\.semester\}/g, "{form.semester}"],
  [/Sem \{exam\.semester\}/g, "{exam.semester}"],
  [/Scholar No\./g, "University Reg. No."],
  [/>PEN</g, ">Univ. Reg. No.<"],
  [/value="midterm">Mid Term/g, 'value="viva">Viva'],
  [/value="annual">Annual/g, 'value="practical">Practical'],
  [/defaultValue="internal"/g, 'defaultValue="theory"'],
  [/\{ val: "internal", label: "Internal" \}/g, '{ val: "theory", label: "Theory" }'],
  [/\{ val: "midterm", label: "Mid Term" \}/g, '{ val: "viva", label: "Viva" }'],
  [/\{ val: "annual", label: "Annual" \}/g, '{ val: "practical", label: "Practical" }'],
  [/type=annual/g, "type=theory"],
];

const files = getAllFiles(ROOT);
let changedFiles = 0;

for (const file of files) {
  const original = readFileSync(file, "utf8");
  let updated = original;
  for (const [pattern, replacement] of replacements) {
    updated = updated.replace(pattern, replacement);
  }
  if (updated !== original) {
    changedFiles++;
    const rel = file.replace(ROOT + "\\", "").replace(ROOT + "/", "");
    console.log(`  ${rel}`);
    if (!DRY) writeFileSync(file, updated, "utf8");
  }
}

console.log(`\n${DRY ? "[DRY RUN]" : "[APPLIED]"} ${changedFiles} files changed`);
if (DRY) console.log("Apply करने के लिए: node fix_ayurveda.mjs --apply");