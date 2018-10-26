import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

const list={
    routes: [
      { path: '/', redirect: '/index/index'},
      { path: '/404', component: _import('errorPage/404')},
      { path: '/401', component: _import('errorPage/401')},
      { path: '/login',name: 'login', component: _import('login/index')},
      {
        path: '/index',
        component: _import('index'),
        radius:true,
        redirect: '/index/index',
        icon: 'shouye',
        children: [{path: 'index',name:'首页',radius:true,component: () =>import('@/views/wechart/users'),meta: { keep:'homepage' }}]
      },
      // {
      //   path: '/EquMonit',
      //   name: '设备监控',
      //   radius:true,
      //   component: _import('index'),
      //   icon: 'jiankong',
      //   redirect: '/EquMonit/meun4_1',
      //   children: [
      //     {path: 'AlarmNews',name: '告警消息',component: _import('menu4/menu4'),meta: { index: '4' },radius:true,},
      //     {path: 'AlarmAnalysis',name: '告警分析',component: _import('menu4/menu4'),meta: { index: '4' },radius:true,},
      //   ]
      // },
      // {
      //   path: '/ProductManagement',
      //   name: '产品管理',
      //   radius:true,
      //   component: _import('index'),
      //   icon: 'chanpinguanli',
      //   redirect: '/ProductManagement/ModelManagement',
      //   children: [
      //     {path: 'ModelManagement',name: '型号管理',component: _import('menu4/menu4'),meta: { index: '4' },radius:true,},
      //     {path: 'EquList',name: '设备列表',component: _import('menu4/menu4'),meta: { index: '4' },radius:true,},
      //     {path: 'EquDetails',name: '设备详情',component: _import('menu4/menu4'),meta: { index: '4' },radius:false,},
      //   ]
      // },
      // {
      //   path: '/CusManagement',
      //   name: '客户管理 ',
      //   radius:true,
      //   component: _import('index'),
      //   icon: 'kehuguanli',
      //   redirect: '/CusManagement/CusList',
      //   children: [
      //     {path: 'CusList',name: '客户列表',component: _import('menu4/menu4'),meta: { index: '4' },radius:true,},
      //     {path: 'CusDetails',name: '客户详情',component: _import('menu4/menu4'),meta: { index: '4' },radius:false,},
      //   ]
      // },
      // {
      //   path: '/GroupManagement',
      //   name: '分组管理',
      //   radius:true,
      //   component: _import('index'),
      //   icon: 'fenzuguanli',
      //   redirect: '/GroupManagement/GroupList',
      //   children: [
      //     {path: 'GroupList',name: '分组列表',component: _import('menu4/menu4'),meta: { index: '4' },radius:true,},
      //     {path: 'GroupListDetails',name: '分组详情',component: _import('menu4/menu4'),meta: { index: '4' },radius:false,},
      //   ]
      // },
      // {
      //   path: '/UserManagement',
      //   name: '用户管理',
      //   radius:true,
      //   component: _import('index'),
      //   icon: 'denglu',
      //   redirect: '/UserManagement/wxUserList',
      //   children: [
      //     {path: 'wxUserList',name: '微信用户列表',component: _import('menu4/menu4'),meta: { index: '4' },radius:true,},
      //     {path: 'wxUserDetails',name: '微信用户详情',component: _import('menu4/menu4'),meta: { index: '4' },radius:false,},
      //   ]
      // },
      // {
      //   path: '/SystemManagement',
      //   name: '系统管理',
      //   radius:true,
      //   component: _import('index'),
      //   icon: 'xitongguanli',
      //   redirect: '/SystemManagement/AccountManagement',
      //   children: [
      //     {path: 'AccountManagement',name: '账号管理',component: _import('menu4/menu4'),meta: { index: '4' },radius:true,},
      //     {path: 'RoleManagement',name: '角色管理',component: _import('menu4/menu4'),meta: { index: '4' },radius:true,},
      //     {path: 'PersonalCenter',name: '个人中心',component: _import('SystemManagement/PersonalCenter'),meta: { keep: 'PersonalCenter' },radius:true,},
      //   ]
      // },
      {
        path: '/wechart',
        name: '设备管理',
        radius:true,
        component: _import('index'),
        icon: 'chanpinguanli',
        redirect: '/wechart/zhuche',
        children: [
          {path: 'zhuche',name: '设备导入表',component:() => import('@/views/wechart/zhuche') ,meta: { keep: 'zhuche' },radius:true,},
          {path: 'jihuo',name: '已激活设备',component: () =>import('@/views/wechart/jihuo'),meta: { keep: 'jihuo' },radius:true,},
          {path: 'history',name: '设备轨迹',component: () =>import('@/views/wechart/history'),meta: { keep: 'history' },radius:true,},
          {path: 'location',name: '设备定位',component: () =>import('@/views/wechart/location'),meta: { keep: 'location' },radius:true,},
          // {path: 'wechartUser',name: '小程序用户',component: () =>import('@/views/wechart/wechartUser'),meta: { keep: 'wechartUser' },radius:true,},
        ]
      },
      {
        path: '/UserManagement',
        name: '用户管理',
        radius:true,
        component: _import('index'),
        icon: 'denglu',
        redirect: '/UserManagement/wechartUser',
        children: [
          {path: 'wechartUser',name: '用户',component: () =>import('@/views/wechart/wechartUser'),meta: { keep: 'wechartUser' },radius:true,},
          // {path: 'user',name: '系统用户',component: () =>import('@/views/wechart/user'),meta: { keep: 'user' },radius:true,},
          {path: 'wxUserDetails',name: '微信用户详情',component: _import('menu4/menu4'),meta: { index: '4' },radius:false,},
        ]
      },
      {
        path: '/Statistics',
        name: '统计',
        radius:true,
        component: _import('index'),
        icon: 'caidan',
        redirect: '/Statistics/users',
        children: [
          {path: 'users',name: '用户统计',component: () =>import('@/views/wechart/users'),meta: { keep: 'users' },radius:true,},
          {path: 'equs',name: '设备统计',component: () =>import('@/views/wechart/equs'),meta: { keep: 'equs' },radius:true,},
        ]
      },
      {path:'/home',redirect:'/'},
      {path:'*',redirect:'/404'}

    ]
  }

export const route=new Router(list)

export const routerlist=list
