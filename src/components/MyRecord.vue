<template>
  <div class="container">
    <Table border :columns="columns7" :data="data6"></Table>
    <Page :total="total" :page-size="10" @on-change="changePage"></Page>
  </div>
</template>
<script type="es6">
  export default {
    name: 'MyRecord',
    data () {
      return {
        total: '',
        condi: '',
        modal1: false,
        modal2: false,
        currIndex: 0,//最近被点击添加编号副本的图书编号
        formInline: {
          raccount: ''
        },
        columns7: [
          {
            title: '编号',
            key: 'bid',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'document-text'
                  }
                }),
                h('strong', params.row.bid)
              ]);
            }
          },
          {
            title: '书名',
            key: 'title'
          },
          {
            title: '编号',
            key: 'number'
          },
          {
            title: '借阅者学号',
            key: 'raccount'
          },
          {
            title: '借阅者姓名',
            key: 'rname'
          },
          {
            title: '借阅时间',
            key: 'time'
          },
          {
            title: '应归还时间',
            key: 'backtime'
          },
          {
            title: '是否超期',
            key: 'condi'
          }
        ],
        data6: [],
        data7: [] //存放从后台请求过来的借阅记录
      }
    },
    mounted(){
      this.request(1);
    },
    methods: {
      request (currentPage){
        var that=this
        this.$http.post(that.GLOBAL.serverPath + '/excise/getAllBorrowRecords',
          {
            raccount: window.localStorage.getItem('account'),
            currentPage: currentPage
          },
          {
            emulateJSON: true
          }
        ).then(function (res) {
          console.log(res.data.borrowrecords)
          that.total=res.data.pageInfo.total
          that.data6=[]
          that.data7=res.data.borrowrecords
          that.data7.forEach((e) =>{
            let obj = {}
            obj.bid = e.bid
            obj.title = e.album.title
            obj.number = e.subalbum.number
            obj.raccount = e.raccount
            obj.rname = e.reader.name
            obj.time = e.time
            obj.backtime = e.backtime
            var time = new Date().getTime();
            console.log(time)
            if(time < e.inttime){
              obj.condi = '未超期'
            }else{
              var delayDay = Math.ceil((time - e.inttime)/86400000)
              obj.condi = '超期'+delayDay+'天'
            }
            that.data6.push(obj)
          })
        })
      },
      changePage: function(page){
        this.request(page)
      },
    }
  }
</script>

