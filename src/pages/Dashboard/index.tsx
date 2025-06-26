import React from 'react';
import { useUserStore } from '@/store/userStore';
import { AdminDashboard } from '../../components/dashboards/AdminDashboard';
import { ProjectManagerDashboard } from '../../components/dashboards/ProjectManagerDashboard';
import { ArchitectDashboard } from '../../components/dashboards/ArchitectDashboard';
import { SimulationEngineerDashboard } from '../../components/dashboards/SimulationEngineerDashboard';
import { ModelingEngineerDashboard } from '../../components/dashboards/ModelingEngineerDashboard';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { ROLE_NAMES } from '../../utils/roleMap';

const Dashboard: React.FC = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  const renderDashboard = () => {
    switch (currentUser?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'pm':
        return <ProjectManagerDashboard />;
      case 'arch':
        return <ArchitectDashboard />;
      case 'sim':
        return <SimulationEngineerDashboard />;
      case 'model':
        return <ModelingEngineerDashboard />;
      default:
        return <div>请选择用户角色</div>;
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>
          欢迎，{currentUser?.role ? ROLE_NAMES[currentUser.role] : '访客'}
        </h1>
      </div>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard; 