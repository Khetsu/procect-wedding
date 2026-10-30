// node specs/make.cjs — writes every montage spec (specs/*.json) and jobs.json for the "grand content" pack
const fs = require("fs"), path = require("path"), D = __dirname;
const WED = { bg1: "#3A2616", bg2: "#0E0805", ink: "#FBF4E8", acc: "#E8CB8A" };
const WEDEND = { l1: "ქორწილი · ჯვრისწერა · ნიშნობა", l2: "დახვეწილი 3D მოსაწვევები", cta: "შეუკვეთეთ თქვენი მოსაწვევი ✨" };
const jobs = [];
const put = (id, folder, file, spec, cover) => { fs.writeFileSync(path.join(D, id + ".json"), JSON.stringify(spec, null, 1)); jobs.push({ id, folder, file, cover }); };

/* 01 · which one would you choose (wedding 5) */
const W5 = [["w-champagne", "🥂 შამპანურის კოშკი", 2.0], ["w-chapel", "🕯 სანთლების ტაძარი", 1.9], ["w-rings", "💍 ბეჭდები", 2.0], ["w-veil", "🤍 ფატა", 1.6], ["w-cake", "🎂 საქორწილო ტორტი", 1.8]];
put("01-choose", "01-რომელს-აირჩევდი", "რომელს-აირჩევდი.mp4", { song: "aurora", theme: WED, endLines: WEDEND,
  segs: [...W5.map(([dir, label, from], i) => ({ type: "clip", dir, from, dur: 3.3, num: String(i + 1), label, tr: i ? "flash" : "cut", trd: .3 })),
    { type: "card", dur: 2.6, bgdir: "w-rings", bgfrom: 4, kicker: "ქორწილის კოლექცია", title: "რომელს აირჩევდი?", sub: "დაწერე ნომერი 1–5\nკომენტარში 👇", tr: "fade", trd: .4 }],
  texts: [{ from: 0, to: 3.1, text: "ქორწილი ერთხელ ხდება 🤍\nრომელი გახსნით დაიწყებდი?", y: 560, size: 58 }],
  cover: { dir: "w-rings", idx: 130, kicker: "ქორწილის კოლექცია", title: "რომელს\nაირჩევდი?", sub: "1 · 2 · 3 · 4 · 5 👇" } }, true);

/* 02 · 15 openings in 15 seconds (beat-cut) */
const BEAT = 60 / 118 * 2, A15 = [["w-champagne", "შამპანურის კოშკი", 3.2], ["v-planets", "პლანეტები", 3.4], ["w-chapel", "სანთლების ტაძარი", 3.6], ["v-bottle", "ბოთლი ზღვაში", 3.3], ["w-rings", "ბეჭდები", 3.6],
  ["v-vinyl", "ვინილი", 3.0], ["w-veil", "ფატა", 2.6], ["v-snow-globe", "თოვლის გლობუსი", 2.4], ["w-cake", "საქორწილო ტორტი", 2.8], ["v-curtain", "ფარდა", 3.0],
  ["v-moon-lake", "მთვარის ტბა", 3.2], ["v-cranes", "წეროები", 3.2], ["v-vineyard", "ვენახი", 3.0], ["v-balloons", "საჰაერო ბუშტები", 3.2], ["v-flower-arch", "ყვავილების თაღი", 2.6]];
put("02-fifteen", "02-15-გახსნა-15-წამში", "15-გახსნა-15-წამში.mp4", { song: "pulse",
  segs: [...A15.map(([dir, label, from], i) => ({ type: "clip", dir, from, dur: BEAT, speed: 1.25, punch: true, label, labelY: 1660, count: String(i + 1).padStart(2, "0") + " / 15" })),
    { type: "card", dur: BEAT * 2, title: "რომელი\nდაგამახსოვრდა? 👇", sub: "დაწერე კომენტარში", tr: "flash", trd: .25 }],
  texts: [{ from: 0, to: 2.0, text: "15 გახსნა — 15 წამში ⚡", y: 560, size: 64 }],
  cover: { dir: "v-planets", idx: 112, kicker: "⚡ ამბავი", title: "15 გახსნა\n15 წამში", sub: "რომელი დაგამახსოვრდა? 👇" } }, true);

