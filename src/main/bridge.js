/*********************
 *
 * @Author: 桔子桑
 * @Date: 2020-04-18 19:25:46
 * @FilePath: /Fund-analysis/src/main/bridge.js
 * @Description: 文件描述
 *
*********************/
/*********************
 *
 * @Author: 桔子桑
 * @Date: 2020-04-18 19:25:46
 * @FilePath: /Fund-analysis/src/main/briage.js
 * @Description: 文件描述
 *
*********************/
const  child_process = require('child_process');

console.log('parent execArgv: 000' + child_process.execArgv);



child_process.fork([require('path').join(__dirname, '/') + 'searchCompany.js']);
