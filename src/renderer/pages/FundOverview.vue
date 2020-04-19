<!--
 * @Author: 桔子桑
 * @Date: 2019-10-21 19:38:09
 * @FilePath: /Fund-analysis/src/renderer/pages/FundOverview.vue
 * @Description: 文件描述
-->
<template>
  <div class="FundOverview">
    <div class="left">
      <div class="line">
        <span class="key">公司名称:</span>
        <span class="value">{{company.name}}</span>
      </div>
      <div class="line">
        <span class="key">管理规模:</span>
        <span class="value">{{company.size}}</span>
      </div>
      <div class="line">
        <span class="key">基金数量:</span>
        <span class="value">{{company.num}}</span>
      </div>
      <div class="line">
        <span class="key">基金经理人数:</span>
        <span class="value">{{company.managerCount}}</span>
      </div>
      <div class="line">
        <span class="key">级别:</span>
        <span class="value">
          <Icon v-for="item in company.level" :key="item" type="md-star" size="20" color="red" />
        </span>
      </div>
      <div class="line">
        <span class="key">创建时间:</span>
        <span class="value">{{company.creatTime}}</span>
      </div>
    </div>
    <div class="right">
      <Table stripe :columns="columns" style="height:36px;overflow:hidden" :data="[]"></Table>
      <GeminiScrollbar style="height:400px">
        <Table :show-header="false" stripe :columns="columns"  :data="fundList"></Table>
      </GeminiScrollbar>
    </div>
    

  </div>
</template>

<script>
import {ipcRenderer} from 'electron'


export default {
  name: 'FundOverview',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      menu:false,
      id:0,
      company:'',
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
                        path:'FundDetails',
                        query:{
                          id:params.row.id
                        }
                      })
                    }
                  }
               }, params.row.name)
            }
        },
      ],
      fundList:[]
    }
  },
  created(){
    


  },
  mounted(){
    this.ipcRenderer$on();
    var id = this.$route.query.id;
    ipcRenderer.send('getFundList',id)
  },
  beforeDestroy(){
    ipcRenderer.removeAllListeners();

  },
  methods:{
    ipcRenderer$on(){
      ipcRenderer.on('getFundList',(sender,data)=>{
        var data = JSON.parse(data);
        console.log(data)
        this.fundList = data.fundList;
        this.company = data.company;

        var id = this.$route.query.id;
        var savedata = {
          filename:id+'|'+data.company.name+'.json',
          data:data.fundList
        }
        savedata.data.map(item=>{
          item.pid = id
        })
        ipcRenderer.send('savefundlist',JSON.stringify(savedata))
        

        
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.FundOverview{
  >div{
    display:inline-block;
    position:absolute;
  }
  .left{
    width:340px;
    left:0;
    .line{
      text-align:left;
      .key{
        display:inline-block;
        width:120px;
        text-align:right;
        color:white;
        font-weight:700;
      }
      .value{
        display:inline-block;
        text-align:left;

      }
    }
  }
  .right{
    width:calc(100% - 340px);
    right:0
  }
}
</style>
