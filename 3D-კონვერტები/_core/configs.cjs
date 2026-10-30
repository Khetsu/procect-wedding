// node _core/configs.cjs — ხუთი 3D დიზაინის config.js-ის ნიმუშები (ყურადღება: არსებულ config.js-ს გადაწერს)
const fs = require("fs"), path = require("path"), ROOT = path.join(__dirname, "..");
const SERIF = "'Noto Serif Georgian',serif", SANS = "'Noto Sans Georgian',sans-serif";
const D = {
  "sky-letter": { a: "ქეთევან", b: "ალექსანდრე", latin: "Ketevan & Aleksandre", mono: "K&A", kicker: "სიყვარულით გიწვევთ ჩვენს ქორწილში", date: "2027-06-12", time: "19:00", city: "ქობულეთი",
    story: "ზოგი წერილი ქარს მოაქვს. ჩვენი ამბავიც ასე დაიწყო — მსუბუქად, მოულოდნელად და სამუდამოდ. გვინდა, ამ ზაფხულის საღამოს, ზღვის პირას, ჩვენ გვერდით იყოთ.", sign: "ქეთევანი და ალექსანდრე",
    program: [["17:30", "ჯვრისწერა", "წმინდა ნიკოლოზის ეკლესია", "church"], ["19:00", "მისალმება", "ზღვის ნაპირზე", "glass"], ["20:00", "ვახშამი", "ნაპირის ბაღში", "dinner"], ["22:00", "ცეკვა", "ვარსკვლავების ქვეშ", "music"]],
    venue: { name: "ნაპირის ბაღი", addr: "ქობულეთი, ზღვის სანაპირო", map: "Kobuleti beach, Georgia" }, palette: ["#FFFFFF", "#DCE6F0", "#9DB4D2", "#3C5F88", "#C9CFD8"],
    dressNote: "ზაფხულის საღამო · თეთრი, ცისფერი და ვერცხლისფერი", rsvpBy: "20 მაისამდე", music: "brise", fonts: ["Ephesis", "Gilda+Display"],
    theme: { bg: "#E6EBF0", ink: "#2F3E57", soft: "#7D8AA0", acc: "#5D7DA6", btn: "#3C5F88", btnInk: "#F4F7FA", pn1: "rgba(255,255,255,.86)", pn2: "rgba(240,245,250,.8)", edge: "rgba(93,125,166,.28)", chip: "rgba(255,255,255,.6)",
      hiC: "#5D7DA6", hiInk: "#2F3E57", hiSh: "rgba(255,255,255,.7)", vig: ".22", card: "#FBFAF7", cardInk: "#2F3E57", cardSoft: "#7D8AA0", foilTone: "#B7C2D0", serif: SERIF, sans: SANS, script: "'Ephesis',cursive", num: "'Gilda Display',serif" } },
  origami: { a: "სალომე", b: "ირაკლი", latin: "Salome & Irakli", mono: "S&I", kicker: "გიწვევთ ჩვენს ნიშნობაზე", date: "2027-10-09", time: "17:00", city: "ახალციხე",
    story: "ქაღალდის ფურცელივით ვიყავით — ცალ-ცალკე, უბრალოდ. ერთმანეთმა ისე დაგვკეცა, რომ ერთ მთლიან ამბად ვიქეცით. გვინდა, ეს დღე თქვენთან ერთად აღვნიშნოთ.", sign: "სალომე და ირაკლი",
    program: [["17:00", "შეხვედრა", "ციხის ეზოში", "glass"], ["17:40", "ბეჭდის მომენტი", "ციხის კედლებთან", "ring"], ["18:30", "ვახშამი", "ძველ დარბაზში", "dinner"], ["20:30", "მუსიკა", "და ცეკვა", "music"]],
    venue: { name: "რაბათის ციხე", addr: "ახალციხე, რაბათი", map: "Rabati Castle, Akhaltsikhe" }, palette: ["#F8F5EC", "#DDE3D6", "#A9B79E", "#56684F", "#C2A160"],
    dressNote: "შემოდგომის ბაღი · მწვანე, კრემისფერი და ოქრო", rsvpBy: "25 სექტემბრამდე", music: "washi", fonts: ["Mrs+Saint+Delafield", "Marcellus"],
    theme: { bg: "#DDE3D6", ink: "#33402F", soft: "#7A8673", acc: "#8A6A3A", btn: "#56684F", btnInk: "#F6F3EA", pn1: "rgba(250,248,241,.9)", pn2: "rgba(238,242,232,.84)", edge: "rgba(86,104,79,.25)", chip: "rgba(255,255,255,.55)",
      hiC: "#56684F", hiInk: "#33402F", hiSh: "rgba(255,255,255,.7)", vig: ".25", card: "#F8F5EC", cardInk: "#33402F", cardSoft: "#7A8673", foilTone: "#C2A160", serif: SERIF, sans: SANS, script: "'Mrs Saint Delafield',cursive", num: "'Marcellus',serif" } },
  popup: { a: "ნინი", b: "საბა", latin: "Nini & Saba", mono: "N&S", kicker: "სიყვარულით გიწვევთ ჩვენს ქორწილში", date: "2027-08-21", time: "18:30", city: "წინანდალი",
    story: "ჩვენი ამბავი წიგნივით გადაიშალა — ყოველ გვერდზე ახალი ბაღი, ახალი სინათლე. ახლა მთავარი გვერდი იხსნება და ძალიან გვინდა, მას თქვენც ჩვენთან ერთად ნახოთ.", sign: "ნინი და საბა",
    program: [["17:00", "ჯვრისწერა", "ალავერდის მონასტერი", "church"], ["18:30", "მისალმება", "ძველ ბაღში", "glass"], ["19:30", "საქორწილო სუფრა", "ვენახის ხედით", "dinner"], ["22:00", "ტორტი და ცეკვა", "შუაღამემდე", "cake"]],
    venue: { name: "წინანდლის ძველი ბაღი", addr: "წინანდალი, კახეთი", map: "Tsinandali Estate" }, palette: ["#FBF5EC", "#E9C9A9", "#C98A62", "#8E4E2E", "#5E6B4A"],
    dressNote: "კახური ზაფხული · ტერაკოტა, კრემისფერი და ზეთისხილისფერი", rsvpBy: "1 აგვისტომდე", music: "terra", fonts: ["Petit+Formal+Script", "Prata"],
    theme: { bg: "#2A1B14", ink: "#3D2A20", soft: "#8A6E5E", acc: "#B4643C", btn: "#B4643C", btnInk: "#FFF5EC", pn1: "rgba(253,247,240,.93)", pn2: "rgba(246,235,224,.9)", edge: "rgba(180,100,60,.28)", chip: "rgba(255,255,255,.5)",
      hiC: "#E8B48F", hiInk: "#FBEFE4", vig: ".5", card: "#FBF5EC", cardInk: "#3D2A20", cardSoft: "#8A6E5E", foilTone: "#C99A5B", serif: SERIF, sans: SANS, script: "'Petit Formal Script',cursive", num: "'Prata',serif" } },
  levitate: { a: "ლიზი", big: "18", latin: "Lizi · Eighteen", mono: "L", monoS: 40, monoY: 64, title: "ლიზის 18 წლის დაბადების დღე", kicker: "გიწვევ ჩემს 18 წლის დაბადების დღეზე", date: "2027-03-27", time: "21:00", city: "თბილისი", storyCap: "ჩემი ამბავი",
    story: "თვრამეტი წელი, უამრავი ოცნება და ახალი თავგადასავლის დასაწყისი. ამ ღამეს მინდა, ჩემ გვერდით ის ადამიანები იყვნენ, ვინც ჩემი ცხოვრება ასე ნათელი გახადა.", sign: "გელოდები, ლიზი", cdCap: "წვეულებამდე დარჩა", finName: "ლიზის 18 წელი",
    program: [["21:00", "შეხვედრა", "ქალაქის ხედით", "glass"], ["21:45", "ვახშამი", "Sky Lounge", "dinner"], ["23:00", "ტორტი", "და სანთლები", "cake"], ["23:30", "DJ და ცეკვა", "დილამდე", "music"]],
    venue: { name: "Sky Lounge 360", addr: "თბილისი, მთაწმინდა", map: "Mtatsminda, Tbilisi" }, palette: ["#0D0A1C", "#3A2A6E", "#B9A3FF", "#F1ECFF", "#D9D2EC"],
    dressNote: "ღამის გლამური · შავი, იისფერი და ვერცხლი", rsvpBy: "15 მარტამდე", music: "lumiere", fonts: ["Mr+Dafoe", "Bodoni+Moda:wght@400;500"],
    theme: { bg: "#0D0A1C", ink: "#F1ECFF", soft: "rgba(241,236,255,.66)", acc: "#C9B6FF", btn: "#B9A3FF", btnInk: "#1A1233", pn1: "rgba(38,28,72,.8)", pn2: "rgba(20,15,40,.84)", edge: "rgba(201,182,255,.3)", chip: "rgba(255,255,255,.07)",
      hiC: "#C9B6FF", hiInk: "#F1ECFF", vig: ".55", card: "#1D1636", cardInk: "#F1ECFF", cardSoft: "#B6ABD6", foilTone: "#D9D2EC", serif: SERIF, sans: SANS, script: "'Mr Dafoe',cursive", num: "'Bodoni Moda',serif" } },
  fan: { a: "ანასტასია", latin: "Anastasia", mono: "A", monoS: 40, monoY: 64, kicker: "ღვთის კურთხევით გიწვევთ ჩვენი ქალიშვილის ნათლობაზე", date: "2027-05-08", time: "13:00", city: "თბილისი", storyCap: "ჩვენი ანგელოზი",
    story: "ჩვენს სახლში ახალი სინათლე შემოვიდა — ანასტასია. გვინდა, მისი ნათლობის წმინდა დღე ჩვენი ოჯახისა და ყველაზე ახლობელი ადამიანების გვერდით გავატაროთ.", sign: "მშობლები — მარიამი და ლუკა", cdCap: "ნათლობამდე დარჩა", finName: "ანასტასიას ნათლობა",
    program: [["13:00", "ნათლობა", "წმინდა ნინოს ეკლესია", "church"], ["15:00", "საოჯახო სუფრა", "რესტორანი „თეთრი ბაღი“", "dinner"], ["16:30", "ტორტი და ფოტოები", "პატარა ანასტასიასთან", "camera"]],
    venue: { name: "რესტორანი „თეთრი ბაღი“", addr: "თბილისი, საბურთალო", map: "Saburtalo, Tbilisi" }, palette: ["#FFFFFF", "#F6E2D6", "#E9C3AB", "#C9906A", "#E8D9B6"],
    dressNote: "ნაზი ტონები · თეთრი, ატმისფერი და შამპანური", rsvpBy: "25 აპრილამდე", music: "berceau", fonts: ["Qwigley", "Cormorant+Upright:wght@400;500;600"],
    theme: { bg: "#EFDCCF", ink: "#4E3A33", soft: "#9A8178", acc: "#C08A5A", btn: "#C9906A", btnInk: "#FFF8F2", pn1: "rgba(255,250,246,.9)", pn2: "rgba(250,238,230,.86)", edge: "rgba(192,138,90,.3)", chip: "rgba(255,255,255,.6)",
      hiC: "#C08A5A", hiInk: "#4E3A33", hiSh: "rgba(255,255,255,.7)", vig: ".22", card: "#FFFBF7", cardInk: "#4E3A33", cardSoft: "#9A8178", foilTone: "#D6AE7E", serif: SERIF, sans: SANS, script: "'Qwigley',cursive", num: "'Cormorant Upright',serif" } }
};
for (const [dir, c] of Object.entries(D)){
  fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
  const { program, ...rest } = c, body = JSON.stringify({ type: dir, ...rest, program: program.map(([time, title, place, icon]) => ({ time, title, place, icon })), phone: "" }, null, 2);
  fs.writeFileSync(path.join(ROOT, dir, "config.js"), `/* ამბავი · 3D კონვერტები · ${dir}. ახალი კლიენტისთვის მხოლოდ ეს ფაილი შეცვალე, მერე: node _core/build.cjs ${dir}
   phone — WhatsApp ნომერი (მაგ. "995598000000"). icon: church · glass · dinner · music · ring · cake · camera · star · heart */
window.E = ${body};\n`);
  console.log("config", dir);
}
