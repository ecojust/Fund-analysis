import { app, BrowserWindow,Menu,ipcMain} from 'electron'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

  const scale = 0.8;
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 768 * scale,
    width: 1920 * scale,
    useContentSize: true,
    resizable: false ,
    maximizable: false,
    darkTheme:true,
    type:'textured',
    backgroundColor:'#34hg23',
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(winURL);
  //mainWindow.setFullScreen(true);
  // Menu.setApplicationMenu(null)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})



// ipcMain.on('win-close',()=>{
//   console.log('-----win close------')

//   // mainWindow.close();
// })
// ipcMain.on('win-min',()=>{
//   console.log('-----win min------')
//   mainWindow.webContents.send('moveScreen',{})

//   // mainWindow.minimize();
// })
// var browser = await puppeteer.launch({
//         executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
//          defaultViewport: {
//                 width: 1349,
//                 height: 600
//            }
//       })
const  {execFile,exec} = require('child_process');



/**
 * 爬取基金公司列表
 */
ipcMain.on('getCompanyList',()=>{
  console.log('--------puppeteer request companylist-------')
  execFile('node', [require('path').join(__dirname, '/') + 'searchCompany.js'],{a:1} ,(error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    mainWindow.webContents.send('getCompanyList',stdout);
  });
})

/**
 * 爬取公司所有基金
 */
ipcMain.on('getFundList',(event, arg)=>{
  console.log('--------puppeteer request fundlist-------');
  var script = require('path').join(__dirname, '/') + 'searchFundList.js';
  exec(`
    node ${script} ${arg}
  `, (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    // console.log('over',stdout)
    mainWindow.webContents.send('getFundList',stdout);
  });
})

/**
 * 单个基金走势
 */
ipcMain.on('getFundDetails',(event, arg)=>{
  console.log('--------puppeteer request fundDetails-------');
  var script = require('path').join(__dirname, '/') + 'searchFundDetails.js';
  exec(`
    node ${script} ${arg}
  `, (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    mainWindow.webContents.send('getFundDetails',stdout);
    setTimeout(()=>{
      readFundList();
    },3000)
  });
})


/**
 * 获取options
 */
ipcMain.on('getOptions',(event, arg)=>{
  readFundList();
  readCompanyList();
})


/**
 * save json
 */
var fs = require('fs'); // 载入fs模块

ipcMain.on('savejson',(event, arg)=>{
  var data = JSON.parse(arg);
  fs.writeFile( require('path').join(__dirname, '/json/') +data.filename,JSON.stringify(data.data),function(err){

  })
})


ipcMain.on('saveignore',(event, arg)=>{
  fs.writeFile( require('path').join(__dirname, '/json/ignore.json') ,arg,function(err){
    // getIgnore();
  })
})

ipcMain.on('getignorelist',(event, arg)=>{
  getIgnore();
})

function getIgnore(){
  console.log('--------get ignore-------');

  fs.readFile(require('path').join(__dirname, '/json/ignore.json') , function(err, data) {
    // 读取文件失败/错误
    var source = []
    if (err) {
      source = source.toString();
    }else{
      source = data.toString();
    }
    mainWindow.webContents.send('getignore',source);
  });
}

/**
 * savefundlist
 */
ipcMain.on('savefundlist',(event, arg)=>{
  var datasource = JSON.parse(arg);
  var filename = datasource.filename.split('.')[0];
  var url = require('path').join(__dirname, '/json/fundlist.json');
  fs.readFile(url, function(err, data) {
      // 读取文件失败/错误
      if (err) {
        var bin = {};
        bin[filename] = datasource.data;
        fs.writeFile(url ,JSON.stringify(bin),function(err){

        })
      }else{
        var source = JSON.parse(data.toString());
        source[filename] = datasource.data;
        fs.writeFile(url ,JSON.stringify(source),function(err){

        })
      }
  });
})


function readFundList(){
  var url = require('path').join(__dirname, '/json/fundlist.json');
  fs.readFile(url, function(err, data) {
      var source = JSON.parse(data.toString());
      mainWindow.webContents.send('readFundList',data.toString());
  });
}

function readCompanyList(){
  var url = require('path').join(__dirname, '/json/company.json');
  fs.readFile(url, function(err, data) {
      var source = JSON.parse(data.toString());
      mainWindow.webContents.send('readCompanyList',data.toString());
  });
}




function autoAnalysis(){
    var fundlisturl = require('path').join(__dirname, '/json/fundlist.json');
    fs.readFile(fundlisturl, function(err, data) {
          var fundlist = JSON.parse(data.toString());
          var arr = [];
          for(var key in fundlist){
            arr = arr.concat(fundlist[key])
          }
          var index = 0,size = arr.length;
          function todo(){
            var fund = arr.shift();
            if(fund){
              index++;
              console.log(fund)
              var fundId = fund.id;
              console.log('--------puppeteer request fundDetails-------');
              var script = require('path').join(__dirname, '/') + 'searchFundDetails.js';
              exec(`
                node ${script} ${fundId}
              `, (error, stdout, stderr) => {
                if (error) {
                  throw error;
                }
                formatdata(stdout,fund);
                mainWindow.webContents.send('progress',`${index} / ${size}`)
                todo();
              });
            }else{
              mainWindow.webContents.send('AnalysisOver')
            }
          }
          todo();
    });
}

function formatdata(jsonp,fund){
  try{
    var res = jsonp.split('(').slice(1).join().split(')')[0];
    res = JSON.parse(res).Data[0].data;
    var size = res.length;
    var data = [];
    for(var i = 0;i<size;i++){
      data.push(res[i][1]);
    }
    var min = Math.min(...data),max = Math.max(...data),latest = data[size-1];
    var rate =1 -  (latest-min)/(max-min);
    if(rate > 0.8){
      mainWindow.webContents.send('Analysis',Object.assign(fund,{
        max:max,
        min:min,
        latest:latest,
        rate:rate
      }));
    }
  }catch(e){

  }
}
autoAnalysis();














/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */










