const express = require('express');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();

const getSchedule = async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://uais.cr.ktu.lt/ktuis/stud.busenos');
    await page.click("input[type=submit]");
    await new Promise(r => setTimeout(r, 1000));
    await page.click("button[type=submit]")
    await new Promise(r => setTimeout(r, 1000));
    await page.type('#username', process.env.USER);
    await page.type('#password', process.env.PASS);
    await page.click('input[type=submit]');
    await new Promise(r => setTimeout(r, 1000));
    await page.click('#yesbutton');
    await new Promise(r => setTimeout(r, 5000));
    const query = "Mano savait";
    await page.evaluate(query => {
      const elements = [...document.querySelectorAll('a')];
      const targetElement = elements.find(e => e.innerText.includes(query));

      targetElement && targetElement.click();
    }, query)
    await new Promise(r => setTimeout(r, 2000));
    // maybe use html parser to parse instead of sending an image
    const tabl = await page.$('#kal_div_id');
    await tabl.screenshot({ path: 'schedule.png' });

    await browser.close();
    res.status(200).sendFile(__dirname + "/schedule.png")
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

app.get("/", getSchedule);
app.listen(process.env.PORT || 4000);