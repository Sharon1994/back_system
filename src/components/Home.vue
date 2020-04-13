<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/heima.png" alt srcset />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          unique-opened
          active-text-color="#225fb1"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
        <div class="toggleBtn" @click="callapseBtn">|||</div>
          <!-- 一级菜单 -->
          <el-submenu index="125">
            <!-- 一级导航模板 -->
            <template slot="title">
              <i :class="iconObj[125]"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users" @click="roleAdress('/users')">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>用户列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="103">
            <!-- 一级导航模板 -->
            <template slot="title">
              <i :class="iconObj[103]"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/roles"  @click="roleAdress('/roles')">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>角色列表</span>
              </template>
            </el-menu-item>
              <el-menu-item index="/rights" @click="roleAdress('/rights')">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>权限列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="101">
            <!-- 一级导航模板 -->
            <template slot="title">
              <i :class="iconObj[101]"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-4-1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>商品列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="102">
            <!-- 一级导航模板 -->
            <template slot="title">
              <i :class="iconObj[102]"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-4-1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>订单列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="145">
            <!-- 一级导航模板 -->
            <template slot="title">
              <i :class="iconObj[145]"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-4-1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <!-- 一级菜单 -->
          <!-- <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id"> -->
          <!-- 一级菜单模板 -->
          <!-- <template slot="title"> -->
          <!-- 图标 -->
          <!-- <i :class="iconObj[item.id]"></i> -->
          <!-- 文字 -->
          <!-- <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id" @click="roleAdress('/'+subItem.path)"
            >
          <template slot="title">-->
          <!-- 图标 -->
          <!-- <i class="el-icon-menu"></i> -->
          <!-- 文字 -->
          <!-- <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>-->
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse:false,
      activePath:''
    }
  },
  created() {
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem("activePath")
  },
  methods: {
    loginOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧导航
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    callapseBtn(){
      this.isCollapse=!this.isCollapse
    },
    roleAdress(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #fff;
    span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background: #333744;
  .el-menu {
    border-right: none;
    .toggleBtn{
      background-color: rgb(100, 96, 96);
      color: #fff;
      text-align: center;
      line-height: 24px;
      font-size: 11px;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
</style>