<!--
 * @Author: 桔子桑
 * @Date: 2019-10-21 19:38:09
 * @FilePath: /Fund-analysis/src/renderer/pages/FundDetails.vue
 * @Description: 文件描述
-->
<template>
  <div class="FundDetails">
    {{name}}---{{id}}
    <div class="area" id="area" ref="area">

    </div>
    <div class="analysis">
      <div class="label">
        历史收益分析
      </div>
      <div class="line">
        <span class="key">历史收益最大值:</span>
        <span class="value">{{max}}</span>
      </div>
      <div class="line">
        <span class="key">历史收益最小值:</span>
        <span class="value">{{min}}</span>
      </div>
      <div class="line">
        <span class="key">最新收益率:</span>
        <span class="value">{{latest}}</span>
      </div>
      <div class="line">
        <span class="key">上涨潜力分析:</span>
        <span class="value">{{rate}}</span>
      </div>
    </div>

    <Select v-model="com" style="width:350px;position:absolute;right:400px;top:50px;">
        <Option v-for="item in company" :value="item.id" :key="item.name">{{item.id + ' | ' + item.name }}</Option>
    </Select>

    <Select @on-change="change" v-model="id" style="width:350px;position:absolute;right:20px;top:50px;">
        <Option v-show="com==item.pid&&!~ignore.indexOf(item.id)" v-for="item in options" :value="item.id" :key="item.name">{{item.id +' | '+item.name }}</Option>
    </Select>

    <Button type="primary" style="position:absolute;right:20px;top:100px;" @click="saveignore(true)">加入黑名单</Button>
    <Button type="primary" style="position:absolute;right:20px;top:140px;" @click="saveignore(false)">移出黑名单</Button>


    

  </div>
</template>

<script>
import {ipcRenderer} from 'electron'

export default {
  name: 'FundDetails',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      menu:false,
      id:0,
      data:{},
      name:'',
      max:0,
      min:0,
      latest:0,
      rate:0,
      options:[],
      model1:0,
      company:[],
      com:'',
      ignore:[]
    }
  },
  created(){
    


  },
  mounted(){
    this.ipcRenderer$on();
    var id = this.$route.query.id;
    this.id = id;
    ipcRenderer.send('getFundDetails',id);
    ipcRenderer.send('getOptions');
    ipcRenderer.send('getignorelist');
  },
  beforeDestroy(){
    ipcRenderer.removeAllListeners();
  },
  methods:{
    change(){
      this.data = [];
      ipcRenderer.send('getFundDetails',this.id)
    },
    saveignore(bool){
      if(bool){
        this.ignore.push(this.id);
      }else{
        Array.prototype.remove = function(val) { 
          var index = this.indexOf(val); 
          if (index > -1) { 
            this.splice(index, 1); 
          } 
        };
        this.ignore.remove(this.id);
      }
      function distinct(arr) {
          let result = []
          let obj = {}
          for (let i of arr) {
              if (!obj[i]) {
                  result.push(i)
                  obj[i] = 1
              }
          }
          return result
      }
      this.ignore = distinct(this.ignore);
      ipcRenderer.send('saveignore',JSON.stringify(this.ignore));
      this.$Message.info(`${this.id} | ${this.name} 已加入黑名单!`)
    },
    ipcRenderer$on(){
      ipcRenderer.on('getFundDetails',(sender,data)=>{
        // var data = JSON.parse(data);
        var res = data.split('(').slice(1).join().split(')')[0];
        res = JSON.parse(res).Data[0];
        this.data = res.data;
        this.name = res.name;
        this.drawLine();
      });

      ipcRenderer.on('readFundList',(sender,data)=>{
        var data = JSON.parse(data);
        // console.log('---------基金列表--------')
        var options = [];
        for(var key in data){
          var arr = data[key];
          arr.map(item=>{
            options.push(item)
          })
        }
        // console.log(options)

        this.options = options;
      });

      ipcRenderer.on('readCompanyList',(sender,data)=>{
        var data = JSON.parse(data);
        // console.log('---------公司列表--------')
        // console.log(data)

        this.company = data;
      });

      ipcRenderer.on('getignore',(sender,data)=>{
        var data = JSON.parse(data);
        console.log('---------getignore--------')
        console.log(data);
        this.ignore = data;
      });

      
    },
    drawLine(){
      // var dom = this.$refs.area;
      var dom = document.getElementById('area');
      var chart = this.$echarts.init(dom);
      var size = this.data.length;
      var date = [],data = [];
      for(var i = 0;i<size;i++){
        var now = new Date(this.data[i][0]);
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        data.push(this.data[i][1]);
      }
      var min = Math.min(...data),max = Math.max(...data),latest = data[size-1];
      this.min = min;
      this.max = max;
      this.latest = latest;
      this.rate =1 -  (latest-min)/(max-min);


      var option = {
          tooltip: {
              trigger: 'axis',
              position: function (pt) {
                  return [pt[0], '10%'];
              }
          },
          title: {
              left: 'center',
              text: '收益率走势',
          },
          toolbox: {
              feature: {
                  dataZoom: {
                      yAxisIndex: 'none'
                  },
                  restore: {},
                  saveAsImage: {}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: date
          },
          yAxis: {
              type: 'value',
              boundaryGap: [0, '100%']
          },
          dataZoom: [{
              type: 'inside',
              start: 0,
              end: 100
          }, {
              start: 0,
              end: 10,
              handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              handleStyle: {
                  color: '#fff',
                  shadowBlur: 3,
                  shadowColor: 'rgba(0, 0, 0, 0.6)',
                  shadowOffsetX: 2,
                  shadowOffsetY: 2
              }
          }],
          series: [
              {
                  name: '模拟数据',
                  type: 'line',
                  smooth: true,
                  symbol: 'none',
                  sampling: 'average',
                  itemStyle: {
                      color: 'rgb(255, 70, 131)'
                  },
                  areaStyle: {
                      color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgb(255, 158, 68)'
                      }, {
                          offset: 1,
                          color: 'rgb(255, 70, 131)'
                      }])
                  },
                  data: data
              }
          ]
      };

      chart.setOption(option,true);
      chart.resize();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.FundDetails{
  .area{
    width:100%;
    height:400px;
  }
  .analysis{
    text-align:left;
    .line{
      .key{
        display:inline-block;
        width:250px;
        padding:0 20px;
        text-align:right;
        font-weight:700;
        color:white;
      }
    }
  }
}
</style>
