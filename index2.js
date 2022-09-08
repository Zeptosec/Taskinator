const puppeteer = require('puppeteer');
var HTMLParser = require('node-html-parser');
require('dotenv').config();

(async () => {
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
  // const cont = await page.content();
  // var root = HTMLParser.parse(cont);
  // var tabl = root.querySelector('#kal_div_id');
  // var thtabl = tabl.childNodes[3];
  // for(let i = 7; i < thtabl.childNodes.length; i+= 100){
  //   console.log(thtabl.childNodes[i]);
  // }
  //console.log(thtabl.toString());
  const tabl = await page.$('#kal_div_id');
  await tabl.screenshot({ path: 'example.png' });

  await browser.close();
})();