<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card class="box-card">
      <el-table :data="rightsListData" stripe border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsListData: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    //获取权限列表用户数据
    async getRightsList() {
      const res = {
        data: [
          {
            id: 101,
            authName: '商品管理',
            level: '0',
            pid: 0,
            path: null
          },
          {
            id: 102,
            authName: '订单管理',
            level: '0',
            pid: 0,
            path: null
          },
          {
            id: 103,
            authName: '订单管理1',
            level: '1',
            pid: 0,
            path: null
          },
          {
            id: 104,
            authName: '订单管理2',
            level: '2',
            pid: 0,
            path: null
          },
          {
            id: 105,
            authName: '商品管理',
            level: '2',
            pid: 0,
            path: null
          },
          {
            id: 106,
            authName: '订单管理',
            level: '0',
            pid: 0,
            path: null
          },
          {
            id: 107,
            authName: '订单管理1',
            level: '1',
            pid: 0,
            path: null
          },
          {
            id: 108,
            authName: '订单管理2',
            level: '0',
            pid: 0,
            path: null
          }
        ],
        meta: {
          msg: '获取权限列表成功',
          status: 200
        }
      }
      if (res.meta.status !== 200) {
        return this.$message.err('获取权限列表失败')
      }
      this.rightsListData = res.data

      //   const { data: res } = await this.$http.get('users/List')
      //   if (res.meta.status !== 200) {
      //     return this.$message.err('获取权限列表失败')
      //   }
      //   this.rightsListData = res.data
    }
  }
}
</script>
<style lang="less" scoped>
</style>