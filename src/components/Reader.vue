<template>
  <div class="layout">
    <Row type="flex">
      <Col span="5" class="layout-menu-left">
      <Menu active-name="1-1" theme="dark" width="auto" :open-names="['1']">
        <div class="layout-logo-left">
          <h2 style="color:white;">图书馆</h2>
        </div>
        <Submenu name="1">
          <template slot="title">
            <Icon type="ios-navigate"></Icon>
            欢迎你，{{msg}}同学
          </template>
          <MenuItem name="1-1" @click.native="searchBook"><span>搜索书籍</span></MenuItem>
          <MenuItem name="1-2" @click.native="lookRecord"><span>借阅记录</span></MenuItem>
        </Submenu>
        <!--<Submenu name="2">
          <template slot="title">
            <Icon type="ios-keypad"></Icon>
            书籍管理
          </template>
          <MenuItem name="2-1"><span @click="lookBook">查看书籍</span></MenuItem>
          <MenuItem name="2-2">Option 2</MenuItem>
        </Submenu>
        <Submenu name="3">
          <template slot="title">
            <Icon type="ios-analytics"></Icon>
            网站管理
          </template>
          <MenuItem name="3-1">Option 1</MenuItem>
          <MenuItem name="3-2">Option 2</MenuItem>
        </Submenu>-->
      </Menu>
      </Col>
      <Col span="19">
      <div class="layout-header"></div>
      <div class="layout-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem href="#">{{one_nav}}</BreadcrumbItem>
          <BreadcrumbItem href="#">{{two_nav}}</BreadcrumbItem>
          <BreadcrumbItem>{{three_nav}}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="layout-content">
        <div class="layout-content-main">
          <template id="searchBook"></template>
          <template id="myRecord"></template>
          <component :is="currentView"></component>
        </div>
      </div>
      <div class="layout-copy">
        2017-2018 &copy; 图书馆管理
      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  import searchBook from '../components/SearchBook.vue'
  import myRecord from '../components/MyRecord.vue'
  import Button from 'iview/src/components/button/button'
  export default {
    name: 'Reader',
    data () {
      return {
        msg: '',
        one_nav: '主页',
        two_nav: '>',
        three_nav: '搜索书籍',
        currentView: 'searchBook'
      }
    },
    mounted () {
      this.msg = window.localStorage.getItem('username')
    },
    methods: {
      searchBook () {
        this.one_nav = '主页'
        this.two_nav = '>'
        this.three_nav = '搜索书籍'
        this.currentView = 'searchBook'
      },
      lookRecord () {
        this.one_nav = '主页'
        this.two_nav = '>'
        this.three_nav = '借阅记录'
        this.currentView = 'myRecord'
      }
    },
    components: {
      Button,
      searchBook: searchBook,
      myRecord: myRecord
    }
  }
</script>
<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    margin-top:-60px;
  }
  .layout-breadcrumb{
    padding: 10px 15px 0;
    text-align:left;
  }
  .layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
  .layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
  .layout-menu-left{
    background: #464c5b;
  }
  .layout-header{
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
  .layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }
  Button{
    color:white;
  }
</style>
