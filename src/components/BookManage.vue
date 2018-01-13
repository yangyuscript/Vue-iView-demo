<template>
  <div class="container">
    <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
      <FormItem prop="account">
        <Input type="text" v-model="formInline.title" placeholder="书名">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formInline')">查找</Button>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="modal1 = true">新添书籍</Button>
      </FormItem>
    </Form>
    <Table border :columns="columns7" :data="data6"></Table>
    <Page :total="total" :page-size="10" @on-change="changePage"></Page>

    <Modal
      v-model="modal1"
      title="新添书籍"
      width="800"
      scrollable="true"
      ok-text="添加"
      @on-ok="ok('formItem2')"
    >
      <Form ref="formItem2" :model="formItem2" :rules="ruleItem2" :label-width="80">
        <FormItem label="书名" prop="title">
          <Input v-model="formItem2.title" placeholder=""></Input>
        </FormItem>
        <FormItem label="作者" prop="author">
          <Input v-model="formItem2.author" placeholder=""></Input>
        </FormItem>
        <FormItem label="出版社" prop="publisher">
          <Input v-model="formItem2.publisher" placeholder=""></Input>
        </FormItem>
        <FormItem label="出版时间" prop="publishtime">
          <DatePicker v-model="formItem2.publishtime" prop="publishtime" type="date" placeholder="选择出版日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="描述" prop="descri">
          <!--<Input v-model="formItem2.descri" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="书籍描述..."></Input>-->
          <quill-editor v-model="formItem2.descri" ref="VueQuillEditor"
                        :content="content"
                        @change="onEditorChange($event)">
          </quill-editor>
        </FormItem>
      </Form>
    </Modal>

    <!--添加书籍副本-->
    <Modal
      v-model="modal2"
      title="新添书籍副本"
      ok-text="添加副本"
      @on-ok="ok2('formItem3')"
    >
      <Form ref="formItem3" :model="formItem3" :rules="ruleItem3" :label-width="80">
        <FormItem label="编号" prop="num">
          <Input v-model="formItem3.num" placeholder=""></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script type="es6">
  export default {
    name: 'UserManage',
    data () {
      return {
        total: 0,
        condi: '',
        modal1: false,
        modal2: false,
        content:'',
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
            title: '操作',
            key: 'action',
            width: 300,
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
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.modal2=true
                      this.currIndex = this.data6[params.index].aid
                    }
                  }
                }, '添加编号副本'),
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
                }, '删除')
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
          width: '1100',
          //content: `书名：${this.data6[index].title}<br>作者：${this.data6[index].author}<br>出版社：${this.data6[index].publisher}<br>出版时间：${this.data6[index].publishtime}<br>副本数量：${this.data6[index].num}<br>介绍：${this.data6[index].descri}`
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
          that.total=res.data.pageInfo.total
          that.data6=[]
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
      },
      ok (name) {
        var that=this
        this.$refs[name].validate((valid) => {
          if (valid) {
            that.$http.post(that.GLOBAL.serverPath + '/excise/addAlbum',
              {
                title: that.formItem2.title,
                author: that.formItem2.author,
                publisher: that.formItem2.publisher,
                publishtime: that.formItem2.publishtime+'',
                descri: that.formItem2.descri
              },
              {
                emulateJSON: true
              }
            ).then(function (res) {
              console.log(res.data.status)
              if(res.data.status=='ok'){
                //that.$Message.success('新增成功')
                that.$Notice.config({
                  top: 50,
                  duration: 3,
                  title: '通知',
                  desc: '新添书籍成功!'
                })
                that.formInline.account=''
                that.formItem2.title=''
                that.formItem2.author=''
                that.formItem2.publisher=''
                that.formItem2.publishtime=''
                that.formItem2.descri=''
                that.request(1)
              }

            }).catch((e) => {
              that.$Message.fail('网络有误！')
            })
          }
        })
      },
      ok2 (name) {
        var that=this
        this.$refs[name].validate((valid) => {
          if (valid) {
            that.$http.post(that.GLOBAL.serverPath + '/excise/addSubAlbum',
              {
                aid: that.currIndex,
                number: that.formItem3.num
              },
              {
                emulateJSON: true
              }
            ).then(function (res) {
              console.log(res.data.status)
              if(res.data.status=='ok'){
                that.$Message.success('新增成功')
                that.formItem3.num=''
                that.request(1)
              }else{
                that.$Message.error('新增失败！查看是否存在相同编号')
              }

            }).catch((e) => {
              that.$Message.fail('网络有误！')
            })
          }
        })
      },
      onEditorChange({editor,html,text}){
        // 富文本编辑器，文本改变时，设置字段值
        console.log(editor,html,text)
        this.content = html
      }
    }
  }
</script>

