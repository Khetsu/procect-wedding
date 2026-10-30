/* ამბავი · ამ დიზაინის დამატებითი ტექსტები და სურვილების კონვერტი */
(function(){
  Object.assign(window.I18N.ka, {
    invite: "გიწვევთ",
    gateTitle: "გახსენით ფარდა და ნახეთ მოსაწვევი",
    gateHint: "შეეხეთ, ფარდა გაიხსნება და ჩაირთვება მუსიკა",
    dressTitle: "დრესკოდი", dressText: "კლასიკური, ელეგანტური",
    dressNote: "სასურველი ფერები: კრემისფერი, ბეჟი, მწვანე და შოკოლადისფერი",
    wishTitle: "სურვილების კონვერტი", wishSub: "აქ შეგიძლიათ თბილი სიტყვები დაგვიტოვოთ",
    wishLabel: "თქვენი სურვილი", wishPh: "დაწერეთ თქვენი სურვილი წყვილს…", wishSend: "სურვილის გაგზავნა"
  });
  Object.assign(window.I18N.en, {
    invite: "You are invited",
    gateTitle: "Open the curtain to see your invitation",
    gateHint: "Tap to open the curtain, music will start",
    dressTitle: "Dress code", dressText: "Classic and elegant",
    dressNote: "Preferred colours: cream, beige, green and chocolate",
    wishTitle: "Envelope of wishes", wishSub: "Leave us a few warm words",
    wishLabel: "Your wish", wishPh: "Write your wish to the couple…", wishSend: "Send my wish"
  });
  const link = () => {
    const b = document.getElementById("w-send"), t = document.getElementById("w-note");
    if (!b || !t) return;
    b.href = "https://wa.me/" + (window.CONFIG.whatsapp || "") + "?text=" + encodeURIComponent("💌 " + (t.value.trim() || "…"));
  };
  document.addEventListener("input", e => { if (e.target.id === "w-note") link(); });
  document.addEventListener("DOMContentLoaded", link); setTimeout(link, 0);
})();
