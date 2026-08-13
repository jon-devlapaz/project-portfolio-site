import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  resolve(root, "index.html"),
  resolve(root, "evidence.html"),
  ...readdirSync(resolve(root, "case-studies"))
    .filter((name) => name.endsWith(".html"))
    .map((name) => resolve(root, "case-studies", name)),
];

const urls = new Set();
for (const file of files) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/\b(?:href|src)=["'](https:\/\/[^"']+)["']/g)) {
    const url = new URL(match[1]);
    url.hash = "";
    urls.add(url.href);
  }
}

const manualHosts = new Set(["www.linkedin.com"]);
const failures = [];
let checked = 0;
let manual = 0;

async function request(url, method) {
  return fetch(url, {
    method,
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
    headers: { "user-agent": "Jonathan-De-La-Paz-portfolio-link-check/1.0" },
  });
}

for (const value of [...urls].sort()) {
  const url = new URL(value);
  if (manualHosts.has(url.hostname)) {
    console.log(`MANUAL ${value} (browser/profile protections)`);
    manual += 1;
    continue;
  }
  try {
    let response = await request(value, "HEAD");
    if (response.status === 405 || response.status >= 500) response = await request(value, "GET");
    if (response.status >= 200 && response.status < 400) {
      console.log(`OK ${response.status} ${value}`);
      checked += 1;
    } else {
      failures.push(`${response.status} ${value}`);
    }
  } catch (error) {
    failures.push(`${error.name}: ${value}`);
  }
}

if (failures.length) {
  console.error(`External link verification failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`External link verification passed: ${checked} reachable links; ${manual} LinkedIn link reserved for browser validation.`);
