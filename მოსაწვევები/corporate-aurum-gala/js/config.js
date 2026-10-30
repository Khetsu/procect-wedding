/* =====================================================================
   ამბავი · კორპორატიული საღამოს მოსაწვევი · დიზაინი „ოქროს გალა“ (შავი, ოქრო, შამპანური)
   ახალი კომპანიისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   ფოტო: images/hero.jpg (კომპანიის ან დარბაზის ფოტო; ახლა დგას 3D შამპანურის ილუსტრაცია)
   ===================================================================== */
window.CONFIG = {
  id: "aurum-gala-2026",
  title: { ka: "Aurum Group · წლიური გალა საღამო", en: "Aurum Group · Annual Gala Night" },
  host: { ka: "Aurum Group", en: "Aurum Group" },
  script: "Gala Night",
  monogram: "AG",
  date: "2026-12-18",
  city: { ka: "თბილისი", en: "Tbilisi" },

  heroPhoto: "images/hero.jpg",
  kicker: { ka: "გიწვევთ წლიურ გალა საღამოზე", en: "You are invited to our annual gala" },
  lead: { ka: "მადლობა, რომ ეს წელი ჩვენთან ერთად გაიარეთ. გვსურს, მისი დასრულება ელეგანტურ საღამოზე, მუსიკით, ვახშმითა და წლის საუკეთესოთა დაჯილდოებით აღვნიშნოთ.",
          en: "Thank you for sharing this year with us. Let us celebrate its close with an elegant evening of music, dinner and the awards for the year's best." },

  /* ორი მთავარი ბარათი (ხატულა, დრო, დარბაზი, მისამართი, რუკა) */
  venue1: { ka: "მისაღები", en: "Welcome reception" }, venue1Time: "19:00", venue1Place: { ka: "Grand Hall Aurora · ფოიე", en: "Grand Hall Aurora · Foyer" }, venue1Addr: { ka: "რუსთაველის გამზ. 1, თბილისი", en: "1 Rustaveli Ave, Tbilisi" }, venue1Map: "Rustaveli Avenue 1, Tbilisi",
  venue2: { ka: "გალა ვახშამი", en: "Gala dinner" }, venue2Time: "20:30", venue2Place: { ka: "Grand Hall Aurora · მთავარი დარბაზი", en: "Grand Hall Aurora · Main hall" }, venue2Addr: { ka: "რუსთაველის გამზ. 1, თბილისი", en: "1 Rustaveli Ave, Tbilisi" }, venue2Map: "Rustaveli Avenue 1, Tbilisi",

  /* საღამოს პროგრამა (main: true — უკუთვლა ამ დრომდე ითვლის) */
  events: [
    { time: "19:00", icon: "glasses", title: { ka: "შეხვედრა და შამპანური", en: "Arrival & champagne" } },
    { time: "19:45", icon: "users", title: { ka: "გახსნის სიტყვა", en: "Opening speech" }, main: true },
    { time: "20:30", icon: "cake", title: { ka: "გალა ვახშამი", en: "Gala dinner" } },
    { time: "21:30", icon: "star", title: { ka: "წლის დაჯილდოება", en: "Awards of the year" } },
    { time: "22:30", icon: "dance", title: { ka: "ცოცხალი მუსიკა და ცეკვა", en: "Live music & dancing" } }
  ],

  dressCode: { ka: "Black Tie", en: "Black Tie" },
  dressNote: { ka: "საღამოს ელეგანტური სამოსი: მამაკაცებისთვის სმოკინგი ან მუქი კოსტიუმი, ქალბატონებისთვის გრძელი კაბა.", en: "Evening attire: tuxedo or dark suit, floor-length dresses." },
  palette: ["#0E0E11", "#2A2A30", "#C9A55A", "#E9D9B4", "#F7F2E8"],
  hashtag: "#AurumGala2026",
  shareNote: { ka: "გაგვიზიარეთ საღამოს ფოტოები და ვიდეოები ამ ჰეშთეგით.", en: "Share your photos and stories of the night with this hashtag." },
  contactName: { ka: "ნინო ბერიძე · ღონისძიების კოორდინატორი", en: "Nino Beridze · Event coordinator" },

  calTitle: { ka: "Aurum Group · გალა საღამო", en: "Aurum Group · Gala Night" },
  rsvpTo: { ka: "Aurum Group", en: "Aurum Group" },
  rsvpEvent: { ka: "გალა საღამოზე", en: "the gala night" },
  shareText: { ka: "Aurum Group-ის გალა საღამოს მოსაწვევი", en: "Aurum Group gala night invitation" },
  whatsapp: "",                                // ორგანიზატორის ნომერი, მაგ. "995599123456"

  music: "waltz",                              // ან საკუთარი: "music/song.mp3"
  musicFallback: "waltz",
  fx: ["gold:0.5"],
  fxGate: ["gold:0.5"],
  openFx: "gold:40",
  rsvpFx: "gold",
  trail: false,

  /* 3D კონვერტი: შავი ქაღალდი, ოქროს ხაზები, ოქროს ლითონის ბეჭედი */
  envelope: {
    paper: ["#1C1C21", "#0E0E11"], flap: ["#222228", "#121216"], liner: ["#2B261D", "#16130E"], pattern: "lines",
    accent: "#D4B26A", metal: true, back: "#141417",
    card: ["#FBF7EE", "#EEE4D0"], cardAccent: "#B8924A", ink: "#2A2622", soft: "#7D7263",
    cardTitle: { ka: "წლიური გალა საღამო", en: "ANNUAL GALA NIGHT" }, cardLine: { ka: "19:00 · Grand Hall Aurora", en: "7 PM · Grand Hall Aurora" },
    seal: "#C9A55A", sealSide: "#8E7036", sealMetal: .9, sparks: "#FFD98A",
    fontHead: '"Cinzel", "Noto Serif Georgian", serif', fontScript: '"Pinyon Script", cursive', fontNum: '"Cinzel", serif'
  },
  texts: {
    ka: { cdTitle: "საღამომდე დარჩა", dayTitle: "საღამოს პროგრამა", tapHint: "შეეხეთ ბეჭედს", rsvpTitle: "დასწრების დადასტურება", ask: "კითხვის დასმა", mapBtn: "რუკაზე ნახვა", dressTitle: "ჩაცმის კოდი", shareTitle: "გააზიარეთ საღამო", contactTitle: "კონტაქტი" },
    en: { cdTitle: "Counting down", dayTitle: "The evening", tapHint: "Touch the seal", rsvpTitle: "RSVP", ask: "Ask a question", mapBtn: "View on map", dressTitle: "Dress code", shareTitle: "Share the night", contactTitle: "Contact" }
  }
};
