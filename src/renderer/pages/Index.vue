<!--
 * @Author: 桔子桑
 * @Date: 2019-10-21 19:38:09
 * @FilePath: /Fund-analysis/src/renderer/pages/Index.vue
 * @Description: 文件描述
-->
<template>
  <div class="main">
      <Table stripe :columns="columns" style="height:36px;overflow:hidden" :data="[]"></Table>
      <GeminiScrollbar style="height:400px">
        <Table :show-header="false" stripe :columns="columns"  :data="fundList"></Table>
      </GeminiScrollbar>






  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import { saveAs } from 'file-saver'


export default {
  name: 'Main',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      menu:false,
      columns:[
        {
            type: 'index',
            width: 60,
            align: 'center'
        },
        {
            title: '基金公司',
            key: 'name',
            align:'center',
            render: (h, params) => {
               return h('div', {
                  style:{
                    color:'#2878ef',
                    cursor:'pointer',
                  },
                  on:{
                    click:()=>{
                      this.$router.push({
                        path:'FundOverview',
                        query:{
                          id:params.row.id
                        }
                      })
                    }
                  }
               }, params.row.name)
            }
        },
        {
            title: '成立时间',
            key: 'creatTime',
            align:'center'
        },
        {
            title: '基金评级',
            key: 'level',
            align:'center',

            render:(h,params)=>{
              var stars = [];
              for(var i = 0;i<params.row.level;i++){
                stars.push(
                  h('Icon', {
                      props:{
                        type:'md-star',
                        size:20,
                        color:'red'
                      }
                   }, ''),
                )
              }
              return stars;
            }
        },
        {
            title: '基金数量',
            key: 'fundCount',
            align:'center',
        },
        {
            title: '经理人数',
            key: 'managerCount',
            align:'center',


        }

      ],
      fundList:[]
    }
  },
  created(){
    
  },
  mounted(){
    this.ipcRenderer$on();
    this.getFundList();
  },
  beforeDestroy(){
    ipcRenderer.removeAllListeners();

  },
  methods:{
    /**
     * puppeteer 基金公司列表
     */
    getFundList(){
      ipcRenderer.send('getCompanyList','')
    },
    ipcRenderer$on(){
      ipcRenderer.on('getCompanyList',(sender,data)=>{
        var data = JSON.parse(data);
        this.fundList = data;


        var savedata = {
          filename:'company.json',
          data:data
        }
        ipcRenderer.send('savejson',JSON.stringify(savedata))
        
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.main{
  
}
</style>
