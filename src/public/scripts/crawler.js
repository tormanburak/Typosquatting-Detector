const puppeteer = require('puppeteer');
const url = 'http://facebook.com';

async function run (url){
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      var k = 1;
      const response = await page.goto(url).catch(e => {k = 0;});
      const imgName = url.slice(7, url.length-4);
      var b64string = -1;
      var html = -1;
      if(k!=0){
        await page.waitFor(4000);
        b64string = await page.screenshot({ encoding: "base64" });
        html = await response.text();
      }
      await browser.close();
      const data = {
        url: url,
        image: b64string,
        html:html,
      };
    return JSON.stringify(data);
}
module.exports.run = run;
