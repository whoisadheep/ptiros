import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "/home/whoisadheep/.local/bin/google-chrome";
const OUT_DIR = "/home/whoisadheep/Documents/Mentorship/ptiros/screenshots";

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1.5 },
  });

  const page = await browser.newPage();

  // 1. Career Test Page
  await page.goto("http://localhost:3000/career-test", { waitUntil: "networkidle0" });
  await page.screenshot({
    path: path.join(OUT_DIR, "page_career_test.png"),
    fullPage: true,
  });
  console.log("Captured page_career_test.png");

  // 2. Student Dashboard Page
  await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle0" });
  await page.screenshot({
    path: path.join(OUT_DIR, "page_dashboard.png"),
    fullPage: true,
  });
  console.log("Captured page_dashboard.png");

  await browser.close();
}

main().catch(console.error);
