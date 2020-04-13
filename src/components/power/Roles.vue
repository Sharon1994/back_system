<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" stripe style="width: 100%" border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',index1===0 ? 'bdtop':'','vcenter']"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[index2===0 ? '':'bdtop','vcenter']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      @close="removeRoles(scope.row,item3.id)"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 下表列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              @click="openRolesData(scope.row)"
              icon="el-icon-setting"
              size="mini"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹出框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      @close="closeRoleDialog"
      width="50%"
    >
      <!-- 添加角色表单内容 -->
      <el-form :model="rolesForm" :rules="rolesFormRules" ref="rolesForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName "></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input type="textarea" v-model="rolesForm.roleDesc "></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色弹出框 -->
    <el-dialog
      title="分配权限"
      ref="selectRoleData"
      :visible.sync="settingRoleDialogVisible"
      width="50%"
      @close="closeSettingRoleDialog"
    >
      //树形区域内容
      <el-tree :data="allRolesData" :props="rolesProps"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settingRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickSetRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //用户列表数据
      rolesList: [],
      addRolesDialogVisible: false,
      //添加角色数据
      rolesForm: {
        roleName: '',
        roleDesc: ''
      },
      //添加角色数据验证规则
      rolesFormRules: {
        roleName: [
          { required: true, message: '请填写角色名称', trigger: 'blur' },
          {
            min: 5,
            max: 10,
            message: '名称长度在5-10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请填写角色描述', trigger: 'blur' },
          {
            min: 20,
            max: 50,
            message: '角色描述长度在20-50个字符之间',
            trigger: 'blur'
          }
        ]
      },
      //分配角色弹出框的显示与隐藏
      settingRoleDialogVisible: false,
      //所有角色展示数据
      allRolesData: [],
      rolesProps: {
        children: 'children',
        label: 'authName'
      },
      //已选中的角色权限
      allSelectedRole: [],
      //当先选中角色id
      selectId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取用户列表数据
    async getRolesList() {
      const res = {
        data: [
          {
            id: 30,
            roleName: '主管',
            roleDesc: '技术负责人',
            children: [
              {
                id: 101,
                authName: '商品管理',
                path: null,
                children: [
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 1051,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 1052,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 105,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 10512,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 10523,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 30,
            roleName: '主管',
            roleDesc: '技术负责人',
            children: [
              {
                id: 101,
                authName: '商品管理',
                path: null,
                children: [
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  }
                ]
              },
              {
                id: 101,
                authName: '商品管理',
                path: null,
                children: [
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  }
                ]
              },
              {
                id: 101,
                authName: '商品管理',
                path: null,
                children: [
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 30,
            roleName: '主管',
            roleDesc: '技术负责人',
            children: [
              {
                id: 101,
                authName: '商品管理',
                path: null,
                children: [
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 30,
            roleName: '主管',
            roleDesc: '技术负责人',
            children: [
              {
                id: 101,
                authName: '商品管理',
                path: null,
                children: [
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  }
                ]
              },
              {
                id: 101,
                authName: '商品管理',
                path: null,
                children: [
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  }
                ]
              },
              {
                id: 101,
                authName: '商品管理',
                path: null,
                children: [
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 30,
            roleName: '主管',
            roleDesc: '技术负责人',
            children: [
              {
                id: 101,
                authName: '商品管理',
                path: null,
                children: [
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 30,
            roleName: '主管',
            roleDesc: '技术负责人',
            children: [
              {
                id: 101,
                authName: '商品管理',
                path: null,
                children: [
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  }
                ]
              },
              {
                id: 101,
                authName: '商品管理',
                path: null,
                children: [
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  }
                ]
              },
              {
                id: 101,
                authName: '商品管理',
                path: null,
                children: [
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  },
                  {
                    id: 104,
                    authName: '商品列表',
                    path: null,
                    children: [
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      },
                      {
                        id: 105,
                        authName: '添加商品',
                        path: null
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        meta: {
          msg: '获取成功',
          status: 200
        }
      }
      //const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.rolesList = res.data
    },
    //点击添加角色 确定按钮
    addRole() {
      //进行预验证并进行提交
      this.$refs.rolesForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.rolesForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addRolesDialogVisible = false
        this.getRolesList()
      })
    },
    //关闭弹出框重置表单
    closeRoleDialog() {
      this.$refs.rolesForm.resetFields()
    },
    //删除角色指定权限
    async removeRoles(role, rightsId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult != 'confirm') {
        return this.$message.info('取消删除了呦')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role}/rights/${rightsId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      role.children = res.data
    },
    //点击分配权限
    async openRolesData(role) {
      //获取所有权限
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.allRolesData = res.data
      this.selectId = role.id

      //获取已经选中的权限id
      getSelectRole(role, this.allSelectedRole)
      //展开分配权限弹出框
      this.settingRoleDialogVisible = true
    },
    //获取已选中的权限id
    getSelectRole(role, arr) {
      if (!role.children) {
        return arr.push(role.id)
      }
      role.children.forEach(item => {
        this.getSelectRole(item, arr)
      })
    },
    //监听分配权限弹框关闭事件
    closeSettingRoleDialog() {
      this.allSelectedRole = []
    },
    //分配角色确定按钮
    async clickSetRole() {
      const roleId = [
        ...this.$refs.selectRoleData.getCheckedKeys(),
        ...this.$refs.selectRoleData.getHalfCheckedKeys()
      ]
      const rolesId = roleId.join(',')
      const {
        data: res
      } = await this.$http.post(`roles/${this.selectId}/rights`, {
        rids: rolesId
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.settingRoleDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>