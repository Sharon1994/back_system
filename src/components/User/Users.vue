<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryData.query" @clear="getUsersData">
            <el-button slot="append" icon="el-icon-search" @click="getUsersData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addUserDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户信息 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserBtn(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="addUserDialogClosed"
    >
      <!-- 内容区域 -->
      <el-form :model="addRuleForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addRuleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editUserDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="editUserDialogClosed"
    >
      <!-- 内容区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserEnter">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="提示" :visible.sync="setRoleDialogVisible" width="50%" >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      queryData: {
        query: '',
        //显示第几页
        pagenum: 1,
        //每页展示的数据
        pagesize: 2
      },
      userList: '',
      total: 0,
      addUserDialogVisible: false,
      //添加用户表单数据
      addRuleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加用户表单数据规则
      addFormRules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度需在3-10个字符',
            tigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码长度需在3-10个字符', tigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请填写电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //编辑用户弹出框的显示和隐藏
      editUserDialogVisible: false,
      //编辑用户数据
      editForm: {},
      //编辑表单规则
      editFormRules: {
        email: [
          { required: true, message: '请填写邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请填写电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //分配角色对话框显示与隐藏
      setRoleDialogVisible:false
    }
  },
  created() {
    this.getUsersData()
  },
  methods: {
    //获取用户数据
    async getUsersData() {
      const res = {
        data: {
          totalpage: 5,
          pagenum: 4,
          users: [
            {
              id: 25,
              username: 'tige117',
              mobile: '18616358651',
              type: 1,
              email: 'tige112@163.com',
              create_time: '2017-11-09T20:36:26.000Z',
              mg_state: true, // 当前用户的状态
              role_name: '炒鸡管理员'
            },
            {
              id: 26,
              username: 'tige1172',
              mobile: '18616358651',
              type: 1,
              email: 'tige112@163.com',
              create_time: '2017-11-09T20:36:26.000Z',
              mg_state: false, // 当前用户的状态
              role_name: '炒鸡管理员'
            },
            {
              id: 25,
              username: 'tige117',
              mobile: '18616358651',
              type: 1,
              email: 'tige112@163.com',
              create_time: '2017-11-09T20:36:26.000Z',
              mg_state: true, // 当前用户的状态
              role_name: '炒鸡管理员'
            },
            {
              id: 26,
              username: 'tige1172',
              mobile: '18616358651',
              type: 1,
              email: 'tige112@163.com',
              create_time: '2017-11-09T20:36:26.000Z',
              mg_state: false, // 当前用户的状态
              role_name: '炒鸡管理员'
            }
          ]
        },
        meta: {
          msg: '获取成功',
          status: 200
        }
      }
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.userList = res.data.users
      this.total = res.data.pagenum
      console.log(this.userList)
      //   const { data: res } = await this.$http.get('users', {
      //     params: this.queryData
      //   })
      //   if (res.meta.status !== 200) {
      //     return this.$message.error('获取数据失败')
      //   }
      //this.userList = res.data.users
      //this.total = res.data.total
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      //console.log(newSize)
      this.queryData.pagesize = newSize
      this.getUsersData()
    },
    //监听 页码 的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryData.pagenum = newPage
      this.getUsersData()
    },
    //修改用户状态
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('修改用户状态失败')
      }
      this.$message.success('修改用户状态成功')
    },
    //监听 添加用户关闭 事件
    addUserDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //添加用户  点击确定按钮
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addRuleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        //关闭添加用户弹出框
        this.addUserDialogVisible = false
        //刷新页面
        this.getUsersData()
      })
    },
    //编辑用户  点击编辑按钮
    async editUser(id) {
      console.log(id)
      const { data: res } = await this.$http.post('user/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('用户查询失败')
      }
      this.editForm = res.data
      this.editUserDialogVisible = true
    },
    //编辑用户弹出框  点击确定按钮
    editUserEnter() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑用户信息失败')
        }
        //编辑用户弹窗
        this.editUserDialogVisible = false
        //刷新数据
        this.getUsersData()
        this.$message.success('编辑用户信息成功')
      })
    },
    //关闭 编辑用户弹窗
    editUserDialogClosed() {
      this.$refs.editForm.resetFields()
      this.editUserDialogVisible = false
    },
    //根据id删除用户信息
    async deleteUserBtn(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除用户')
      }

      const { data: res } = await this.$http.delete('user/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }

      this.$message.success('删除用户成功')
      this.getUsersData()
    }
  }
}
</script>
<style lang="less" scoped>
</style>