/* 03 · paper vs ambavi (split screen) */
put("03-vs", "03-ქაღალდი-vs-ამბავი", "ქაღალდი-vs-ამბავი.mp4", { song: "anthem", theme: WED, endLines: WEDEND,
  segs: [{ type: "card", dur: 2.4, bgdir: "w-champagne", bgfrom: 1, title: "ჯერ კიდევ\nქაღალდის მოსაწვევს\nაგზავნით? 🤔", size: 76 },
    { type: "split", dir: "w-champagne", from: 1.9, dur: 4.2, names: ["ანა", "ლუკა"], date: "26 · 06 · 2027", tr: "fade", trd: .4 },
    { type: "split", dir: "w-veil", from: 1.6, dur: 4.2, names: ["ელენე", "ალექსანდრე"], date: "22 · 05 · 2027", tr: "whip", trd: .35 },
    { type: "split", dir: "w-chapel", from: 1.8, dur: 4.2, names: ["ნინო", "დავითი"], date: "11 · 09 · 2027", tr: "whip", trd: .35 },
    { type: "clip", dir: "w-rings", from: 3.4, dur: 3.2, tr: "zoom", trd: .35, hook: "ცოცხალი 3D · მუსიკა\nრუკა · დადასტურება", hookY: 1560, hookSize: 56 },
    { type: "card", dur: 2.6, title: "ერთი ბმული —\nყველა სტუმართან 📲", sub: "დაბეჭდვისა და დარიგების გარეშე", tr: "fade", trd: .4 }],
  cover: { dir: "w-champagne", idx: 115, kicker: "რომელს აირჩევდით?", title: "ქაღალდი\nVS\nამბავი", sub: "ნახეთ განსხვავება 👀" } }, true);

/* 04 · four openings at once (2x2 grid) */
put("04-grid", "04-ოთხი-გახსნა-ერთად", "ოთხი-გახსნა-ერთად.mp4", { song: "glow",
  segs: [{ type: "grid", dirs: ["w-champagne", "w-rings", "w-veil", "w-cake"], labels: ["შამპანური", "ბეჭდები", "ფატა", "ტორტი"], from: 1.7, dur: 5.4, delays: [0, .3, .6, .9] },
    { type: "grid", dirs: ["v-moon-lake", "v-bottle", "v-planets", "v-snow-globe"], labels: ["მთვარის ტბა", "ბოთლი ზღვაში", "პლანეტები", "თოვლის გლობუსი"], from: 1.7, dur: 5.4, delays: [0, .3, .6, .9], tr: "flash", trd: .3 },
    { type: "grid", dirs: ["v-vineyard", "v-cranes", "v-vinyl", "v-balloons"], labels: ["ვენახი", "წეროები", "ვინილი", "ბუშტები"], from: 1.7, dur: 5.4, delays: [0, .3, .6, .9], tr: "flash", trd: .3 },
    { type: "card", dur: 2.4, title: "რომელი სამყარო\nჯობია? 👇", sub: "12 გახსნა — თითოს თავისი ამბავი", tr: "fade", trd: .4 }],
  texts: [{ from: 0, to: 2.6, text: "ოთხი გახსნა ერთდროულად ✨", y: 960, size: 54, pill: "rgba(12,9,6,.6)", pillLine: "rgba(232,203,138,.6)" }],
  cover: { dir: "w-cake", idx: 120, kicker: "ამბავი", title: "4 გახსნა\nერთდროულად", sub: "რომელი ჯობია? 👇" } }, true);

/* 05 · the opening moment, one per wedding design (tap + slow motion) */
[["w-champagne", "gala", "შამპანური, რომელიც\nბოკალებს რიგ-რიგად ავსებს 🥂", "შამპანურის\nკოშკი 🥂", 120],
 ["w-chapel", "adagio", "სანთლები ერთმანეთის\nმიყოლებით ინთება 🕯", "სანთლების\nტაძარი 🕯", 125],
 ["w-rings", "celesta", "ორი ბეჭედი\nერთმანეთს ეჭიდება 💍", "ორი ბეჭედი,\nერთი პირობა 💍", 130],
 ["w-veil", "ballad", "ფატა ნელა იწევა… 🤍", "ფატა 🤍", 85],
 ["w-cake", "serenade", "შუქი ქრება და… ✨🎂", "საქორწილო\nტორტი 🎂", 125]].forEach(([dir, song, hook, ctitle, cidx], i) => {
  put("05-moment-" + (i + 1), "05-გახსნის-მომენტი", `${i + 1}-${dir.slice(2)}.mp4`, { song, adelay: .75, theme: WED, endLines: WEDEND,
    segs: [{ type: "clip", dir, from: .9, dur: 6.6, speed: .8, tap: .75, zoom: [1, 1.06] }],
    texts: [{ from: 0, to: .9, text: "შეეხე ეკრანს 👆", y: 560, size: 60 }, { from: 1.1, to: 4.6, text: hook, y: 560, size: 60 }],
    cover: { dir, idx: cidx, kicker: "ქორწილის კოლექცია", title: ctitle, sub: "▶ ნახე გახსნა" } }, i === 0 || true);
});

