<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index.png" alt="" />
        <el-form-item prop="mobile"
          ><el-input
            v-model="loginForm.mobile"
            placeholder="请输入手机号"
          ></el-input
        ></el-form-item>
        <el-form-item prop="code"
          ><el-input
            v-model="loginForm.code"
            placeholder="请输入验证码"
          ></el-input
        ></el-form-item>
        <el-checkbox v-model="loginForm.protocal" prop="protocal"></el-checkbox>
        <span
          >我已阅读并同意
          <a href="javascript:;">用户协议</a>
          和
          <a href="javascript:;">隐私条款</a> </span
        ><br />
        <el-button
          type="primary"
          style=" width: 100%; margin-top:15px; "
          @click="login()"
          >登&nbsp;录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script>
import './gt.js'
export default {
  // require校验不了checkbox这种属性为true或false的
  data () {
    // 在data中为protocal校验声明方法
    var protocalTest = function (rule, value, callback) {
      // value当前被校验的信息
      value ? callback() : callback(new Error('不同意还登尼玛币'))
    }
    return {
      loginForm: {
        mobile: '13091160637',
        code: '246810',
        protocal: true
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '此项必填' },
          { pattern: /^1[345789]\d{9}$/, message: '手机号码格式错误' }
        ],
        code: [{ required: true, message: '此项必填' }],
        protocal: [{ validator: protocalTest }]
      }
    }
  },
  methods: {
    login () {
      // console.log(this)

      this.$refs.loginFormRef.validate(valid => {
        // valid为返回的校验信息
        if (!valid) {
          return false
        }

        // A.人机验证
        // axios获得极验的秘钥信息
        this.$http({
          url: '/mp/v1_0/captchas/' + this.loginForm.mobile,
          method: 'get'
        })
          .then(result => {
            console.log(result) // 极验的秘钥信息
            let { data } = result.data // 从result里把data解构出来

            // 检测data的结构，保证data.gt, data.challenge, data.success有值
            window.initGeetest({
              // 以下配置参数来自服务端SDK
              gt: data.gt,
              challenge: data.challenge,
              offline: !data.success,
              new_captcha: true,
              product: 'bind' // 设置验证窗口样式的
            },
            captchaObj => {
              // 调用captchaObj的方法
              captchaObj
                .onReady(_ => {
                  // 显示验证码窗口进行验证
                  captchaObj.verify()
                })
                .onSuccess(_ => {
                  // 校验成功
                  this.loginCheck()
                })
                .onError(_ => {
                  // 校验失败错误处理
                })
            })
          })
          .catch(err => {
            return this.$message.error('获取极验秘钥失败' + err)
          })
      })
    },
    loginCheck () {
      // B.账号验证码校验
      this.$http({
        url: '/mp/v1_0/authorizations',
        method: 'post',
        data: this.loginForm
      })
        .then(result => {
          window.sessionStorage.setItem(
            'userinfo',
            JSON.stringify(result.data.data)
          )
          this.$router.push('/home') // 编程式导航跳转
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          // err是个对象，不是字符串，不能直接输出，得拼接成字符串
          this.$message.error('账号或验证码错误')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  text-align: center;
  height: 100%;
  background: url('login_bg.jpg');
  background-size: cover;
  .login-box {
    opacity: 0.5;
    margin: 12%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(219, 205, 205);
    width: 430px;
    height: 340px;
    img {
      width: 75%;
      margin-bottom: 15px;
    }
    span {
      margin-left: 5px;
      a {
        text-decoration: none;
      }
    }
  }
}
</style>
