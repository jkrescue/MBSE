import React from 'react';
import { Layout, Dropdown, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUserStore } from '@/store/userStore';
import { UserRole } from '@/types/role';

const { Header, Content } = Layout;

const userOptions = [
  { label: '平台管理员', value: 'admin' },
  { label: '项目经理', value: 'pm' },
  { label: '系统架构师', value: 'arch' },
  { label: '仿真工程师', value: 'sim' },
  { label: '建模工程师', value: 'model' },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, switchUser } = useUserStore();

  const handleUserSwitch = (role: UserRole) => {
    switchUser({
      username: `${role}_user`,
      role: role
    });
  };

  const userMenu = {
    items: userOptions.map(option => ({
      key: option.value,
      label: option.label,
      onClick: () => handleUserSwitch(option.value as UserRole)
    }))
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        padding: '0 24px', 
        background: '#fff', 
        display: 'flex', 
        justifyContent: 'flex-end',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Dropdown menu={userMenu} placement="bottomRight">
          <Button icon={<UserOutlined />}>
            {userOptions.find(opt => opt.value === currentUser?.role)?.label || '选择用户'}
          </Button>
        </Dropdown>
      </Header>
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        {children}
      </Content>
    </Layout>
  );
}; 