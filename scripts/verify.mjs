import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const caseDirectory = resolve(root, "case-studies");
const htmlFiles = [
  resolve(root, "index.html"),
  resolve(root, "evidence.html"),
  ...readdirSync(caseDirectory)
    .filter((name) => name.endsWith(".html"))
    .sort()
    .map((name) => resolve(caseDirectory, name)),
];

const sources = new Map(htmlFiles.map((file) => [file, readFileSync(file, "utf8")]));
const errors = [];

function fail(file, message) {
  errors.push(`${relative(root, file)}: ${message}`);
}

function count(pattern, value) {
  return [...value.matchAll(pattern)].length;
}

function idsFor(source) {
  return new Set([...source.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]));
}

function relativeLuminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi)?.map((value) => Number.parseInt(value, 16) / 255);
  if (!channels || channels.length !== 3) throw new Error(`Invalid color ${hex}`);
  const linear = channels.map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(first, second) {
  const a = relativeLuminance(first);
  const b = relativeLuminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

for (const [file, source] of sources) {
  if (!/^<!doctype html>/i.test(source.trimStart())) fail(file, "missing HTML doctype");
  if (!/<html\b[^>]*\blang=["']en["']/i.test(source)) fail(file, "missing English document language");
  if (!/<meta\b[^>]*\bname=["']viewport["']/i.test(source)) fail(file, "missing viewport metadata");
  if (!/<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["'][^"']{40,}["']/i.test(source)) {
    fail(file, "missing useful meta description");
  }
  if (count(/<title>[^<]+<\/title>/gi, source) !== 1) fail(file, "must contain exactly one title");
  if (count(/<h1\b/gi, source) !== 1) fail(file, "must contain exactly one h1");
  if (!/<main\b[^>]*\bid=["']main-content["']/i.test(source)) fail(file, "missing main landmark target");
  if (!/<a\b[^>]*\bclass=["'][^"']*skip-link[^"']*["'][^>]*\bhref=["']#main-content["']/i.test(source)) {
    fail(file, "missing skip link");
  }
  if (!/<nav\b[^>]*\baria-label=["'][^"']+["']/i.test(source)) fail(file, "navigation needs an accessible label");

  const ids = [...source.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) fail(file, `duplicate ids: ${[...new Set(duplicates)].join(", ")}`);

  for (const match of source.matchAll(/<a\b([^>]*)>/gi)) {
    const attributes = match[1];
    const href = attributes.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (!href) {
      fail(file, "anchor without href");
      continue;
    }
    if (/\btarget=["']_blank["']/i.test(attributes) && !/\brel=["'][^"']*noopener[^"']*["']/i.test(attributes)) {
      fail(file, `external target lacks noopener: ${href}`);
    }
    if (/^(?:https?:|mailto:)/i.test(href)) continue;
    if (/^(?:javascript:|data:)/i.test(href)) {
      fail(file, `unsafe link protocol: ${href}`);
      continue;
    }

    const [pathPart, fragment] = href.split("#", 2);
    const target = pathPart ? resolve(dirname(file), decodeURIComponent(pathPart)) : file;
    if (!target.startsWith(root)) {
      fail(file, `internal link escapes the site: ${href}`);
      continue;
    }
    if (!existsSync(target)) {
      fail(file, `broken internal link: ${href}`);
      continue;
    }
    if (fragment && extname(target).toLowerCase() === ".html") {
      const targetSource = sources.get(target) ?? readFileSync(target, "utf8");
      if (!idsFor(targetSource).has(decodeURIComponent(fragment))) fail(file, `missing anchor target: ${href}`);
    }
  }

  for (const match of source.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const accessibleText = match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!accessibleText && !/\baria-label=["'][^"']+["']/i.test(match[1])) fail(file, "button lacks an accessible name");
  }

  for (const match of source.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(match[1])) fail(file, "image lacks alt text");
  }

  if (/\b(?:TODO|FIXME|lorem ipsum|placeholder)\b/i.test(source)) fail(file, "contains unfinished placeholder copy");
}

const index = sources.get(resolve(root, "index.html"));
if (count(/\bdata-case-study=["'][^"']+["']/g, index) !== 3) {
  fail(resolve(root, "index.html"), "must present exactly three selected case studies");
}
for (const required of ["ask-jdp", "tink", "skill-eval-loop"]) {
  if (!index.includes(`data-case-study="${required}"`)) fail(resolve(root, "index.html"), `missing selected case study ${required}`);
}

for (const file of htmlFiles.filter((candidate) => dirname(candidate) === caseDirectory)) {
  const source = sources.get(file);
  for (const heading of ["Problem", "Constraints", "My decisions", "Difficult tradeoffs", "Implementation", "Verification", "Outcome", "Traceable evidence"]) {
    if (!new RegExp(`<h2[^>]*>${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/h2>`, "i").test(source)) {
      fail(file, `missing case-study section: ${heading}`);
    }
  }
}

const allHtml = [...sources.values()].join("\n");
for (const stale of ["policy-search.html", "workflow-automation.html", "15,000+", "1,800+ pages", "5x throughput", "45 min → 4 min"]) {
  if (allHtml.includes(stale)) fail(resolve(root, "index.html"), `stale unsupported claim or route remains: ${stale}`);
}

const stylesheet = resolve(root, "css/styles.css");
const css = readFileSync(stylesheet, "utf8");
const colorTokens = Object.fromEntries(
  [...css.matchAll(/--(color-(?:base|t1|t2|t3|t4|accent|accent-l)):\s*(#[a-f\d]{6})\s*;/gi)].map((match) => [match[1], match[2]]),
);
for (const token of ["color-base", "color-t1", "color-t2", "color-t3", "color-t4", "color-accent", "color-accent-l"]) {
  if (!colorTokens[token]) fail(stylesheet, `missing required color token --${token}`);
}
if (colorTokens["color-base"]) {
  for (const foreground of ["color-t1", "color-t2", "color-t3", "color-t4", "color-accent-l"]) {
    if (colorTokens[foreground] && contrastRatio(colorTokens[foreground], colorTokens["color-base"]) < 4.5) {
      fail(stylesheet, `--${foreground} does not meet 4.5:1 against --color-base`);
    }
  }
}
if (colorTokens["color-accent"] && contrastRatio("#ffffff", colorTokens["color-accent"]) < 4.5) {
  fail(stylesheet, "white button text does not meet 4.5:1 against --color-accent");
}

if (errors.length) {
  console.error(`Portfolio verification failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Portfolio verification passed: ${htmlFiles.length} HTML pages, three complete case studies, internal links and anchors resolved.`);
