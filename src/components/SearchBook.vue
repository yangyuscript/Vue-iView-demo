<template>
  <div class="container">
    <Form ref="formInline" :model="formInline" inline>
      <FormItem prop="account">
        <Input type="text" v-model="formInline.title" placeholder="书名">
        <Icon type="search" slot="prepend"></Icon>
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
    name: 'SearchBook',
    data () {
      return {
        total: '',
        condi: '',
        modal1: false,
        modal2: false,
        currIndex: 0,//最近被点击添加编号副本的图书编号
        formInline: {
          title: ''
        },
        formItem2: {
          title: '',
          author: '',
          publisher: '',
          publishtime: '',
          descri: ''
        },
        ruleItem2: {
          title: [{
            required: true,
            message: '请填写书名！',
            trigger: 'blur'
          }],
          author: [{
            required: true,
            message: '请填书籍作者',
            trigger: 'blur'
          }],
          publisher: [{
            required: true,
            message: '请填出版社',
            trigger: 'blur'
          }],
          publishtime: [{
            required: true,
            message: '请填写出版时间'
          }],
          descri: [{
            required: true,
            message: '请填书籍描述',
            trigger: 'blur'
          }]
        },
        formItem3: {
          num: ''
        },
        ruleItem3: {
          num: [{
            required: true,
            message: '请填写书籍副本编号！',
            trigger: 'blur'
          }]
        },
        columns7: [
          {
            title: '编号',
            key: 'aid',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'document-text'
                  }
                }),
                h('strong', params.row.aid)
              ]);
            }
          },
          {
            title: '书名',
            key: 'title'
          },
          {
            title: '作者',
            key: 'author'
          },
          {
            title: '出版社',
            key: 'publisher'
          },
          {
            title: '出版时间',
            key: 'publishtime'
          },
          {
            title: '可借副本',
            key: 'count'
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
                      this.remove(params.index)
                    }
                  }
                }, '借阅')
              ]);
            }
          }
        ],
        data6: [],
        data7: []
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
          content: `书名：${this.data6[index].title}<br>作者：${this.data6[index].author}<br>出版社：${this.data6[index].publisher}<br>出版时间：${this.data6[index].publishtime}<br>副本数量：${this.data6[index].num}<br>可借数量：${this.data6[index].count}<br>可借副本编号：<span style="color:red;">${this.data6[index].suba}</span><br>介绍：${this.data6[index].descri}`
        })
      },
      remove (index) {
        this.data6.splice(index, 1);
      },
      request (currentPage){
        var that=this
        this.$http.post(that.GLOBAL.serverPath + '/excise/getAllAlbums',
          {
            title: that.formInline.title,
            currentPage: currentPage
          },
          {
            emulateJSON: true
          }
        ).then(function (res) {
          console.log(res.data.pageInfo)
          that.total=res.data.pageInfo.pages
          //that.data6=res.data.albums
          that.data7=res.data.albums
          that.data7.forEach((e) => {
            let obj={}
            obj.aid = e.aid
            obj.title = e.title
            obj.author = e.author
            obj.publisher = e.publisher
            obj.publishtime = e.publishtime
            obj.num = e.num
            obj.descri = e.descri
            var count=0
            var s=''
            e.subalbums.forEach((item)=>{
              if( item.condi==0 ){
                count++
                s=s+item.number+','
              }
            })
            obj.count = count
            obj.suba = s
            that.data6.push(obj)
          })
        })
      },
      changePage: function(page){
        this.request(page)
      }
    }
  }
</script>