/* 06 · for every celebration */
const FB = 60 / 128 * 4, CAT = [["w-rings", "💍 ქორწილი", 3.4], ["w-chapel", "🕯 ჯვრისწერა", 3.4], ["v-bottle", "🍾 ნიშნობა", 3.0], ["v-cranes", "🕊 ნათლობა", 3.0],
  ["v-vinyl", "💿 დაბადების დღე", 2.9], ["v-planets", "🚀 საბავშვო წვეულება", 3.2], ["v-curtain", "🎭 კორპორატიული", 3.0], ["v-balloons", "🎈 იუბილე", 3.0]];
put("06-every", "06-ყოველი-დღესასწაულისთვის", "ყოველი-დღესასწაულისთვის.mp4", { song: "festa",
  segs: [...CAT.map(([dir, label, from], i) => ({ type: "clip", dir, from, dur: FB, speed: 1.1, punch: true, label, labelY: 1620, tr: i ? "flash" : "cut", trd: .22 })),
    { type: "card", dur: FB * 1.2, title: "თქვენი დღესასწაული\nრომელია? 👇", sub: "მოსაწვევს ნებისმიერი ღონისძიებისთვის შევქმნით", tr: "flash", trd: .25 }],
  texts: [{ from: 0, to: 2.2, text: "ყოველი დღესასწაულისთვის —\nთავისი სამყარო ✨", y: 560, size: 58 }],
  cover: { dir: "v-vinyl", idx: 100, kicker: "ამბავი", title: "ყოველი\nდღესასწაულისთვის", sub: "ქორწილიდან დაბადების დღემდე ✨" } }, true);

/* 07 · POV: you got an invitation */
[["w-champagne", "gala", "ანა & ლუკა", "გამოგიგზავნეს მოსაწვევი 💍", WED, 110],
 ["w-veil", "ballad", "ელენე & ალექსანდრე", "გამოგიგზავნეს მოსაწვევი 🤍", WED, 85],
 ["v-planets", "chiptune", "ლუკა 🚀", "გეპატიჟება დაბადების დღეზე!", { bg1: "#3A1C6E", bg2: "#0B0A2E", ink: "#FFFFFF", acc: "#FFD36E" }, 112]].forEach(([dir, song, who, msg, theme, cidx], i) => {
  put("07-pov-" + (i + 1), "07-POV-მოსაწვევი-მიიღე", `POV-${i + 1}-${dir.slice(2)}.mp4`, { song, adelay: 2.9, theme,
    segs: [{ type: "pov", dir, dur: 2.5, from_: who, msg }, { type: "clip", dir, from: 1.0, dur: 6.4, speed: .9, tap: .45, tr: "zoom", trd: .35 }],
    cover: { dir, idx: cidx, kicker: "POV", title: "შენ მიიღე\nმოსაწვევი 💌", sub: "▶ ნახე, როგორ იხსნება" } }, true);
});

/* 08 · winter season */
put("08-winter", "08-ზამთრის-ღონისძიებები", "ზამთრის-ღონისძიებები.mp4", { song: "snow", theme: { bg1: "#1E3A66", bg2: "#060E1E", ink: "#F3F7FF", acc: "#E6C47E" },
  endLines: { l1: "ზამთრის ქორწილი · საახალწლო საღამო", l2: "კორპორატიული წვეულებები", cta: "შეუკვეთეთ თქვენი მოსაწვევი ❄️" },
  segs: [{ type: "card", dur: 2.3, bgdir: "v-snow-globe", bgfrom: 1, kicker: "ამბავი", title: "დეკემბერი\nახლოვდება ❄️", sub: "ზამთრის ღონისძიებებისთვის" },
    { type: "clip", dir: "v-snow-globe", from: 1.3, dur: 4.2, label: "❄️ ზამთრის ქორწილი", tr: "fade", trd: .4 },
    { type: "clip", dir: "v-curtain", from: 2.1, dur: 3.3, label: "🎭 საახალწლო კორპორატივი", tr: "flash", trd: .3 },
    { type: "clip", dir: "v-vinyl", from: 2.3, dur: 3.0, label: "💿 საახალწლო წვეულება", tr: "flash", trd: .3 },
    { type: "clip", dir: "v-snow-globe", from: 5.6, dur: 2.3, tr: "fade", trd: .4 },
    { type: "card", dur: 2.6, title: "ზამთრის ღონისძიებისთვის\nმოსაწვევი დროულად\nშეუკვეთეთ 🤍", size: 66, tr: "fade", trd: .4 }],
  cover: { dir: "v-snow-globe", idx: 100, kicker: "❄️ ამბავი", title: "ზამთრის\nღონისძიებები", sub: "ქორწილი · საახალწლო · კორპორატივი" } }, true);

fs.writeFileSync(path.join(D, "jobs.json"), JSON.stringify(jobs, null, 1)); console.log(jobs.length, "videos");
