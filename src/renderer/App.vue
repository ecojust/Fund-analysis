<!--
 * @Author: 桔子桑
 * @Date: 2019-07-23 18:32:46
 * @FilePath: /Fund-analysis/src/renderer/App.vue
 * @Description: 文件描述
-->
<template>
  <div id="app" :style="style">
    <div class="menu" @mouseenter="menuenter(true)" @mouseleave="menuenter(false)" style="-webkit-app-region: drag;">
      <Icon type="ios-close" :color="menu?'black':'#ed6c60'" @click="win('close')"/>
      <Icon type="ios-remove" :color="menu?'black':'#f6be4f'" @click="win('min')"/>
      <Icon type="md-home" color="black" @click="home"/>

    </div>
    <router-view id="content"></router-view>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'

  export default {
    name: 'elelg',
    data(){
      return {
        style:{},
        menu:false
      }
    },
    created(){
      this.resize();
      window.router = this.$router;
    },
    methods:{
      resize(){
        var scale = 0.8;
        this.style = {
          // width:(1080 * scale) + 'px',
          height:(768 * scale - 14) + 'px'
        }
      },
      menuenter(bool){
        this.menu = bool;
      },
      win(type){
        console.log('---window----'+type)
        ipcRenderer.send('win-'+type)
      },
      home(){
        this.$router.push({
          path:'/',
        })
      }
    }
  }
</script>

<style lang="less">
*{
  padding:0;
  margin:0
}
  /* CSS */
  #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height:540px;
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
      cursor:pointer;
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
  #content{
    padding-top:28px;
    height:100%;
    width:100%;
  }
}
</style>
