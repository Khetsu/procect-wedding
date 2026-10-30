/* =====================================================================
   ამბავი · ნათლობის მოსაწვევი · დიზაინი „ყვავილოვანი ბაღი“ (თეთრი ყვავილები, ფერფლისფერი ვარდისფერი, მწვანე)
   ახალი ოჯახისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   ფოტო (არასავალდებულო): images/baby.jpg — პატარას ფოტო, გამოჩნდება თაღოვან ჩარჩოში
   ===================================================================== */
window.CONFIG = {
  id: "nia-christening",
  title: { ka: "ნიას ნათლობა · მოსაწვევი", en: "Nia's Christening · Invitation" },
  host: { ka: "ნია", en: "Nia" },
  script: "Nia",
  monogram: "N",
  date: "2027-05-16",
  city: { ka: "თბილისი", en: "Tbilisi" },

  label: { ka: "ნიას ნათლობა", en: "Nia's Christening" },
  verse: { ka: "„ყოველი ბავშვი ღმერთის საჩუქარია“", en: "“Every child is a gift from God”" },
  lead: { ka: "დიდი სიხარულით გიწვევთ ჩვენი პატარა ნიას ნათლობაზე. გვინდა, ეს ნათელი დღე ჩვენთვის ძვირფას ადამიანებთან ერთად გავატაროთ.",
          en: "With great joy we invite you to our little Nia's christening. We would love to share this bright day with the people dear to us." },
  parents: { ka: "ლევანი და სოფო", en: "Levani & Sopo" },
  babyPhoto: "images/baby.jpg",

  place: { ka: "სამების საკათედრო ტაძარი", en: "Holy Trinity Cathedral" },
  placeAddr: { ka: "მესამე სამების ქ., თბილისი", en: "Samebis St, Tbilisi" },
  placeMap: "Holy Trinity Cathedral of Tbilisi",

  /* დღის განრიგი (main: true — უკუთვლა ამ დრომდე ითვლის) */
  events: [
    { time: "12:00", title: { ka: "ნათლობის საიდუმლო", en: "Holy Baptism" }, note: { ka: "სამების ტაძარი", en: "Holy Trinity Cathedral" }, main: true },
    { time: "13:30", title: { ka: "ოჯახური ფოტოსესია", en: "Family photos" }, note: { ka: "ტაძრის ეზო", en: "Cathedral garden" } },
    { time: "15:00", title: { ka: "სადღესასწაულო სუფრა", en: "Celebration lunch" }, note: { ka: "რესტორანი „თეთრი ბაღი“", en: "White Garden restaurant" } },
    { time: "18:00", title: { ka: "ტორტი და სურვილები", en: "Cake & wishes" }, note: { ka: "პატარასთვის", en: "for the little one" } }
  ],

  /* ნათლია და ნათლიდედა */
  details: [
    { icon: "cross", label: { ka: "ნათლია", en: "Godfather" }, value: { ka: "გიორგი", en: "Giorgi" } },
    { icon: "heart", label: { ka: "ნათლიდედა", en: "Godmother" }, value: { ka: "მარიამი", en: "Mariam" } }
  ],

  calTitle: { ka: "ნიას ნათლობა", en: "Nia's christening" },
  rsvpTo: { ka: "ლევანი და სოფო", en: "Levani & Sopo" },
  rsvpEvent: { ka: "ნიას ნათლობაზე", en: "Nia's christening" },
  shareText: { ka: "ნიას ნათლობის მოსაწვევი", en: "Nia's christening invitation" },
  whatsapp: "",

  music: "lullaby",
  musicFallback: "lullaby",
  fx: ["petals:0.25"],
  fxGate: [],
  openFx: "petals:40",
  rsvpFx: "hearts",
  trail: false,

  /* 3D კონვერტი: სპილოსძვლისფერი ქაღალდი, მწვანე სარჩული ყვავილებით, ვარდისფერი ბეჭედი */
  envelope: {
    paper: ["#FBF8EF", "#EEE7D6"], flap: ["#FDFAF2", "#F0E9D9"], liner: ["#DCE5D2", "#C6D3BA"], pattern: "flowers",
    accent: "#B8977E", metal: true, back: "#EFE7D6",
    card: ["#FFFDF7", "#F6EFE2"], cardAccent: "#B8977E", ink: "#4A4038", soft: "#8C7F72",
    cardTitle: { ka: "ნათლობის მოსაწვევი", en: "CHRISTENING INVITATION" }, cardLine: { ka: "12:00 · სამების ტაძარი", en: "12 PM · Holy Trinity Cathedral" },
    seal: "#E9CFC4", sealSide: "#C9A79A", sealMetal: 0, sparks: "#FFF2DC",
    fontHead: '"Playfair Display", "Noto Serif Georgian", serif', fontScript: '"Great Vibes", cursive', fontNum: '"Playfair Display", serif'
  },
  texts: {
    ka: { cdTitle: "ნათლობამდე დარჩა", dayTitle: "დღის განრიგი", tapHint: "შეეხეთ ბეჭედს", dateTitle: "თარიღი", placeTitle: "ადგილი", mapBtn: "რუკაზე ნახვა", rsvpTitle: "დასწრება", godTitle: "ნათლია და ნათლიდედა", withLove: "სიყვარულით" },
    en: { cdTitle: "Counting down", dayTitle: "Timeline", tapHint: "Touch the seal", dateTitle: "Date", placeTitle: "Location", mapBtn: "View on map", rsvpTitle: "RSVP", godTitle: "Godparents", withLove: "With love" }
  }
};
