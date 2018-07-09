//index.js
//获取应用实例
const app = getApp()
const config = require('../../config/config.default.js')

Page({
  onShareAppMessage: function(){
    return{
      title:'移动政企热力产品随手查'
    }
  },
  data: {
    greenSendButton: false,
    graySendButton: true,
    alreadySend: false,
    second: 60,
    disabled: true,
    buttonType: 'default',
    showModal:false,
    phoneNum: '',
    code: '',
    otherInfo: ''
  },

  // 手机号
  inputPhoneNum: function (e) {
    let phoneNum = e.detail.value
    if (phoneNum.length === 11) {
      let checkedNum = this.checkPhoneNum(phoneNum)
      if (checkedNum) {
        this.setData({
          phoneNum: phoneNum,
        })
        console.log('phoneNum' + this.data.phoneNum)
        this.showSendMsg()
        this.activeButton()
      }
    } else {
      this.setData({
        phoneNum: ''
      })
      this.showGraySendMsg()
    }
  },
  //验证手机号码是否符合标准
  checkPhoneNum: function (phoneNum) {
    let str = /^1\d{10}$/
    if (str.test(phoneNum) && phoneNum.length === 11) {
      return true;
    } else {
      wx.showToast({
        title: '手机号有误',
        icon:'none'
      })
      return false
    }
  },
// 发送验证码
  sendMsg: function () {
    wx.request({
      url: `http://112.35.8.4:5000/test`,
      data: {
        key: this.data.phoneNum
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log('post success')
      }
    })
    this.setData({
      alreadySend: true,
      greenSendButton: false,
      graySendButton: false
    })
    this.timer()
  },

  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              greenSendButton: true
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  showSendMsg: function () {
    if (!this.data.alreadySend) {
      this.setData({
        greenSendButton: true,
        graySendButton: false        
      })
    }
  },

  showGraySendMsg: function () {
    this.setData({
      greenSendButton: false,
      graySendButton: true,
      disabled: true,
      buttonType: 'default'
    })
  },
// 验证码
  addCode: function (e) {
    this.setData({
      code: e.detail.value
    })
    this.activeButton()
    console.log('code' + this.data.code)
  },
// 按钮
  activeButton: function () {
    let { phoneNum, code, otherInfo } = this.data
    console.log(code)
    if (phoneNum && code && otherInfo) {
      this.setData({
        disabled: false,
        buttonType: 'primary'
      })
    } else {
      this.setData({
        disabled: true,
        buttonType: 'default'
      })
    }
  },
  // 快去看看验证
  onSubmit: function () {
    wx.request({
      url: `${config.api + '/addinfo'}`,
      data: {
        phoneNum: this.data.phoneNum,
        code: this.data.code,
        otherInfo: this.data.otherInfo
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)

        if ((parseInt(res.statusCode) === 200) && res.data.message === 'pass') {
          wx.navigateTo({
            url: '../products/products',
          })
        } else {
          this.setData({
            showModal: true
          })
          // wx.showToast({
          //   title: res.data.message,
          //   image: '../../images/fail.png'

          // })
         }
      },
       fail: function (res) {
          console.log(res)
       }  
    })
  },

  preventTouchMove: function () {
  },
  go: function () {
    this.setData({
      showModal: false
    })
  },

  //新添加的页面入口导航实例代码
  bindViewDemo:function() {
    wx.navigateTo({
      url: '../products/products',
    })
  }
})
