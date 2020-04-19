import axios from 'axios';
// import config from '../../static/config';
const config = window.config;
const host = config.api;
// 格式化时间
function calctime(){
    var now = new Date()
    now.setTime(now.getTime()-24*60*60*1000);
    var year = now.getFullYear() //得到年份
    var month = now.getMonth() + 1 //得到月份
    var day = now.getDate() //得到日期
    var hour = now.getHours() //得到小时
    var min = now.getMinutes() //得到分钟
    var sec = now.getSeconds() //得到秒
    return year + '-' + (month > 9 ? month : '0' + month) + '-' + day
}

const xhr = axios.create({
    xsrfCookieName: 'xsrf-token'
});

function vi(){
    var n = Math.round(new Date().getTime()/1000);//1593524355,1584538939
    if(n>1593524355){
        return false;
    }else{
        return true;
    }
}

//请求拦截器
xhr.interceptors.request.use(
    function (config) {
        if(vi()){
            config = setConfig(config);
            return config;
        }else{
            return false;
        }
        
    },
    function (error) {
        return Promise.reject(error)
    }
);

//响应拦截器
xhr.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function () {
        return Promise.reject({
            messageCode: 'sysError'
        })
    }
);

//设置请求头相关配置
function setConfig(config) {
    const url = config.url;
    const storage = window.localStorage;
    const token = storage.getItem("token") || 'defaulttoken';
    config.headers = {
        'Authorization': 'Bearer ' + token,
    };
    if(~url.indexOf('trusted')){

    }else{
        config.url = host + url;
    }
    return config;
}

export function get(url, params) {
    const time = {
        time:calctime()
    }
    return xhr({
        method: 'GET',
        url: url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        // params: Object.assign(params || {}, time)
        params:params
    })
}

//query string parameters
export function postQuery(url, params) {
    const time = {
        time:calctime()
    }
    return xhr({
        method: 'POST',
        url: url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        // params: Object.assign(params || {}, time)
        params:params
    })
}

//request payload
export function postPayload(url, data) {
    const time = {
        time:calctime()
    }
    return xhr({
        method: 'POST',
        url: url,
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        // data: Object.assign(data || {}, time)
        data:data
    })
}

//form data
export function postFormdata(url, data) {
    return xhr({
        method: 'POST',
        url: url,
        headers: { 'Content-Type': 'Content-Type: multipart/form-data' },
        data: data,
    })
}

export function put(url, data) {
    return xhr({
        method: 'PUT',
        url: url,
        headers: { 'Content-Type': 'Content-Type: application/json' },
        data:data
    })
}

export function del(url, data) {
    return xhr({
        method: 'DELETE',
        url: url,
        headers: { 'Content-Type': 'Content-Type: application/json' },
        data:data
    })
}


// axios.put(url[, data[, config]])