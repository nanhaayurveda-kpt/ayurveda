import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const DRY = !process.argv.includes("--apply");

const fixes = {
  "app/students/add/page.js": [
    [
      `import { FACULTIES, FACULTY_COURSES } from "@/lib/courses";`,
      `import { FACULTIES, FACULTY_COURSES, SEMESTERS } from "@/lib/courses";`,
    ],
    [
      `const semesters = ["1", "2", "3", "4", "5", "6"];`,
      `const professionalYears = SEMESTERS;`,
    ],
    [`semesters={semesters}`, `semesters={professionalYears}`],
  ],
  "app/students/[id]/edit/page.js": [
    [
      `import { FACULTIES, FACULTY_COURSES } from "@/lib/courses";`,
      `import { FACULTIES, FACULTY_COURSES, SEMESTERS } from "@/lib/courses";`,
    ],
    [
      `const semesters = ["1", "2", "3", "4", "5", "6"];`,
      `const professionalYears = SEMESTERS;`,
    ],
    [`semesters={semesters}`, `semesters={professionalYears}`],
  ],
  "app/students/page.js": [
    [
      `      {/* Summary */}\n      <div className="grid grid-cols-3 gap-2 mb-4">\n        <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">\n          <div className="text-lg font-bold text-green-700">\n            {allStudents.length}\n          </div>\n          <div className="text-xs text-green-500">Total</div>\n        </div>\n        <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">\n          <div className="text-lg font-bold text-green-700">\n            {allStudents.filter((s) => s.fee_status === "paid").length}\n          </div>\n          <div className="text-xs text-green-500">Fees Paid</div>\n        </div>\n        <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-100">\n          <div className="text-lg font-bold text-yellow-700">\n            {allStudents.filter((s) => s.fee_status !== "paid").length}\n          </div>\n          <div className="text-xs text-yellow-600">Pending</div>\n        </div>\n      </div>`,
      ``,
    ],
    [
      `            const facTotal = courses.reduce(\n              (sum, course) =>\n                sum +\n                Object.values(grouped[fac][course]).reduce(\n                  (s, arr) => s + arr.length,\n                  0,\n                ),\n              0,\n            );`,
      `            const facTotal = courses.reduce((sum, course) => {\n              const sems = Object.keys(grouped[fac][course]);\n              return sum + sems.reduce((s, sem) => {\n                return s + Object.values(grouped[fac][course][sem]).reduce((s2, arr) => s2 + arr.length, 0);\n              }, 0);\n            }, 0);`,
    ],
  ],
};

for (const [rel, replacements] of Object.entries(fixes)) {
  const path = join(ROOT, rel);
  const original = readFileSync(path, "utf8");
  let updated = original;
  for (const [old, newVal] of replacements) {
    updated = updated.replace(old, newVal);
  }
  const changed = updated !== original;
  console.log(`${changed ? "CHANGED" : "NO-CHANGE"}: ${rel}`);
  if (!DRY && changed) writeFileSync(path, updated, "utf8");
}

console.log(`\n${DRY ? "[DRY RUN]" : "[APPLIED]"}`);
if (DRY) console.log("Apply: node fix_students.mjs --apply");