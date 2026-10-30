// ამბავი 2 · node _engine/build.cjs [დიზაინი] [გამოსატანი საქაღალდე]
// ყოველ დიზაინს (საქაღალდე config.js-ით) აძლევს index.html-ს და ძრავის ფაილებს. 3D სცენა (kit.js + scene.js) index.html-შივე ჩაიწერება,
// ამიტომ გვერდი მუშაობს სერვერის გარეშეც (ფაილზე ორჯერ დაჭერით) და Vercel-ზეც.
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, ".."), ENG = __dirname, [only, outBase] = process.argv.slice(2);
const MUSIC = path.join(ROOT, "..", "მოსაწვევები", "_core", "js", "music.js");
const esc = s => String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const kit = fs.readFileSync(path.join(ENG, "kit.js"), "utf8").replace(/^export (async function|function|const) /gm, "$1 ");
for (const dir of fs.readdirSync(ROOT)){
  const d = path.join(ROOT, dir), cfg = path.join(d, "config.js");
  if (dir.startsWith("_") || !fs.existsSync(cfg) || (only && only !== dir)) continue;
  const out = outBase ? path.join(outBase, dir) : d; fs.mkdirSync(out, { recursive: true });
  const box = { window: {} }; vm.runInNewContext(fs.readFileSync(cfg, "utf8"), box); const C = box.window.AMB || {};
  const scene = fs.readFileSync(path.join(d, "scene.js"), "utf8").replace(/^import .* from "\.\/kit\.js";\s*$/m, "").replace("export default async function(", "const __scene = async function(");
  const fonts = ["Noto+Serif+Georgian:wght@300;400;500;600", "Noto+Sans+Georgian:wght@300;400;500;600", "Cormorant+Garamond:wght@500;600", ...(C.fonts || [])].map(f => "family=" + f).join("&");
  const title = C.title || (C.b ? C.a + " & " + C.b : C.a);
  fs.writeFileSync(path.join(out, "index.html"), `<!doctype html>
<!-- ამბავი · ახალი კოლექცია 10/25 · ${esc(title)}. ტექსტები და ფერები: config.js · 3D სამყარო: scene.js (ჩაშენებულია ქვემოთ, build.cjs-ით) · ძრავი: amb.js/amb.css -->
<html lang="ka">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)} · ამბავი</title>
<meta name="description" content="${esc(C.kicker || "")} — ${esc(title)}">
<meta property="og:title" content="💌 ${esc(title)}">
<meta property="og:description" content="${esc(C.introKick || "თქვენ მიიღეთ მოსაწვევი")}">
<meta name="theme-color" content="${esc((C.theme || {}).bg2 || "#05070F")}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}&display=swap">
<link rel="stylesheet" href="amb.css">
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"}}</script>
</head>
<body>
<script src="config.js"></script>
<script src="music.js"></script>
<script src="amb.js"></script>
<script type="module">
import * as THREE from "three";
${kit}
${scene}
window.AMB_SCENE = { THREE, create: __scene }; window.dispatchEvent(new Event("amb-scene"));
</script>
</body>
</html>
`);
  for (const f of ["amb.css", "amb.js"]) fs.copyFileSync(path.join(ENG, f), path.join(out, f));
  if (out !== d) for (const f of ["config.js", "scene.js"]) fs.copyFileSync(path.join(d, f), path.join(out, f));
  fs.copyFileSync(MUSIC, path.join(out, "music.js"));
  try { fs.unlinkSync(path.join(out, "kit.js")); } catch (_) {}
  console.log("built", dir, out === d ? "" : "→ " + out);
}
