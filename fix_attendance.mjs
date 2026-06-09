import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const DRY = !process.argv.includes("--apply");

const fixes = {
  "app/attendance/mark/page.js": [
    [
      `  redirect("/dashboard");\n`,
      ``
    ],
    [
      `            <div className="flex-1">\n              <label className="block text-xs text-gray-500 mb-1">Course</label>\n              <select\n                name="course"\n                defaultValue={selectedCourse}\n                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"\n              >\n                <option value="">All Courses</option>\n                {courses.map((c) => (\n                  <option key={c} value={c}>\n                    {c}\n                  </option>\n                ))}\n              </select>\n            </div>`,
      ``
    ],
  ],
  "app/attendance/page.js": [
    [
      `            <div className="flex-1">\n              <label className="block text-xs text-gray-500 mb-1">Course</label>\n              <select\n                name="course"\n                defaultValue={selectedCourse}\n                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"\n              >\n                <option value="">All Courses</option>\n                {courses.map((c) => (\n                  <option key={c} value={c}>\n                    {c}\n                  </option>\n                ))}\n              </select>\n            </div>`,
      ``
    ],
  ],
  "app/professor-attendance/page.js": [
    [`href="/dashboard"`, `href="/home"`],
    [`focus:ring-indigo-400`, `focus:ring-green-500`],
  ],
  "app/home/page.js": [
    [`href: "/attendance"`, `href: "/student-attendance"`],
  ],
};

let totalChanged = 0;

for (const [rel, replacements] of Object.entries(fixes)) {
  const path = join(ROOT, rel);
  const raw = readFileSync(path, "utf8");
  const normalized = raw.replace(/\r\n/g, "\n");
  let updated = normalized;
  for (const [old, newVal] of replacements) {
    updated = updated.replace(old, newVal);
  }
  const changed = updated !== normalized;
  console.log(`${changed ? "CHANGED" : "NO-CHANGE"}: ${rel}`);
  if (!DRY && changed) writeFileSync(path, updated, "utf8");
  if (changed) totalChanged++;
}

console.log(`\n${DRY ? "[DRY RUN]" : "[APPLIED]"} ${totalChanged} files changed`);
if (DRY) console.log("Apply: node fix_attendance.mjs --apply");