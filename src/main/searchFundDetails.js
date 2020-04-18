/*********************
 *
 * @Author: 桔子桑
 * @Date: 2020-04-18 21:08:09
 * @FilePath: /Fund-analysis/src/main/searchFundDetails.js
 * @Description: 文件描述
 *
*********************/
/*********************
 *
 * @Author: 桔子桑
 * @Date: 2020-04-18 19:11:31
 * @FilePath: /Fund-analysis/src/main/searchFundList.js
 * @Description: 文件描述
 *
*********************/
const puppeteer = require('puppeteer');
const id = process.argv[2];



(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // await page.goto('http://fund.eastmoney.com/company/default.html');

  var url = ` http://fund.eastmoney.com/${id}.html`;
  await page.setRequestInterception(true);
  page.on('request', request => {
      if(~request.url().indexOf('LJSYLZS')){
        // console.log('requeststart--' + request.url());
      }
      request.continue();
  });
  page.on('response', response => {

    if(~response.url().indexOf('LJSYLZS')){
      response.text().then(data => {
        console.log(data);
        browser.close();

      });

    }
  });
  page.on('requestfailed', request => {
    if(~request.url().indexOf('LJSYLZS')){
      // console.log('failed'+request.url());

    }
  });
  page.on('requestfinished', request => {
    if(~request.url().indexOf('LJSYLZS')){
      // console.log('success'+request.url());

    }

  });
  await page.goto(url);
  await page.$eval('body',el => {
    var lis = el.querySelector('#grandTotalCharsWrap_selectRange').querySelectorAll('li');
    var max = lis[lis.length-1];
    max.click();
  })
  // await page.waitFor(3000);


})();


