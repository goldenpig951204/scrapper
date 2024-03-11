var express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer-extra");

/* GET home page. */
router.get("/", async (req, res, next) => {
  const email = "vishaal.melwani@adquadrant.com";
  const password = "Adquadrant123!";
  const windowsLikePathRegExp = /[a-z]:\\/i;
  let inProduction = false;

  if (!windowsLikePathRegExp.test(__dirname)) {
    inProduction = true;
  }
  let options = {};
  if (inProduction) {
    options = {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--media-cache-size=0",
        "--disk-cache-size=0",
        "--ignore-certificate-errors",
        "--ignore-certificate-errors-spki-list",
      ],
      timeout: 100000,
    };
  } else {
    options = {
      headless: false,
      timeout: 100000,
      args: [
        "--ignore-certificate-errors",
        "--ignore-certificate-errors-spki-list",
      ],
    };
  }
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
  });
  await page.setDefaultNavigationTimeout(100000);
  await page.goto("https://app.adquadrant.com/");
  await page.focus("input[name='u']").then(async () => {
    await page.keyboard.type(email, {delay: 100});
  })
  await page.focus("input[name='p']").then(async () => {
    await page.keyboard.type(password, {delay: 100});
  });
  await Promise.all([
    page.click("#submitButton"),
    page.waitForNavigation({ waitUntil: 'load', timeout: 100000 })
  ]).then(async (result) => {
    console.log(page.url());
    if (page.url() == "https://app.adquadrant.com/newaff.aspx") {
      browser.close();
    }
  })
});

module.exports = router;
