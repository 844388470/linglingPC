import axios from 'axios'
// import _ from 'lodash'
import store from '@/store'
// import config from '@/config'
import { Message } from 'element-ui'
const requests = []

export default (Vue) => {
  Object.defineProperties(Vue.prototype, {
    // $http: {
    //   value: axios
    // }
  })
  // axios配置
  // axios.defaults.baseURL = config[process.env.NODE_ENV].host
  // axios.defaults.baseURL = 'http://localhost:8080/api'
  axios.defaults.baseURL = process.env.host
  axios.defaults.timeout = 100000
  axios.defaults.withCredentials = true
  // axios.defaults.headers['jwt'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsIm9wZW5pZCI6Im9rcERXNVh6dmtENDFlc25ZdkVNR29ZYlI3V1EiLCJpYXQiOjE1MzM3ODUyMDMsImV4cCI6MTU0MTU2MTIwM30.UOYEz0JsLr4hXDCSxOyMJSUnA2LrxAIMCTNTXt9nbNY';

  //  添加拦截器
  // request拦截器
  axios.interceptors.request.use(function (config) {
    store.dispatch('setLoading', true)
    requests.push(config)
    return config
  }, function (error) {
    store.dispatch('setLoading', false)
    return Promise.reject(error)
  })

//response 拦截器
  axios.interceptors.response.use(function (response) {
    // _.remove(requests, r => {
    //   return r === response.config
    // })
    // if(!requests.length){
    //     setTimeout(() => {
            store.dispatch('setLoading', false)
    //    }, 300)
    // }
    // return response.data
    // store.dispatch('setLoading', false)
    // if (Number(response.data.code) !== 0) {
    //   Message({
    //     message: response.data.message,
    //     type: 'error',
    //     duration: 2 * 1000
    //   })
    //   if(Number(response.data.code)===1000){
    //     store.dispatch('setIsLogin', 0).then(res=>{
    //       sessionStorage.clear()
    //       window.location.reload()
    //     })
    //   }
      // return Promise.reject(response.data)
    // } else {
      return Promise.resolve(response.data)
    // }
  }, function (error) {
    store.dispatch('setLoading', false) 
    // if (error.response) {
    //   console.log(error.response.status)
    //   switch (error.response.status) {
    //     case 401:
    //       console.log('401 未授权')
    //       break
    //     case 500:
    //       console.log('账号密码出错')
    //       break

    //     default:
    //       console.log('发生错误了')
    //   }
    // } else {
    //   console.log(error)
    // }
    // Message.error('呀呀呀，系统出错了')
    console.log(error,JSON.parse(JSON.stringify(error)))
    return Promise.reject(error.response.data)
  })
}
