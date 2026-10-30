/* =====================================================================
   ამბავი · დაბადების დღის მოსაწვევი · დიზაინი „ფერადი წვეულება“ (ბუშტები, კონფეტი, დახეული ქაღალდი)
   ახალი იუბილარისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   ფოტოები: images/hero.jpg (მთავარი; ახლა დგას 3D ბუშტები „25“-ით), images/me.jpg (იუბილარის ფოტო; ახლა დგას 3D ტორტი)
   ===================================================================== */
window.CONFIG = {
  id: "ana-25",
  title: { ka: "ანას 25 წლის იუბილე 🎉", en: "Ana's 25th Birthday 🎉" },
  host: { ka: "ანა", en: "Ana" },
  script: "Ana",
  monogram: "25",
  age: "25",
  date: "2026-12-05",
  city: { ka: "თბილისი", en: "Tbilisi" },

  heroPhoto: "images/hero.jpg",
  mePhoto: "images/me.jpg",
  heroLine: "Let's party!",
  dear: { ka: "ძვირფასო მეგობრებო!", en: "Dear friends!" },
  lead: { ka: "25 წლის ვხდები და ამ დღეს მხოლოდ თქვენთან ერთად წარმომიდგენია! მოდით, ერთად ვიცეკვოთ, ვიცინოთ და დაუვიწყარი ღამე გავატაროთ. 🥳",
          en: "I'm turning 25 and I can't imagine this day without you! Let's dance, laugh and make it a night to remember. 🥳" },

  place: { ka: "რუფთოპ ბარი „ლაღი“", en: "Lagi Rooftop Bar" },
  placeAddr: { ka: "ვაკე, ჭავჭავაძის გამზ. 50, მე-9 სართული", en: "Vake, 50 Chavchavadze Ave, 9th floor" },
  placeMap: "Chavchavadze Avenue 50, Tbilisi",

  /* წვეულების განრიგი (main: true — უკუთვლა ამ დრომდე ითვლის) */
  events: [
    { time: "20:00", title: { ka: "შეკრება", en: "Arrival" }, note: { ka: "მისასალმებელი კოქტეილები", en: "welcome cocktails" }, main: true },
    { time: "20:30", title: { ka: "ვახშამი", en: "Dinner" }, note: { ka: "გემრიელი და მხიარული", en: "tasty and fun" } },
    { time: "22:00", title: { ka: "ტორტი და სურვილი", en: "Cake & a wish" }, note: { ka: "25 სანთელი 🎂", en: "25 candles 🎂" } },
    { time: "22:30", title: { ka: "DJ და ცეკვა", en: "DJ & dancing" }, note: { ka: "დილამდე!", en: "till morning!" } },
    { time: "00:00", title: { ka: "სიურპრიზი", en: "Surprise" }, note: { ka: "არ გამოტოვოთ 😉", en: "don't miss it 😉" } }
  ],

  dressCode: { ka: "ფერადად და მხიარულად!", en: "Colourful & fun!" },
  dressNote: { ka: "ჩაიცვით ის, რაშიც ყველაზე ბედნიერად გრძნობთ თავს. ბრჭყვიალა დეტალები მისასალმებელია ✨", en: "Wear whatever makes you happiest. Sparkly details are welcome ✨" },
  palette: ["#FF5C8A", "#FFC83D", "#3FC1E8", "#8A6CFF", "#5FD38D"],
  wishes: { ka: "ყველაზე დიდი საჩუქარი თქვენი მობრძანებაა! თუ მაინც გინდათ რამით გამახაროთ, ვოცნებობ მოგზაურობაზე, ასე რომ, კონვერტი ზუსტად მომერგება ✈️", en: "Your presence is the best gift! If you still want to surprise me, I'm dreaming of a trip, so an envelope would be perfect ✈️" },
  wishLine: "Make a wish!",
  questions: { ka: "კითხვები გაქვთ? მომწერეთ ნებისმიერ დროს!", en: "Questions? Message me any time!" },
  thanks: { ka: "გელოდებით! 💛", en: "See you there! 💛" },

  calTitle: { ka: "ანას 25 წლის იუბილე", en: "Ana's 25th birthday" },
  rsvpTo: { ka: "ანა", en: "Ana" },
  rsvpEvent: { ka: "შენს დაბადების დღეზე", en: "your birthday party" },
  shareText: { ka: "ანას 25 წლის იუბილეს მოსაწვევი 🎉", en: "Ana's 25th birthday invitation 🎉" },
  whatsapp: "",

  music: "party",
  musicFallback: "party",
  fx: ["confetti:0.35"],
  fxGate: ["confetti:0.25"],
  openFx: "confetti:140",
  rsvpFx: "confetti",
  trail: false,

  /* 3D კონვერტი: ვარდისფერი ქაღალდი, ყვითელი სარჩული კონფეტით, ცისფერი ბეჭედი */
  envelope: {
    paper: ["#FF94B5", "#F7709A"], flap: ["#FFA3C0", "#F57EA4"], liner: ["#FFE68F", "#FFD24A"], pattern: "confetti",
    accent: "#FFFFFF", metal: false, back: "#F57EA4",
    card: ["#FFFDF7", "#FFF2DF"], cardAccent: "#FF5C8A", ink: "#3A2A3F", soft: "#8A6F8F",
    cardTitle: { ka: "დაბადების დღის წვეულება", en: "BIRTHDAY PARTY" }, cardLine: { ka: "20:00 · რუფთოპ „ლაღი“", en: "8 PM · Lagi Rooftop" },
    seal: "#3FC1E8", sealSide: "#2496B8", sealMetal: 0, sparks: "#FFD54A",
    fontHead: '"Fredoka", "Noto Sans Georgian", sans-serif', fontScript: '"Pacifico", cursive', fontNum: '"Fredoka", sans-serif'
  },
  texts: {
    ka: { cdTitle: "წვეულებამდე დარჩა", dayTitle: "წვეულების გეგმა", tapHint: "შეეხეთ ბეჭედს", rsvpTitle: "მოხვალ?", ask: "კითხვის დასმა", mapBtn: "რუკაზე ნახვა", placeTitle: "სად?", dressTitle: "დრესკოდი", wishTitle: "სურვილები", toDay: "დიდ წვეულებამდე" },
    en: { cdTitle: "Party starts in", dayTitle: "The plan", tapHint: "Touch the seal", rsvpTitle: "Are you coming?", ask: "Ask a question", mapBtn: "View on map", placeTitle: "Where?", dressTitle: "Dress code", wishTitle: "Wishes", toDay: "until the big party" }
  }
};
