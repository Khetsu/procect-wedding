// node _core/build.cjs [design] — აწყობს index.html-ს და ძრავის ფაილებს აკოპირებს თითო დიზაინში (თითო საქაღალდე Vercel-ზე ცალკე იტვირთება)
const fs = require("fs"), path = require("path"), ROOT = path.join(__dirname, ".."), CORE = ["page.css", "qagaldi.js", "ink.js", "env3d.js", "hangi.js", "page.js"];
const only = process.argv[2], esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const dirs = fs.readdirSync(ROOT).filter(d => !d.startsWith("_") && fs.existsSync(path.join(ROOT, d, "config.js")) && fs.existsSync(path.join(ROOT, d, "opening.js")) && (!only || d === only));
if (!dirs.length){ console.log("დიზაინი ვერ ვიპოვე" + (only ? ": " + only : "")); process.exit(1); }
for (const d of dirs){
  const w = {}; new Function("window", fs.readFileSync(path.join(ROOT, d, "config.js"), "utf8"))(w); const C = w.E;
  const title = C.title || (C.b ? `${C.a} & ${C.b}` : C.a), fam = ["Noto+Serif+Georgian:wght@300;400;500;600", "Noto+Sans+Georgian:wght@400;500", ...(C.fonts || [])].map(f => "family=" + f).join("&");
  fs.writeFileSync(path.join(ROOT, d, "index.html"), `<!doctype html>
<html lang="ka"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)} · 3D მოსაწვევი</title><meta name="description" content="${esc(C.kicker)} · ${esc(C.date)}"><meta property="og:title" content="${esc(title)} · მოსაწვევი"><meta property="og:description" content="${esc(C.kicker)}">
<meta name="theme-color" content="${esc(C.theme.bg)}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fam}&display=swap"><link rel="stylesheet" href="page.css">
</head><body>
<script src="config.js"></script><script src="hangi.js"></script><script src="qagaldi.js"></script><script src="ink.js"></script><script src="env3d.js"></script><script src="opening.js"></script><script src="page.js"></script>
</body></html>
`);
  for (const f of CORE) fs.copyFileSync(path.join(__dirname, f), path.join(ROOT, d, f));
  console.log("built", d);
}
