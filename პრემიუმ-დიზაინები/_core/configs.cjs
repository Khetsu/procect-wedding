// node _core/configs.cjs — ექვსი დიზაინის config.js-ის თავდაპირველი ნიმუშები (კლიენტისთვის მერე config.js პირდაპირ შეიცვლება)
const fs = require("fs"), path = require("path"), ROOT = path.join(__dirname, "..");
const D = {
  "liquid-gold": { a: "ანა", b: "ლუკა", introScript: "Ana & Luka", kicker: "სიყვარულით გიწვევთ ჩვენს ქორწილში", date: "2027-06-26", time: "18:00", city: "თბილისი",
    story: "ორი წვეთი, რომლებიც ერთმანეთს იპოვიან, ერთ ოქროს ბეჭდად იქცევა. ასეთია ჩვენი ამბავიც — და გვინდა, მისი ყველაზე ბრწყინვალე დღე თქვენთან ერთად გავატაროთ.", sign: "ანა და ლუკა",
    program: [["16:00", "ჯვრისწერა", "სამების საკათედრო ტაძარი"], ["18:00", "შამპანური და მისალმება", "ოქროს დარბაზის ტერასა"], ["19:00", "საქორწილო ვახშამი", "ცოცხალი მუსიკით"], ["21:30", "პირველი ცეკვა", "და დიდი ზეიმი"]],
    venue: { name: "ოქროს დარბაზი", addr: "თბილისი, მთაწმინდა", map: "Mtatsminda, Tbilisi" }, palette: ["#0B0907", "#3A2A1A", "#B9893F", "#E7C68A", "#FBF3E2"],
    dressNote: "Black tie · შავი, შამპანური და ოქრო", rsvpBy: "1 ივნისამდე", music: "velvet", holdIcon: "💍", fonts: ["Italianno"],
    theme: { bg: "#070504", acc: "#E9C98A", acc2: "#A8803E", script: "'Italianno',cursive" }, scene: { a: "#C8913F", b: "#7A5124", c: "#FFF0D2" } },
  aurora: { a: "სოფო", b: "ნიკა", introScript: "Sopo & Nika", kicker: "ჩრდილოეთის ციალის ქვეშ — გიწვევთ ჩვენს ნიშნობაზე", date: "2027-02-14", time: "19:00", city: "გუდაური",
    story: "ერთ ზამთრის ღამეს ცა გაბრწყინდა და ჩვენ ერთმანეთს „კი“ ვუთხარით. ახლა გვინდა, ეს სინათლე თქვენც დაინახოთ.", sign: "სოფო და ნიკა",
    program: [["19:00", "შეხვედრა", "ცხელი ღვინო და ვარსკვლავები"], ["19:40", "ბეჭდების მომენტი", "მთების ფონზე"], ["20:15", "ვახშამი", "კამინთან"], ["22:00", "ცეკვა", "შუაღამემდე"]],
    venue: { name: "მთის სასტუმრო", addr: "გუდაური, მცხეთა-მთიანეთი", map: "Gudauri, Georgia" }, palette: ["#05101E", "#123A4A", "#2FD3A0", "#8A6BFF", "#F2F6FF"],
    dressNote: "ზამთრის საღამო · ღრმა ლურჯი, ზურმუხტისფერი და ვერცხლი", rsvpBy: "1 თებერვლამდე", music: "borealis", holdIcon: "✦", fonts: ["Ballet:opsz@16..72"],
    theme: { bg: "#03070F", acc: "#8FF0CE", acc2: "#5E8BFF", on: "#03121A", script: "'Ballet',cursive" }, scene: { a: "#2FE0A0", b: "#7A5CFF", c: "#FF7AD0" } },
  galaxy: { a: "თამარ", b: "ლევან", introScript: "Tamar & Levan", kicker: "ორი ვარსკვლავი, ერთი სამყარო — გიწვევთ ჩვენს ქორწილში", date: "2027-08-12", time: "19:00", city: "ბათუმი",
    story: "მილიარდობით ვარსკვლავს შორის ერთმანეთი ვიპოვეთ. ახლა ჩვენი ორი სამყარო ერთდება — და გვინდა, ეს წამი თქვენთან ერთად ვიზეიმოთ.", sign: "თამარი და ლევანი",
    program: [["17:00", "ჯვრისწერა", "წმინდა ნიკოლოზის ეკლესია"], ["19:00", "მისალმება", "ზღვის ტერასაზე"], ["20:00", "ვახშამი ვარსკვლავების ქვეშ", "ღია ცის ქვეშ"], ["22:30", "ფეიერვერკი", "და ცეკვა"]],
    venue: { name: "ზღვის ტერასა", addr: "ბათუმი, ბულვარი", map: "Batumi Boulevard" }, palette: ["#05030C", "#1E1446", "#5A3FB8", "#E6B2FF", "#FFF6E8"],
    dressNote: "კოსმოსური ელეგანტურობა · მუქი ლურჯი, იისფერი და ვერცხლი", rsvpBy: "15 ივლისამდე", music: "stardust", holdIcon: "✧", fonts: ["Allison"],
    theme: { bg: "#04030A", acc: "#E3C6FF", acc2: "#8F6BFF", on: "#140A2A", script: "'Allison',cursive" }, scene: { a: "#B98BFF", b: "#3A5BFF", c: "#FFF3E0" } },
  fireworks: { a: "Nova Group", title: "Nova Group · 10 წელი", introScript: "10 years", kicker: "გიწვევთ კომპანიის 10 წლის იუბილეზე", date: "2027-12-22", time: "20:00", city: "თბილისი",
    story: "ათი წელი, ასობით გამარჯვება და ერთი დიდი გუნდი. ეს ღამე თქვენთვისაა — პარტნიორებისა და მეგობრებისთვის, ვინც ჩვენთან ერთად შექმნა ეს ამბავი.", sign: "Nova Group-ის გუნდი",
    program: [["20:00", "წითელი ხალიჩა", "შამპანური და ფოტოზონა"], ["20:45", "გალა ვახშამი", "დიდი დარბაზი"], ["22:00", "დაჯილდოება", "ათწლეულის საუკეთესოები"], ["23:59", "ფეიერვერკი", "და დისკო"]],
    venue: { name: "მდინარის დარბაზი", addr: "თბილისი, მტკვრის სანაპირო", map: "Tbilisi riverside" }, palette: ["#07051A", "#2A0F4A", "#FF4F9A", "#FFD35A", "#FFFFFF"],
    dressNote: "Cocktail · ბრჭყვიალა, ფერადი და სადღესასწაულო", rsvpBy: "10 დეკემბრამდე", music: "celebration", holdIcon: "🎆", holdText: "დააჭირეთ და გააჩერეთ — აფრენა!", fonts: ["Rouge+Script"],
    cdCap: "იუბილემდე", theme: { bg: "#06041A", acc: "#FFD35A", acc2: "#FF4F9A", on: "#2A0A1A", script: "'Rouge Script',cursive" }, scene: { a: "#FFC24A", b: "#FF4FA0", c: "#7AD8FF" } },
  silk: { a: "ელენე", b: "გიორგი", introScript: "Elene & Giorgi", kicker: "სიყვარულით გიწვევთ ჩვენს ქორწილში", date: "2027-05-15", time: "17:00", city: "სიღნაღი",
    story: "ზოგი სიყვარული აბრეშუმივით ნაზია და ამავდროულად ყველაზე ძლიერი. გვინდა, ჩვენი ყველაზე ნაზი დღე თქვენ გვერდით გავატაროთ.", sign: "ელენე და გიორგი",
    program: [["16:00", "ჯვრისწერა", "ბოდბის მონასტერი"], ["17:30", "მისალმება ბაღში", "ლიმონათი და შამპანური"], ["19:00", "ვახშამი", "ალაზნის ველის ხედით"], ["21:00", "პირველი ცეკვა", "ვარსკვლავების ქვეშ"]],
    venue: { name: "ბაღის სასტუმრო", addr: "სიღნაღი, კახეთი", map: "Sighnaghi, Georgia" }, palette: ["#FFFFFF", "#F4E6DC", "#E4C4B8", "#C9A48C", "#8E6F5E"],
    dressNote: "ნაზი ტონები · თეთრი, პუდრისფერი და შამპანური", rsvpBy: "1 მაისამდე", music: "satin", holdIcon: "🤍", fonts: ["Herr+Von+Muellerhoff"],
    theme: { bg: "#120C0A", acc: "#F3D3BE", acc2: "#C9957A", on: "#2A1A12", script: "'Herr Von Muellerhoff',cursive" }, scene: { a: "#D9B49E", b: "#6E4A3C", c: "#FFF1E4" } },
  vitrage: { a: "ნინო", b: "დავითი", introScript: "Nino & Davit", kicker: "ღვთის კურთხევით გიწვევთ ჩვენს ჯვრისწერაზე", date: "2027-09-18", time: "15:00", city: "მცხეთა",
    story: "ჩვენი პირობა ღვთის წინაშე ითქმება, სინათლითა და სიყვარულით. გვინდა, ეს წმინდა წუთები ჩვენი ოჯახისა და მეგობრების გვერდით გავიაროთ.", sign: "ნინო და დავითი",
    program: [["15:00", "ჯვრისწერა", "სვეტიცხოვლის საკათედრო ტაძარი"], ["16:30", "ფოტოები ტაძრის ეზოში", "ოჯახთან და მეგობრებთან"], ["18:00", "საქორწილო სუფრა", "არაგვის სანაპირო"], ["20:30", "ქართული სიმღერები", "და ცეკვა"]],
    venue: { name: "სვეტიცხოვლის ტაძარი", addr: "მცხეთა", map: "Svetitskhoveli Cathedral" }, palette: ["#0A0806", "#5A1A1A", "#1C3A8A", "#D9A43A", "#F3EEE4"],
    dressNote: "ტაძრისთვის შესაფერისი, დახვეწილი სამოსი", rsvpBy: "1 სექტემბრამდე", music: "cathedral", holdIcon: "✝", fonts: ["Monsieur+La+Doulaise"],
    theme: { bg: "#070605", acc: "#E8C27A", acc2: "#9C7A3E", on: "#1E1408", script: "'Monsieur La Doulaise',cursive" }, scene: { a: "#E9B34A", b: "#2A4BC0", c: "#FFF1D6" } }
};
for (const [dir, c] of Object.entries(D)){
  fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
  const prog = c.program.map(([time, title, place]) => ({ time, title, place })); const { program, ...rest } = c;
  const body = JSON.stringify({ ...rest, program: prog, phone: "" }, null, 2);
  fs.writeFileSync(path.join(ROOT, dir, "config.js"), `/* ამბავი · პრემიუმ დიზაინები · ${dir}. ახალი კლიენტისთვის მხოლოდ ეს ფაილი შეცვალე, მერე: node _core/build.cjs\n   phone — WhatsApp ნომერი დადასტურებისთვის (მაგ. "995598000000"). */\nwindow.P = ${body};\n`);
  console.log("config", dir);
}
