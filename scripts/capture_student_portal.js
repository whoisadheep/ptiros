const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

async function main() {
  const email = process.env.STUDENT_EMAIL;
  const password = process.env.STUDENT_PASSWORD;
  if (!email || !password) {
    throw new Error("Set STUDENT_EMAIL and STUDENT_PASSWORD env vars to capture authenticated portal screenshots.");
  }

  const browser = await puppeteer.launch({
    executablePath: "/home/whoisadheep/.local/bin/google-chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--user-data-dir=/tmp/.chrome_ud_portal_v2"],
    defaultViewport: { width: 1400, height: 900 },
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

  console.log("Visiting /login...");
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
  await save("student_login_page.png");

  await page.type("#login-email", email);
  await page.type("#login-password", password);
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
  ]);
  await new Promise((r) => setTimeout(r, 1500));
  await save("student_dashboard_cockpit.png");

  for (const [label, file] of [
    ["Study Goals", "student_dashboard_roadmap.png"],
    ["Daily Journal", "student_dashboard_diary.png"],
    ["Certificates", "student_dashboard_credentials.png"],
  ]) {
    const tabBtn = await page.evaluateHandle((text) => {
      return Array.from(document.querySelectorAll("nav button")).find(
        (b) => b.textContent && b.textContent.includes(text)
      );
    }, label);
    if (tabBtn) {
      await tabBtn.click();
      await new Promise((r) => setTimeout(r, 800));
      await save(file);
    }
  }

  await browser.close();
  console.log("All portal captures complete!");
}

main().catch(console.error);
