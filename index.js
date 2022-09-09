const express = require('express');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();

const getSchedule = async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto('https://uais.cr.ktu.lt/ktuis/stud.busenos');
    const toLoginPage = await page.waitForSelector('input[type=submit]');
    await toLoginPage.click();

    const but1 = await page.waitForSelector('button[type=submit]');
    await but1.click()

    const userField = await page.waitForSelector('#username');
    await userField.type(process.env.USER);
    await page.screenshot({ path: 'user.png'});
    const passField = await page.waitForSelector('#password');
    await passField.type(process.env.PASS);
    await page.screenshot({ path: 'pass.png'});
    const loginField = await page.waitForSelector('input[type=submit]');
    await loginField.click();
    const yesButton = await page.waitForSelector('#yesbutton');
    await yesButton.click();
    await new Promise(r => setTimeout(r, 10000));
    await page.waitForSelector('#tvark_cont');
    const query = "Mano savait";
    await page.evaluate(query => {
      const elements = [...document.querySelectorAll('a')];
      const targetElement = elements.find(e => e.innerText.includes(query));

      targetElement && targetElement.click();
    }, query)
    // maybe use html parser to parse instead of sending an image
    const tabl = await page.waitForSelector('#kal_div_id');
    await tabl.screenshot({ path: 'schedule.png' });

    await browser.close();
    res.status(200).sendFile(__dirname + "/schedule.png")
  } catch (err) {
    console.log(err);
    await page.screenshot({ path: 'error.png' });
    res.status(500).json({ message: err.message });
  }
}

app.get("/", getSchedule);
app.listen(process.env.PORT || 4000);