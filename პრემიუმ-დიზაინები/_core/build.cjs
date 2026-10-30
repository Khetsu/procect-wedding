// ამბავი · პრემიუმ დიზაინები · node _core/build.cjs [დიზაინი]
// ყოველ დიზაინს (config.js + scene.glsl) აძლევს index.html-ს; შეიდერი index.html-შივე ჩაიწერება, ამიტომ ფაილი იხსნება ორჯერ დაჭერით და Vercel-ზეც.
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, ".."), CORE = __dirname, only = process.argv[2];
const esc = s => String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
for (const dir of fs.readdirSync(ROOT)){
  const d = path.join(ROOT, dir), cfg = path.join(d, "config.js");
  if (dir.startsWith("_") || !fs.existsSync(cfg) || (only && only !== dir)) continue;
  const box = { window: {} }; vm.runInNewContext(fs.readFileSync(cfg, "utf8"), box); const C = box.window.P || {};
  const glsl = fs.readFileSync(path.join(d, "scene.glsl"), "utf8");
  const fonts = ["Noto+Serif+Georgian:wght@400;500", "Noto+Sans+Georgian:wght@400;500;600", "Cormorant+Garamond:wght@500;600", ...(C.fonts || ["Italianno"])].map(f => "family=" + f).join("&");
  const title = C.title || (C.b ? C.a + " & " + C.b : C.a);
  fs.writeFileSync(path.join(d, "index.html"), `<!doctype html>
<!-- ამბავი · პრემიუმ დიზაინები · ${esc(title)}. ტექსტები და ფერები: config.js · სცენა: scene.glsl (ჩაშენებულია ქვემოთ build.cjs-ით) -->
<html lang="ka">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)} · ამბავი</title>
<meta name="description" content="${esc(C.kicker || "")}">
<meta property="og:title" content="💌 ${esc(title)}">
<meta property="og:description" content="${esc(C.introKick || "თქვენ მიიღეთ მოსაწვევი")}">
<meta name="theme-color" content="${esc((C.theme || {}).bg || "#07060A")}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}&display=swap">
<link rel="stylesheet" href="prem.css">
</head>
<body>
<script type="x-shader/x-fragment" id="frag">
${glsl}
</script>
<script src="config.js"></script>
<script src="aria.js"></script>
<script src="prem.js"></script>
</body>
</html>
`);
  for (const f of ["prem.css", "prem.js", "aria.js"]) fs.copyFileSync(path.join(CORE, f), path.join(d, f));
  console.log("built", dir);
}
