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
        <Table :show-header="false" stripe :columns="columns"  :data="fundList"></Table>
      </GeminiScrollbar>

    <Button type="primary" style="position:absolute;left:20px;bottom:20px;" @click="exportJson">导出分析数据</Button>
      
 

    <span class="progress">{{progress}}</span>





  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import { saveAs } from 'file-saver'


export default {
  name: 'Analysis',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      menu:false,
      analysis:true,
      columns:[
        {
            type: 'index',
            width: 60,
            align: 'center'
        },
        {
            title: '基金ID',
            key: 'id',
            align:'center'
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
      progress:''
    }
  },
  created(){
    this.ipcRenderer$on();
    
  },
  mounted(){
  },
  beforeDestroy(){
    ipcRenderer.removeAllListeners();
  },
  methods:{
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

      

      
    },
    //导出charts的json数据
    exportJson(){
      var blob = new Blob([JSON.stringify(this.fundList)], { type: "" });
      saveAs(blob, "fundAnalysis.json");
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
      left:140px;
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
