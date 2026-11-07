import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "/home/whoisadheep/.local/bin/google-chrome";
const OUT_DIR = "/home/whoisadheep/Documents/Mentorship/ptiros/screenshots/mobile";

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    defaultViewport: {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
  });

  const page = await browser.newPage();

  // Landing page mobile
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUT_DIR, "m_01_hero.png") });

  // Scroll through to trigger all animations
  await page.evaluate(async () => {
    const totalHeight = document.body.scrollHeight;
    const distance = 300;
    let scrolled = 0;
    while (scrolled < totalHeight) {
      window.scrollBy(0, distance);
      scrolled += distance;
      await new Promise((r) => setTimeout(r, 60));
    }
  });

  await new Promise((r) => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(OUT_DIR, "m_full_page.png"),
    fullPage: true,
  });
  console.log("Captured m_full_page.png");

  // Career Test mobile
  await page.goto("http://localhost:3000/career-test", { waitUntil: "networkidle0" });
  await page.screenshot({
    path: path.join(OUT_DIR, "m_career_test.png"),
    fullPage: true,
  });
  console.log("Captured m_career_test.png");

  // Dashboard mobile
  await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle0" });
  await page.screenshot({
    path: path.join(OUT_DIR, "m_dashboard.png"),
    fullPage: true,
  });
  console.log("Captured m_dashboard.png");

  await browser.close();
}

main().catch(console.error);
