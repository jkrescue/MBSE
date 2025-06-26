import useRole from '../hooks/useRole';
import useDashboardConfig from '../hooks/useDashboardConfig';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Sidebar from '../components/layouts/Sidebar';
import TopBar from '../components/layouts/TopBar';

export default function Dashboard() {
  const role = useRole();
  const widgets = useDashboardConfig(role);

  if (!role) return null;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar role={role} />
      <DashboardLayout sidebar={<Sidebar items={widgets.map((w) => w.label)} />}> 
        {widgets.map((w) => {
          const Comp = w.component;
          return <Comp key={w.label} />;
        })}
      </DashboardLayout>
    </div>
  );
}
