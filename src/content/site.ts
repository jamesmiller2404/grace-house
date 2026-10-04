// One source of truth for contact info and hours. Later this becomes a Payload global.
export const site = {
  name: "Grace House",
  tagline: "NOR CAL",
  phone: "(916) 470-0408",
  phoneHref: "tel:+19164700408",
  email: "gracehouse6121@gmail.com",
  hours: {
    label: "Mon–Fri, 9am–5pm",
    days: [1, 2, 3, 4, 5], // 0 = Sunday
    open: 9,
    close: 17,
    timeZone: "America/Los_Angeles",
  },
  nav: [
    { label: "About", href: "/about" },
    { label: "Program", href: "/program" },
    { label: "Stories", href: "/stories" },
    { label: "Events", href: "/events" },
    { label: "Support", href: "/support" },
  ],
  facts: [
    "Private pay: no Medi-Cal or insurance",
    "Not a detox center. If you are still using or in withdrawal, seek medical care first.",
    "Intakes on weekdays only",
  ],
  // Confirm these national numbers before launch.
  crisisLines: [
    { label: "Emergency or overdose", text: "Call 911", href: "tel:911" },
    { label: "Crisis or suicidal thoughts", text: "Call or text 988", href: "tel:988" },
    { label: "Find treatment, 24/7", text: "SAMHSA 1-800-662-4357", href: "tel:18006624357" },
  ],
};
