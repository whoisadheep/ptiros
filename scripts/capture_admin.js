const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

async function main() {
  const browser = await puppeteer.launch({
    executablePath: "/home/whoisadheep/.local/bin/google-chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--user-data-dir=/home/whoisadheep/Documents/Mentorship/.chrome_ud"],
    defaultViewport: { width: 1280, height: 900 },
  });

  const page = await browser.newPage();
  await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle0" });

  // Type PIN into password field
  const pinInput = await page.$("input[type=password]");
  if (pinInput) {
    await pinInput.type("ptiros-admin-secure-2026");
    const submitBtn = await page.$("button[type=submit]");
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {});
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  const outPath = "/home/whoisadheep/Documents/Mentorship/ptiros/screenshots/admin_dashboard.png";
  await page.screenshot({ path: outPath });
  console.log("Screenshot saved to", outPath);

  const artifactDir = "/home/whoisadheep/.gemini/antigravity-cli/brain/bf08c675-945c-4f94-ba00-1098a7aff675/screenshots";
  if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });
  fs.copyFileSync(outPath, path.join(artifactDir, "admin_dashboard.png"));

  await browser.close();
}

main().catch(console.error);
