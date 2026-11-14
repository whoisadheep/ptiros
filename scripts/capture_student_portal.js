const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

async function main() {
  const browser = await puppeteer.launch({
    executablePath: "/home/whoisadheep/.local/bin/google-chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--user-data-dir=/home/whoisadheep/Documents/Mentorship/.chrome_ud_portal"],
    defaultViewport: { width: 1366, height: 850 },
  });

  const page = await browser.newPage();
  const screenDir = "/home/whoisadheep/Documents/Mentorship/ptiros/screenshots";
  const artifactDir = "/home/whoisadheep/.gemini/antigravity-cli/brain/bf08c675-945c-4f94-ba00-1098a7aff675/screenshots";
  if (!fs.existsSync(screenDir)) fs.mkdirSync(screenDir, { recursive: true });
  if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

  const save = async (name) => {
    const p = path.join(screenDir, name);
    await page.screenshot({ path: p });
    fs.copyFileSync(p, path.join(artifactDir, name));
    console.log("Saved screenshot:", name);
  };

  // 1. Visit /login
  console.log("Visiting /login...");
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1000));
  await save("student_login_page.png");

  // 2. Click Aarav demo button
  console.log("Clicking Aarav demo button...");
  const aaravBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    return btns.find((b) => b.textContent && b.textContent.includes("Aarav Sharma"));
  });
  if (aaravBtn) {
    await aaravBtn.click();
    await page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {});
    await new Promise((r) => setTimeout(r, 2000));
  }
  await save("student_dashboard_aarav_overview.png");

  // 3. Click Planner tab
  console.log("Navigating to My Planner...");
  const plannerTab = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll("aside nav button, main button"));
    return btns.find((b) => b.textContent && b.textContent.includes("My Planner"));
  });
  if (plannerTab) {
    await plannerTab.click();
    await new Promise((r) => setTimeout(r, 1200));
    await save("student_dashboard_planner.png");
  }

  // 4. Click Diary tab
  console.log("Navigating to My Diary...");
  const diaryTab = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll("aside nav button"));
    return btns.find((b) => b.textContent && b.textContent.includes("My Diary"));
  });
  if (diaryTab) {
    await diaryTab.click();
    await new Promise((r) => setTimeout(r, 1200));
    await save("student_dashboard_diary.png");
  }

  // 5. Click Career Test Analysis tab
  console.log("Navigating to Career Test Analysis...");
  const analysisTab = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll("aside nav button"));
    return btns.find((b) => b.textContent && b.textContent.includes("Career Test Analysis"));
  });
  if (analysisTab) {
    await analysisTab.click();
    await new Promise((r) => setTimeout(r, 1200));
    await save("student_dashboard_analysis.png");
  }

  // 6. Switch to Meera (Corporate Law)
  console.log("Switching to Meera...");
  const meeraSwitch = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll("main button"));
    return btns.find((b) => b.textContent && b.textContent.includes("Meera (Law)"));
  });
  if (meeraSwitch) {
    await meeraSwitch.click();
    await new Promise((r) => setTimeout(r, 2500));
    await save("student_dashboard_meera.png");
  }

  await browser.close();
  console.log("All portal captures complete!");
}

main().catch(console.error);
