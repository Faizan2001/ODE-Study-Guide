import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../css/style.css", import.meta.url), "utf8");

function blockFor(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{(?<body>[^}]*)\\}`));
  assert.ok(match, `Missing CSS block for ${selector}`);
  return match.groups.body;
}

function assertDeclaration(selector, property, expectedPattern) {
  const body = blockFor(selector);
  const declaration = body
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${property}:`));
  assert.ok(declaration, `${selector} should declare ${property}`);
  assert.match(declaration, expectedPattern, `${selector} ${property} should match ${expectedPattern}`);
}

assertDeclaration("html", "overflow-x", /hidden|clip/);
assertDeclaration(".prose", "min-width", /^min-width:\s*0$/);
assertDeclaration(".step > div", "min-width", /^min-width:\s*0$/);
assertDeclaration(".prose .katex", "display", /^display:\s*inline-block$/);
assertDeclaration(".prose .katex", "max-width", /^max-width:\s*100%$/);
assertDeclaration(".prose .katex", "overflow-x", /^overflow-x:\s*auto$/);

console.log("Mobile layout CSS checks passed.");
