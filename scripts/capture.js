import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/home/whoisadheep/.local/bin/google-chrome";
const OUT_DIR = "/home/whoisadheep/Documents/Mentorship/ptiros/screenshots";

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1.5 },
  });

  const page = await browser.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  // 1. Hero
  await page.screenshot({ path: path.join(OUT_DIR, "01_hero.png") });
  console.log("Captured 01_hero.png");

  // Smooth scroll through page to trigger all in-view animations
  await page.evaluate(async () => {
    const totalHeight = document.body.scrollHeight;
    const distance = 400;
    let scrolled = 0;
    while (scrolled < totalHeight) {
      window.scrollBy(0, distance);
      scrolled += distance;
      await new Promise((r) => setTimeout(r, 80));
    }
  });

  // Wait for all animations to settle
  await new Promise((r) => setTimeout(r, 1200));

  // Capture Full Page
  await page.screenshot({
    path: path.join(OUT_DIR, "00_full_page.png"),
    fullPage: true,
  });
  console.log("Captured 00_full_page.png");

  // Capture specific sections
  const sections = [
    { selector: "#home", name: "01_hero_section.png" },
    { selector: "#career-test", name: "02_career_test.png" },
    { selector: "#about", name: "03_about.png" },
    { selector: "#science", name: "04_science.png" },
    { selector: "#why-ptiros", name: "05_why_ptiros.png" },
    { selector: "#roadmaps", name: "06_roadmaps.png" },
    { selector: "#contact", name: "07_contact.png" },
  ];

  for (const s of sections) {
    try {
      const el = await page.$(s.selector);
      if (el) {
        await el.screenshot({ path: path.join(OUT_DIR, s.name) });
        console.log(`Captured ${s.name}`);
      }
    } catch (e) {
      console.error(`Failed ${s.name}:`, e.message);
    }
  }

  await browser.close();
}

main().catch(console.error);
