import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const replacements = [
  ["text-indigo-600", "text-green-600"],
  ["text-indigo-500", "text-green-500"],
  ["text-indigo-400", "text-green-400"],
  ["text-indigo-300", "text-green-300"],
  ["text-indigo-200", "text-green-200"],
  ["text-indigo-100", "text-green-100"],
  ["text-indigo-700", "text-green-700"],
  ["text-indigo-800", "text-green-800"],
  ["text-indigo-900", "text-green-900"],
  ["bg-indigo-600", "bg-green-600"],
  ["bg-indigo-500", "bg-green-500"],
  ["bg-indigo-50", "bg-green-50"],
  ["bg-indigo-100", "bg-green-100"],
  ["bg-indigo-200", "bg-green-200"],
  ["bg-indigo-700", "bg-green-700"],
  ["bg-indigo-800", "bg-green-800"],
  ["bg-indigo-900", "bg-green-900"],
  ["border-indigo-600", "border-green-600"],
  ["border-indigo-500", "border-green-500"],
  ["border-indigo-400", "border-green-400"],
  ["border-indigo-300", "border-green-300"],
  ["border-indigo-200", "border-green-200"],
  ["border-indigo-100", "border-green-100"],
  ["hover:bg-indigo-600", "hover:bg-green-600"],
  ["hover:bg-indigo-700", "hover:bg-green-700"],
  ["hover:bg-indigo-50", "hover:bg-green-50"],
  ["hover:bg-indigo-100", "hover:bg-green-100"],
  ["focus:ring-indigo-500", "focus:ring-green-500"],
  ["focus:ring-indigo-600", "focus:ring-green-600"],
  ["from-indigo-50", "from-green-50"],
  ["from-indigo-900", "from-green-900"],
  ["to-indigo-600", "to-green-600"],
];

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (entry.endsWith(".js")) files.push(full);
  }
  return files;
}

const files = walk(process.cwd());
let changed = 0;

for (const file of files) {
  let content = readFileSync(file, "utf8");
  const original = content;
  for (const [from, to] of replacements) {
    content = content.replaceAll(from, to);
  }
  if (content !== original) {
    writeFileSync(file, content, "utf8");
    console.log("✓", file.replace(process.cwd(), ""));
    changed++;
  }
}
console.log(`\nDone — ${changed} files updated.`);