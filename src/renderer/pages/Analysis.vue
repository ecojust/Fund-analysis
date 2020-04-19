<!--
 * @Author: 桔子桑
 * @Date: 2019-10-21 19:38:09
 * @FilePath: /Fund-analysis/src/renderer/pages/Analysis.vue
 * @Description: 文件描述
-->
<template>
  <div class="Analysis">
      <Table stripe :columns="columns" style="height:36px;overflow:hidden" :data="[]"></Table>
      <GeminiScrollbar style="height:400px">
        <Table :row-class-name="rowClassName" :show-header="false" stripe :columns="columns"  :data="fundList"></Table>
      </GeminiScrollbar>
      <div class="area" style="border:1px solid;width:100%;height:400px;" id="area" ref="area">

      </div>
      <div v-if="!loadjsoned">
        <Button type="primary" style="position:absolute;left:20px;bottom:20px;" @click="exportJson">导出分析数据</Button>
          <Slider v-model="analysisRate" style="width:100px;position:absolute;left:150px;bottom:20px;"></Slider>
          <Button type="primary" style="position:absolute;left:270px;bottom:20px;" @click="analysisStart">开始分析 {{analysisRate/100}}</Button>
          <span class="progress">{{progress}}</span>
      </div>
  </div>
</template>

<script>
import * as axios from '../lib/axios'
import {ipcRenderer} from 'electron'
import { saveAs } from 'file-saver'


export default {
  name: 'Analysis',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      menu:false,
      analysis:true,
      activeid:'',
      columns:[
        {
            type: 'index',
            width: 60,
            align: 'center'
        },
        {
            title: '基金ID',
            key: 'id',
            align:'center',
            render: (h, params) => {
               return h('div', {
                  style:{
                    color:'#2878ef',
                    cursor:'pointer',
                  },
                  on:{
                    click:()=>{
                      this.activeid = params.row.id;
                      ipcRenderer.send('getFundDetails',params.row.id)
                    }
                  }
               }, params.row.id)
            }
        },
        {
            title: '基金名称',
            key: 'name',
            align:'center'
        },
        {
            title: '历史收益最低',
            key: 'min',
            align:'center'
        },
        {
            title: '历史收益最高',
            key: 'max',
            align:'center'
        },
        {
            title: '当前收益',
            key: 'latest',
            align:'center'
        },
        {
            title: '上涨率',
            key: 'rate',
            align:'center'
        }

      ],
      fundList:[],
      progress:'',
      analysisRate:70,
      marks: {
          0: '0.0',
          30: '0.3',
          50: '0.5',
          70: '0.7',
          100: '1.0'
      },
      data:[],
      name:'',
      loadjsoned:false
    }
  },
  created(){
    this.ipcRenderer$on();
    this.loadjson();
    
  },
  mounted(){
  },
  beforeDestroy(){
    ipcRenderer.removeAllListeners();
  },
  methods:{
    rowClassName(row, index){
      if(row.id ==this.activeid){
        return 'table-active-row'
      }else{
        return ''
      }
    },
    loadjson(){
      axios.get('/static/fundAnalysis.json').then(res=>{
        console.log(res);
        this.loadjsoned = true;
        this.fundList = res;
      })
    },
    ipcRenderer$on(){
      ipcRenderer.on('Analysis',(sender,data)=>{
        this.fundList = this.fundList.concat(data);
      });
      ipcRenderer.on('AnalysisOver',(sender,data)=>{
        // this.exportJson();
        this.analysis = false;
      });
      ipcRenderer.on('progress',(sender,data)=>{
        // this.exportJson();
        this.progress = data;
      });
      ipcRenderer.on('getFundDetails',(sender,data)=>{
        var res = data.split('(').slice(1).join().split(')')[0];
        res = JSON.parse(res).Data[0];
        this.data = res.data;
        this.name = res.name;
        this.drawLine();
      });
      

    },
    getDetails(){
      this.data = [];
      ipcRenderer.send('getFundDetails',this.id)
    },
    //导出charts的json数据
    exportJson(){
      var blob = new Blob([JSON.stringify(this.fundList)], { type: "" });
      saveAs(blob, "fundAnalysis.json");
    },
    analysisStart(){
      var rate = this.analysisRate;
      ipcRenderer.send('analysisStart',rate/100)
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
                      color: 'rgb(55, 70, 131)'
                  },
                  areaStyle: {
                      color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgb(55, 158, 68)'
                      }, {
                          offset: 1,
                          color: 'rgb(55, 70, 131)'
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
.Analysis{
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
    .ivu-table-row-hover td{
      background-color: #ff6600 !important;
      color: #fff;
    }
    .table-active-row td{
      background-color: #ff6600;
      color: #fff;
    }
    .analysising{
      position:absolute;
      left:120px;
      bottom:20px;
      width:120px;
      height:40px;
      >div{
        background: transparent;
      }
    }
    .progress{
      position:absolute;
      left:400px;
      bottom:16px;
      width:120px;
      height:40px;
      line-height:40px;
      display:inline-block;
      color:white;
      font-weight:700;
      font-size:20px;
    }
}
</style>
