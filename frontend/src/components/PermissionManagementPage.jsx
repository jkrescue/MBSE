import React, { useState } from 'react';
import './PermissionManagementPage.css';

const initialUsers = [
  { id: 1, username: 'admin', role: '平台管理员' },
  { id: 2, username: 'dev_user_1', role: '模型开发者' },
  { id: 3, username: 'guest_user', role: '普通用户' },
  { id: 4, username: 'dev_user_2', role: '模型开发者' },
  { id: 5, username: 'test_user', role: '普通用户' },
];

const rolePermissions = {
  '平台管理员': ['管理用户和角色', '配置系统全局设置', '审批模型', '查看所有模型'],
  '模型开发者': ['上传新模型', '管理自己上传的模型版本', '编辑模型信息', '查看所有模型'],
  '普通用户': ['查看已发布的模型', '下载模型文件'],
};

const PermissionManagementPage = () => {
  const [users, setUsers] = useState(initialUsers);

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  return (
    <div className="permission-page">
      <h1>权限管理</h1>
      <p>管理不同用户角色及其对应的操作权限。</p>

      <div className="permissions-key">
        <h2>角色权限说明</h2>
        <ul>
          {Object.entries(rolePermissions).map(([role, permissions]) => (
            <li key={role}>
              <strong>{role}:</strong> {permissions.join(', ')}
            </li>
          ))}
        </ul>
      </div>

      <div className="user-roles">
        <h2>用户角色分配</h2>
        <table className="permission-table">
          <thead>
            <tr>
              <th>用户ID</th>
              <th>用户名</th>
              <th>角色</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="平台管理员">平台管理员</option>
                    <option value="模型开发者">模型开发者</option>
                    <option value="普通用户">普通用户</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionManagementPage; 