<template>
  <div class="hello">
    <Form ref="formItem" :model="formItem" :rules="ruleItem" :label-width="80">
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <h2>{{msg}}</h2>
        </Col>
      </Row>
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="account" label="账号">
          <Input type="text" v-model="formItem.account" placeholder="你的注册邮箱"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="password" label="密码">
          <Input type="password" v-model="formItem.password" placeholder="你的密码"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :xs="16" :sm="16" :md="16" :lg="16">
          <FormItem prop="code" label="验证码">
             <Input type="text" v-model="formItem.code" placeholder="请输入验证码"></Input>
          </FormItem>
        </Col>
        <Col :xs="8" :sm="8" :md="8" :lg="8">
          <h2 id="verifyCode" @click="createCode()">{{verifyCode}}</h2>
        </Col>
      </Row>
      <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
        <Button id="login_btn" shape="circle" type="primary" :loading="loading" @click.native="handleSubmit('formItem')">
          <span v-if="!loading">登录</span>
          <span v-else>登录中...</span>
        </Button>
        </Col>
      </Row>
      <Row class="tip">
        <Col :xs="10" :sm="10" :md="10" :lg="10" offset="12">
          <!--<span class="login_font">忘记密码？点击邮箱找回</span>-->
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '图书馆',
      verifyCode: 'hello',
      formItem: {
        account: '',
        password: '',
        code: ''
      },
      ruleItem: {
        account: [{
          required: true,
          message: '请填写账号！',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请填写密码',
          trigger: 'blur'
        }, {
          type: 'string',
          min: 3,
          message: '密码长度不能小于6位',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '请填写验证码',
          trigger: 'blur'
        }]
      },
      loading: false
    }
  },
  mounted () {
    this.createCode()
  },
  methods: {
    handleSubmit (name) {
      var that = this
      this.loading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (that.verifyCode === that.formItem.code) {
            that.$http.post(that.GLOBAL.serverPath + '/excise/login',
              {
                account: that.formItem.account,
                password: that.formItem.password
              },
              {
                emulateJSON: true
              }
            ).then(function (res) {
              console.log(res.data.loginUser)
              if (res.data.result === 'yes') {
                this.$Message.success('登录成功!')
                window.localStorage.setItem('userId', res.data.loginUser.rid)
                window.localStorage.setItem('account', res.data.loginUser.account)
                window.localStorage.setItem('username', res.data.loginUser.name)
                window.localStorage.setItem('sex', res.data.loginUser.sex)
                window.localStorage.setItem('condi', res.data.loginUser.condi)
                console.log('hahaha' + res.data.condi)
                if (res.data.condi === 2) {
                  this.$router.replace({path: '/index'})
                } else if (res.data.condi === 1) {
                  this.$router.replace({path: '/manager'})
                } else {
                  this.$router.replace({path: '/reader'})
                }
              } else {
                this.$Message.error('账号或密码有误！')
                this.loading = false
              }
            })
          } else {
            that.$Message.error('请填写正确的验证码!')
            this.loading = false
          }
        } else {
          this.loading = false
        }
      })
    },
    createCode () {
      var code = ''
      var codeLength = 4
      var random = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      for (var i = 0; i < codeLength; i++) {
        var index = Math.floor(Math.random() * 36)
        code += random[index]
      }
      console.log(code)
      this.verifyCode = code
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello{
    margin: auto;
  }
  h2{
    color:#2D8CF0;
    margin-bottom:20px;
  }
  Form{
    margin:0 auto;
    width:350px;
    border: 2px solid grey;
    padding:50px 0;
    /*background-color:red;*/
  }
  #login_btn{
    width:70%;
  }
  .tip{
    margin-top:10px;
    color:darkgrey;
  }
  #verifyCode{
  }
</style>
