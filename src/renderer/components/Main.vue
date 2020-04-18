<!--
 * @Author: 桔子桑
 * @Date: 2019-10-21 19:38:09
 * @FilePath: /Fund-analysis/src/renderer/components/Main.vue
 * @Description: 文件描述
-->
<template>
  <div id="main">
    <div class="menu" @mouseenter="menuenter(true)" @mouseleave="menuenter(false)" style="-webkit-app-region: drag;">
      <Icon type="ios-close" :color="menu?'black':'#ed6c60'" @click="win('close')"/>
      <Icon type="ios-remove" :color="menu?'black':'#f6be4f'" @click="win('min')"/>
    </div>

    <div class="content">
        <Table stripe :columns="columns" style="height:36px;overflow:hidden" :data="[]"></Table>

      <GeminiScrollbar style="height:400px">
        <Table @on-sort-change="sort" :show-header="false" stripe :columns="columns"  :data="fundList"></Table>

      </GeminiScrollbar>



    </div>



  </div>
</template>

<script>
import {ipcRenderer} from 'electron'

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
            // sortable: true,
            // sortType:"desc",

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

  },
  beforeDestroy(){

  },
  methods:{
    win(type){
      console.log('-------------------')
      // ipcRenderer.send('win-'+type)
      ipcRenderer.send('toIndex','')

    },
    menuenter(bool){
      this.menu = bool;
    },
    open(){
      const {dialog} = require('electron').remote;
      dialog.showOpenDialog()//可默认打开文件
    },
    ipcRenderer$on(){
      ipcRenderer.on('moveScreen',(sender,data)=>{
        console.log('----' + data.toString())//{"type":"enter","value":1}
      });
      ipcRenderer.on('getIndex',(sender,data)=>{
        var data = JSON.parse(data);
        console.log(data)
        this.fundList = data;
      });
    },
    sort(col,key,order){
      console.log(col,key,order)
      this.fundList.sort((a,b)=>a[key]-b[key])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
#main{
  height:100%;
  width:100%;
  position:relative;
  background:rgb(72, 123, 231);
  .menu{
    background: rgba(255, 255, 255, 0.8);
    height:26px;
    position:absolute;
    top:0;
    width:100%;
    text-align:left;
    padding-top:3px;
    >i{
      margin-left:8px;
    }
    .ivu-icon-ios-close:before,.ivu-icon-ios-remove:before{
      width:10px;
      height:10px;
      border-radius:50%;
      font-weight:900;
      box-shadow:0 0 5px 0px rgba(0,0,0, 0.29);
    }
    .ivu-icon-ios-close:before{
      background: #ed6c60;
    }
    .ivu-icon-ios-remove:before{
      background: #f6be4f;
    }
  }
  .content{
    padding-top:28px;
  }
}
</style>
