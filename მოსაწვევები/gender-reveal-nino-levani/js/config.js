/* =====================================================================
   ამბავი · ბიჭია თუ გოგო? · Baby Shower
   ახალი კლიენტისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   ===================================================================== */
window.CONFIG = {
  id: "reveal-nino-levani",
  title: { ka: "ბიჭია! 💙 · ნინო და ლევანის Baby Shower", en: "It's a boy! 💙 · Nino & Levani's Baby Shower" },
  host: { ka: "ნინო & ლევანი", en: "Nino & Levani" }, script: "Baby Shower", monogram: "?",
  date: "2027-03-14", city: { ka: "თბილისი", en: "Tbilisi" },
  heroPhoto: "images/hero.jpg",
  kicker: { ka: "დიდი სიახლე!", en: "Big news!" },
  headline: { ka: "ბიჭია! 💙", en: "It's a boy! 💙" },
  lead: { ka: "ჩვენს ოჯახს მალე პატარა ბიჭი შეემატება! 🍼 გვინდა, ეს სიხარული ერთად აღვნიშნოთ. გიწვევთ Baby Shower-ზე: ტკბილეულით, თამაშებითა და ბევრი სიყვარულით. 💙", en: "A little boy is joining our family soon! 🍼 We'd love to celebrate this joy together. Join us for a baby shower with sweets, games and lots of love. 💙" },
  place: { ka: "კაფე „ტკბილი ღრუბელი“", en: "Sweet Cloud café" }, placeAddr: { ka: "ვაჟა-ფშაველას გამზ. 20, თბილისი", en: "20 Vazha-Pshavela Ave, Tbilisi" }, placeTime: "16:00", placeMap: "Vazha-Pshavela Avenue 20, Tbilisi",
  events: [
    { time: "16:00", icon: "heart", title: { ka: "შეხვედრა და ტკბილეული", en: "Welcome & sweets" }, main: true },
    { time: "16:30", icon: "game", title: { ka: "თამაშები: გამოიცანი სახელი!", en: "Games: guess the name!" } },
    { time: "17:30", icon: "cake", title: { ka: "ცისფერი ტორტი", en: "The blue cake" } },
    { time: "18:00", icon: "gift", title: { ka: "საჩუქრები პატარასთვის", en: "Gifts for the little one" } }
  ],
  details: [
    { icon: "dress", label: { ka: "დრესკოდი", en: "Dress code" }, value: { ka: "ცისფერი ან თეთრი 💙", en: "Blue or white 💙" } },
    { icon: "gift", label: { ka: "საჩუქრის იდეა", en: "Gift idea" }, value: { ka: "საფენები ან ბავშვის ტანსაცმელი 0–6 თვის", en: "Diapers or baby clothes 0–6 months" } }
  ],
  calTitle: { ka: "ნინო და ლევანის Baby Shower", en: "Nino & Levani's Baby Shower" },
  rsvpTo: { ka: "ნინო და ლევანი", en: "Nino & Levani" }, rsvpEvent: { ka: "Baby Shower-ზე", en: "the baby shower" },
  shareText: { ka: "ბიჭია! 💙 ნინო და ლევანის Baby Shower", en: "It's a boy! 💙 Nino & Levani's Baby Shower" }, whatsapp: "",
  music: "lullaby", musicFallback: "lullaby", fx: ["balloons:0.25", "hearts:0.2"], fxGate: ["hearts:0.3"], openFx: "confetti:150", rsvpFx: "hearts", trail: false,
  envelope: {
    paper: ["#FFD6E4", "#F7B9CF"], flap: ["#CFE7FA", "#A9D3F3"], liner: ["#FFFFFF", "#F2F6FB"], pattern: "hearts",
    accent: "#FFFFFF", metal: false, back: "#F7B9CF", card: ["#FFFFFF", "#F4F9FE"], cardAccent: "#6FB6E8", ink: "#2F5F86", soft: "#7C93AE",
    cardHost: { ka: "ბიჭია! 💙", en: "It's a boy! 💙" }, cardScript: "Baby boy",
    cardTitle: { ka: "ნინო და ლევანის სიახლე", en: "NINO & LEVANI'S NEWS" }, cardLine: { ka: "Baby Shower · 16:00", en: "Baby Shower · 4 PM" },
    seal: "#F1C46E", sealSide: "#B98F3E", sealMetal: .8, sparks: "#9FD4FF",
    fontHead: '"Fredoka", "Noto Sans Georgian", sans-serif', fontScript: '"Pacifico", cursive', fontNum: '"Fredoka", sans-serif' },
  balloon: { a: "#FF9CBB", b: "#8EC9F2" },
  palette: ["#BFE0F7","#8EC9F2","#FFFFFF","#FFD6E4","#F1C46E"],
  faq: [["რა მოვიტანო საჩუქრად?","What gift should I bring?","საფენები, ტანსაცმელი 0–6 თვის ან უბრალოდ თბილი სიტყვები 💙","Diapers, clothes 0–6 months or simply warm words 💙"],["შეიძლება ბავშვებთან ერთად?","Can kids come?","დიახ! ბავშვებისთვის ცალკე თამაშები გვაქვს.","Yes! We have games for the kids."],["რა სახელი დაარქმევთ?","What's the name?","ეს საიდუმლოა... თამაშში გამოიცანით! 😉","It's a secret... guess it in the game! 😉"]],
  texts: {
    ka: { paletteTitle: "სამოსის ფერები", faqTitle: "ხშირი კითხვები", wishTitle: "სურვილების კონვერტი", wishSub: "შეეხეთ კონვერტს და დაგვიტოვეთ თბილი სიტყვები 💌", wishCard: "თქვენი სურვილი", wishName: "თქვენი სახელი", wishPh: "დაწერეთ სურვილი…", wishSend: "გაგზავნა", wishCopy: "კოპირება", cdTitle: "დიდ დღემდე დარჩა", dayTitle: "რა გველოდება", tapHint: "შეეხეთ, რომ გაიგოთ 💙💗", gotInvite: "ბიჭია თუ გოგო?", placeTitle: "სად?", mapBtn: "რუკაზე ნახვა", detailsTitle: "პატარა დეტალები", rsvpTitle: "მოხვალთ?" },
    en: { paletteTitle: "Colours to wear", faqTitle: "Questions", wishTitle: "The wishes envelope", wishSub: "Tap the envelope and leave us a few warm words 💌", wishCard: "Your wish", wishName: "Your name", wishPh: "Write your wish…", wishSend: "Send", wishCopy: "Copy", cdTitle: "Counting down", dayTitle: "What's planned", tapHint: "Tap to find out 💙💗", gotInvite: "Boy or girl?", placeTitle: "Where?", mapBtn: "View on map", detailsTitle: "Little details", rsvpTitle: "Are you coming?" } }
};
