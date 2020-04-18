/*********************
 *
 * @Author: 桔子桑
 * @Date: 2020-04-18 15:45:13
 * @FilePath: /Fund-analysis/src/main/searchCompany.js
 * @Description: 文件描述
 *
*********************/
/*********************
 *
 * @Author: 桔子桑
 * @Date: 2020-04-18 15:45:13
 * @FilePath: /Fund-analysis/src/main/search.js
 * @Description: 文件描述
 *
*********************/
/*********************
 *
 * @Author: 桔子桑
 * @Date: 2020-04-18 15:45:13
 * @FilePath: /Fund-analysis/src/main/search.js
 * @Description: 文件描述
 *
*********************/
const puppeteer = require('puppeteer');


(async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('http://fund.eastmoney.com/company/default.html');
      let content= await page.$eval('#gspmTbl',el => {
        var body = el.querySelector('tbody');
        var trs = body.querySelectorAll('tr');
        var data = [];
        for(var i = 0,size=trs.length;i<size;i++){
            var tr = trs[i];
            var a = tr.querySelector('a');
            var reg = /[1-9][0-9]*/g;
            var pj = tr.querySelector('.td-pj').querySelectorAll('.sprite-star3').length;
            var td = tr.querySelectorAll('td');
            var obj = {
                id:a.href.match(reg).join(),
                name:a.innerText,
                creatTime:td[3].innerText,
                level:5-pj,
                fundCount:~~td[6].innerText,
                managerCount:~~td[7].innerText
            }
            data.push(obj)
        }
        data.sort((a,b)=>b.level - a.level);
        return data
      });
      console.log(JSON.stringify(content))
      await page.waitFor(3000);
      await browser.close();

    })();
