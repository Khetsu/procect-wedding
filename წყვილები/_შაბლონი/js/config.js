/* =====================================================================
   ამბავი · ციფრული მოსაწვევები
   წყვილის მონაცემები. ახალი წყვილისთვის მხოლოდ ეს ფაილი შეცვალე.
   ფრჩხილებში [ ... ] ჩაწერილი ველები ჯერ შესავსებია და საიტზე
   რუკის ღილაკი მათთვის არ გამოჩნდება.
   ===================================================================== */
window.CONFIG = {
  groom: "[სასიძო]",
  bride: "[პატარძალი]",
  groomEn: "Groom",
  brideEn: "Bride",
  monogram: "A&B",                  // ცვილის ბეჭედზე
  date: "2026-12-31",               // წელი-თვე-დღე (კვირის დღე ავტომატურად დაითვლება)
  city: "[ქალაქი]",
  cityEn: "",                       // ინგლისური ვერსიისთვის, მაგ. "Tbilisi"

  lead:   "გვიხარია, რომ ამ დღეს ჩვენთან ერთად იქნებით. ქვემოთ ნახავთ, სად და როდის შევხვდებით.",
  leadEn: "We are so happy you will share this day with us. Below you will find where and when we meet.",
  toast:   "გელოდებით სიყვარულით და დიდი სიხარულით",
  toastEn: "We will be waiting for you with love and joy",

  /* დღის განრიგი, დროის მიხედვით.
     icon:  hotel | camera | rings | church | glasses | cake | dance
     scene: hotel | photo | church | restaurant   (ილუსტრაცია, როცა photo ცარიელია)
     photo: ადგილის რეალური ფოტო, მაგ. "images/church.jpg"
     map:   ცარიელი = რუკის ღილაკი ადგილის სახელით მოძებნის; შეიძლება Google Maps-ის ბმულიც
     main:  true = უკუთვლა ამ ღონისძიებამდე ითვლის (ჩვეულებრივ ჯვრისწერა) */
  events: [
    { time: "10:00", title: "შეკრება სასტუმროში", titleEn: "Gathering at the hotel", place: "[სასტუმროს სახელი]",  icon: "hotel",   scene: "hotel",      photo: "", map: "", tag: "first" },
    { time: "12:00", title: "ფოტოსესია",          titleEn: "Photo session",          place: "[ფოტოსესიის ადგილი]", icon: "camera",  scene: "photo",      photo: "", map: "", tag: "then" },
    { time: "14:00", title: "ჯვრისწერა",          titleEn: "Wedding ceremony",       place: "[ტაძრის სახელი]",     icon: "rings",   scene: "church",     photo: "", map: "", tag: "and then", main: true },
    { time: "18:00", title: "საქორწილო სუფრა",    titleEn: "Wedding feast",          place: "[რესტორნის სახელი]",  icon: "glasses", scene: "restaurant", photo: "", map: "", tag: "and celebrate" }
  ],

  // წყვილის ფოტოები, მაგ. ["images/1.jpg", "images/2.jpg"]. ცარიელი = ბლოკი დამალულია.
  photos: [],

  // წყვილის WhatsApp ნომერი, მაგ. "995599123456". ცარიელი = სტუმარი თვითონ აირჩევს კონტაქტს.
  whatsapp: ""
};
