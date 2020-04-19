/*********************
 *
 * @Author: 桔子桑
 * @Date: 2020-04-18 19:11:31
 * @FilePath: /Fund-analysis/src/main/searchFundList.js
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
  await page.goto('http://fund.eastmoney.com/company/default.html');

  var url = `http://fund.eastmoney.com/Company/f10/jjjz_${id}.html`;
  // console.log(JSON.stringify(url))

  await page.goto(url);
  let content= await page.$eval('.main-content',el => {
    /**
     * 公司信息
     */
    var basicinfo = el.querySelector('.common-basic-info');
    var li = basicinfo.querySelector('.fund-info').querySelectorAll('li');
    var company = {
      name:basicinfo.querySelector('.ttjj-panel-main-title').innerText,
      size:li[0].querySelector('.grey').innerText,
      num:li[1].querySelector('.grey').innerText,
      managerCount:li[2].querySelector('.grey').innerText,
      level:li[3].querySelectorAll('label').length,
      creatTime:li[4].querySelector('.grey').innerText,

    }
    /**
     * 公司基金信息
     */
    var body = el.querySelector('tbody');
    var trs = body.querySelectorAll('tr');
    var data = [];
    for(var i = 0,size=trs.length;i<size;i++){
        var tr = trs[i];
        var td = tr.querySelectorAll('td');
        var obj = {
            // pid:id,
            id:td[0].querySelectorAll('a')[1].innerText,
            name:td[0].querySelectorAll('a')[0].innerText,
        }
        data.push(obj)
    }
    return {
      company:company,
      fundList:data
    }
  });
  console.log(JSON.stringify(content))
  await page.waitFor(3000);
  await browser.close();

})();


