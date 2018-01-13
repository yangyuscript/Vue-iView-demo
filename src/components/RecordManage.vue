<template>
  <div class="container">
    <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
      <FormItem prop="borrowRecord">
        <Input type="text" v-model="formInline.raccount" placeholder="借阅者学号">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formInline')">查找</Button>
      </FormItem>
    </Form>
    <Table border :columns="columns7" :data="data6"></Table>
    <Page :total="total" :page-size="10" @on-change="changePage"></Page>
  </div>
</template>
<script type="es6">
  export default {
    name: 'UserManage',
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
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.reback(params.index)
                    }
                  }
                }, '确认归还')
              ]);
            }
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
      handleSubmit(account) {
        this.request(1)
      },
      show (index) {
        this.$Modal.info({
          title: '书籍信息',
          content: `书名：${this.data6[index].title}<br>书籍编号：${this.data6[index].number}<br>借阅者学号：${this.data6[index].raccount}<br>借阅者姓名：${this.data6[index].rname}<br>借阅时间：${this.data6[index].time}<br>应归还时间：${this.data6[index].backtime}<br>状态：${this.data6[index].condi}`
        })
      },
      reback (index) {
        //this.data6.splice(index, 1);
        var that=this
        this.$http.post(that.GLOBAL.serverPath + '/excise/reback',
          {
            bid: that.data6[index].bid,
            sid: that.data6[index].sid
          },
          {
            emulateJSON: true
          }
        ).then(function (res) {
          if(res.data.status == 'yes'){
            that.data6.splice(index,1)
            this.$Message.success('操作成功')
          }else{
            this.$Message.status('操作失败')
          }
        })
      },
      request (currentPage){
        var that=this
        this.$http.post(that.GLOBAL.serverPath + '/excise/getAllBorrowRecords',
          {
            raccount: that.formInline.raccount,
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
            obj.sid = e.sid
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

