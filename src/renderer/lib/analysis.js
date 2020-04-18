/*********************
 *
 * @Author: 桔子桑
 * @Date: 2020-04-18 13:56:32
 * @FilePath: /Fund-analysis/src/lib/analysis.js
 * @Description: 文件描述
 *
*********************/

const puppeteer = require('puppeteer');

export default {
  index:url=>{
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      let content= await page.$eval('body', el => el.innerText);
      await browser.close();
      return content;
    })();
  }
}
 

