// node _core/configs.cjs — ხუთი დიზაინის config.js-ის ნიმუშები (ახალი კლიენტისთვის config.js პირდაპირ შეიცვლება)
const fs = require("fs"), path = require("path"), ROOT = path.join(__dirname, "..");
const SERIF = "'Noto Serif Georgian',serif", SANS = "'Noto Sans Georgian',sans-serif";
const D = {
  "wax-seal": { a: "მარიამ", b: "გიორგი", latin: "Mariam & Giorgi", mono: "M&G", kicker: "სიყვარულით გიწვევთ ჩვენს ქორწილში", date: "2027-07-10", time: "18:00", city: "თბილისი",
    story: "ერთი შემთხვევითი შეხვედრა, ათასი საერთო ღიმილი და ერთი დიდი „კი“. გვინდა, ჩვენი ცხოვრების ყველაზე მნიშვნელოვანი დღე იმ ადამიანებთან ერთად აღვნიშნოთ, ვინც ყველაზე მეტად გვიყვარს.", sign: "მარიამი და გიორგი",
    program: [["16:00", "ჯვრისწერა", "სამების საკათედრო ტაძარი", "church"], ["18:00", "შამპანური და მისალმება", "ვილის ბაღი", "glass"], ["19:00", "საქორწილო ვახშამი", "ცოცხალი მუსიკით", "dinner"], ["21:30", "პირველი ცეკვა", "და დიდი ზეიმი", "music"]],
    venue: { name: "ვილა ბორდო", addr: "თბილისი, წყნეთი", map: "Tskneti, Tbilisi" }, palette: ["#F4ECDD", "#D9C3A0", "#B08A4E", "#7E1A2A", "#3A1F1A"],
    dressNote: "Black tie · აივორი, ბორდო და ოქრო", rsvpBy: "20 ივნისამდე", music: "valse", foil: "gold", edge: "gilt", fonts: ["Corinthia:wght@400;700", "Cormorant+Garamond:wght@400;500;600"],
    paperOpt: { grain: 8, mottle: .04, fiber: 70 }, table: { kind: "walnut", c1: "#1A100A", c2: "#5C3B22", seed: 5 }, fx: { kind: "dust", rate: 3 },
    theme: { bg: "#1C130C", paper: "#FBF7EF", ink: "#3A2A22", soft: "#8C7466", acc: "#9C7A3C", line: "rgba(156,122,60,.38)", btn: "#7E1A2A", btnInk: "#FBF3E6", field: "rgba(255,255,255,.62)",
      hintC: "#E9CC8E", hintInk: "#F8EEDC", lamp: "rgba(255,210,150,.26)", vig: ".62", serif: SERIF, sans: SANS, script: "'Corinthia',cursive", num: "'Cormorant Garamond',serif" } },
  ribbon: { a: "ნატა", b: "ლევანი", latin: "Nata & Levani", mono: "N&L", kicker: "სიყვარულით გიწვევთ ჩვენს ქორწილში", date: "2027-09-04", time: "19:00", city: "ბორჯომი",
    story: "ზოგი ამბავი ლენტით შეკრული საჩუქარივით იწყება — ნელა, სიფრთხილით და დიდი მოლოდინით. ჩვენი ამბავი ახლა იხსნება და ძალიან გვინდა, ამ დღეს თქვენც ჩვენ გვერდით იყოთ.", sign: "ნატა და ლევანი",
    program: [["17:00", "ჯვრისწერა", "წმინდა სერაფიმეს ეკლესია", "church"], ["19:00", "მისალმება", "სასახლის ტერასაზე", "glass"], ["20:00", "გალა ვახშამი", "ზურმუხტის დარბაზი", "dinner"], ["22:00", "ცეკვა და ტორტი", "შუაღამემდე", "cake"]],
    venue: { name: "ძველი პარკის სასახლე", addr: "ბორჯომი, ცენტრალური პარკი", map: "Borjomi Central Park" }, palette: ["#0F3B2F", "#1F5A45", "#D9B66C", "#F3EAD3", "#0B0B0A"],
    dressNote: "საღამოს ელეგანტურობა · ზურმუხტისფერი, შავი და ოქრო", rsvpBy: "15 აგვისტომდე", music: "emerald", foil: "gold", edge: "gilt", fonts: ["Imperial+Script", "Cinzel:wght@400;500"],
    paperOpt: { grain: 10, mottle: .08, fiber: 40, fleck: 34 }, table: { kind: "marble", c1: "#09090A", c2: "#2B2E2D", c3: "#7A6236", seed: 8 }, fx: { kind: "flecks", rate: 2.2 },
    theme: { bg: "#070908", paper: "#0F3B2F", ink: "#F3EAD3", soft: "rgba(243,234,211,.7)", acc: "#D9B66C", line: "rgba(217,182,108,.42)", btn: "#D9B66C", btnInk: "#0B2A21", field: "rgba(255,255,255,.07)",
      hintC: "#E2C27E", hintInk: "#F4ECD8", lamp: "rgba(255,230,180,.15)", vig: ".7", mapBase: "rgba(255,255,255,.04)", mapRoad: "rgba(243,234,211,.22)", serif: SERIF, sans: SANS, script: "'Imperial Script',cursive", num: "'Cinzel',serif" } },
  bloom: { a: "ელენე", b: "დავითი", latin: "Elene & Davit", mono: "E&D", kicker: "გიწვევთ ჩვენს ნიშნობაზე", date: "2027-05-22", time: "18:30", city: "თელავი",
    story: "ჩვენი სიყვარული ყვავილივით გაიშალა — ნელა, ნაზად და მთელი ძალით. გვინდა, გაზაფხულის ამ საღამოს ჩვენი „კი“ პირველებმა თქვენ გაიგოთ.", sign: "ელენე და დავითი",
    program: [["18:30", "შეხვედრა ბაღში", "ლიმონათი და შამპანური", "glass"], ["19:00", "ბეჭდის მომენტი", "ვარდების თაღის ქვეშ", "ring"], ["19:30", "ვახშამი", "ალაზნის ველის ხედით", "dinner"], ["21:00", "მუსიკა და ცეკვა", "ვარსკვლავების ქვეშ", "music"]],
    venue: { name: "ვარდების ბაღი", addr: "თელავი, კახეთი", map: "Telavi, Georgia" }, palette: ["#FFFFFF", "#F8DCE0", "#EFB7C0", "#C9A0A6", "#A9B89E"],
    dressNote: "გაზაფხულის ტონები · თეთრი, პუდრისფერი და ნაზი მწვანე", rsvpBy: "10 მაისამდე", music: "blossom", foil: "rose", edge: "deckle", fonts: ["Bonheur+Royale", "Cormorant+Garamond:wght@400;500;600"],
    paperOpt: { grain: 12, mottle: .045, fiber: 130 }, table: { kind: "linen", c1: "#E4D0C8", c2: "#FBF4F0", seed: 6 }, fx: { kind: "petals", rate: 1.5, cols: ["#F4B9C2", "#EFA3B1", "#F8D0D6", "#E58FA0"] },
    theme: { bg: "#EAD8D1", paper: "#FFF9F5", ink: "#5B3B40", soft: "#A3838A", acc: "#B9707C", line: "rgba(185,112,124,.34)", btn: "#C48490", btnInk: "#FFF8F6", field: "rgba(255,255,255,.72)",
      hintC: "#B9707C", hintInk: "#5B3B40", lamp: "rgba(255,255,255,.38)", vig: ".26", ping: "rgba(185,112,124,.5)", serif: SERIF, sans: SANS, script: "'Bonheur Royale',cursive", num: "'Cormorant Garamond',serif" } },
  stars: { a: "ნიკოლოზი", latin: "Nikoloz", mono: "N", monoSize: 40, monoDy: 74, kicker: "ღვთის კურთხევით გიწვევთ ჩვენი ვაჟის ნათლობაზე", date: "2027-04-17", time: "13:00", city: "თბილისი", storyCap: "ჩვენი პატარა ვარსკვლავი",
    story: "ჩვენს ცაზე ახალი ვარსკვლავი აინთო — ნიკოლოზი. გვინდა, მის ცხოვრებაში ამ წმინდა დღეს ჩვენი ოჯახის ყველაზე ახლობელი ადამიანები იყვნენ.", sign: "მშობლები — ანა და ლაშა", cdCap: "ნათლობამდე დარჩა", introTo: "ძვირფასო სტუმარო,",
    program: [["13:00", "ნათლობა", "წმინდა გიორგის ეკლესია", "church"], ["15:00", "საოჯახო სუფრა", "რესტორანი „ცისფერი სახლი“", "dinner"], ["16:30", "ტორტი და ფოტოები", "პატარა ნიკოლოზთან ერთად", "cake"]],
    venue: { name: "რესტორანი „ცისფერი სახლი“", addr: "თბილისი, ვაკე", map: "Vake, Tbilisi" }, palette: ["#FFFFFF", "#DCE6F5", "#9DB4DA", "#1B2A55", "#C9A45C"],
    dressNote: "ნაზი ტონები · თეთრი, ცისფერი და ოქრო", rsvpBy: "5 აპრილამდე", music: "lullaby", foil: "gold", edge: "gilt", fonts: ["Birthstone", "Cormorant+Garamond:wght@400;500;600"], finName: "ნიკოლოზის ნათლობა",
    paperOpt: { grain: 8, mottle: .04, fiber: 70 }, table: { kind: "velvet", c1: "#04081A", c2: "#1E2F63", seed: 12 }, fx: { kind: "dust", rate: 2, stars: 70, starA: .75, mote: "rgba(255,236,190,1)" },
    theme: { bg: "#060B1E", paper: "#FBF6EA", ink: "#1B2A55", soft: "#6B7595", acc: "#B08A3C", line: "rgba(176,138,60,.4)", btn: "#1B2A55", btnInk: "#F6E9C8", field: "rgba(255,255,255,.66)",
      hintC: "#E5C987", hintInk: "#EEF1FA", lamp: "rgba(170,190,255,.14)", vig: ".62", serif: SERIF, sans: SANS, script: "'Birthstone',cursive", num: "'Cormorant Garamond',serif" } },
  noir: { a: "თამარი", big: "50", latin: "The Golden Jubilee", mono: "T", monoSize: 40, monoDy: 74, title: "თამარის 50 წლის იუბილე", kicker: "გიწვევთ ჩემს ოქროს იუბილეზე", date: "2027-11-20", time: "20:00", city: "თბილისი", storyCap: "ნახევარი საუკუნე",
    story: "ნახევარი საუკუნე სიყვარულის, მეგობრობისა და დიდი თავგადასავლების. ამ საღამოს მინდა, ჩემ გვერდით ის ადამიანები იყვნენ, ვინც ჩემი ამბავი გაალამაზა.", sign: "სიყვარულით, თამარი", cdCap: "იუბილემდე დარჩა", finName: "თამარის ოქროს იუბილე",
    program: [["20:00", "შამპანური და მისალმება", "ოქროს ფოიე", "glass"], ["20:45", "გალა ვახშამი", "დიდი დარბაზი", "dinner"], ["22:00", "ჯაზ-ბენდი", "1920-იანების საღამო", "music"], ["23:00", "იუბილის ტორტი", "და ცეკვა", "cake"]],
    venue: { name: "გეტსბის დარბაზი", addr: "თბილისი, რუსთაველის გამზირი", map: "Rustaveli Avenue, Tbilisi" }, palette: ["#0B0A09", "#3A3128", "#8C6A2E", "#D4AF62", "#F1E6CC"],
    dressNote: "Black tie · შავი და ოქრო, 1920-იანების სტილი", rsvpBy: "5 ნოემბრამდე", music: "noir", foil: "gold", edge: "gilt", fonts: ["Luxurious+Script", "Italiana", "Cinzel:wght@400;500"],
    paperOpt: { grain: 6, mottle: .03, fiber: 30 }, table: { kind: "suede", c1: "#090808", c2: "#2A2622", seed: 9 }, fx: { kind: "dust", rate: 3.5 },
    theme: { bg: "#080706", paper: "#0F0E0C", ink: "#EFE4CB", soft: "rgba(239,228,203,.64)", acc: "#D4AF62", line: "rgba(212,175,98,.4)", btn: "#D4AF62", btnInk: "#15110A", field: "rgba(255,255,255,.06)",
      hintC: "#E0BE76", hintInk: "#F1E6CC", lamp: "rgba(255,220,160,.3)", vig: ".84", mapBase: "rgba(255,255,255,.035)", mapRoad: "rgba(239,228,203,.2)", serif: SERIF, sans: SANS, script: "'Luxurious Script',cursive", num: "'Italiana',serif" } }
};
for (const [dir, c] of Object.entries(D)){
  fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
  const { program, ...rest } = c, body = JSON.stringify({ type: dir, ...rest, program: program.map(([time, title, place, icon]) => ({ time, title, place, icon })), phone: "" }, null, 2);
  fs.writeFileSync(path.join(ROOT, dir, "config.js"), `/* ამბავი · პრემიუმ კონვერტები · ${dir}. ახალი კლიენტისთვის მხოლოდ ეს ფაილი შეცვალე, მერე: node _core/build.cjs ${dir}
   phone — WhatsApp ნომერი დადასტურებისთვის (მაგ. "995598000000"). icon: church · glass · dinner · music · ring · cake · camera · star · heart */
window.E = ${body};\n`);
  console.log("config", dir);
}
