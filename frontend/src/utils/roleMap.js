import SystemMonitor from '../components/widgets/SystemMonitor';
import UserManager from '../components/widgets/UserManager';
import ProjectOverview from '../components/widgets/ProjectOverview';
import ReminderCenter from '../components/widgets/ReminderCenter';
import ArchitectureEditor from '../components/widgets/ArchitectureEditor';
import SimulationPanel from '../components/widgets/SimulationPanel';
import ModelTaskBoard from '../components/widgets/ModelTaskBoard';

const roleMap = {
  admin: [
    { label: '平台健康监控', component: SystemMonitor },
    { label: '用户与角色管理', component: UserManager },
  ],
  pm: [
    { label: '项目总览', component: ProjectOverview },
    { label: '提醒中心', component: ReminderCenter },
  ],
  arch: [
    { label: '架构模型编辑器', component: ArchitectureEditor },
  ],
  sim: [
    { label: '仿真控制台', component: SimulationPanel },
  ],
  model: [
    { label: '建模任务板', component: ModelTaskBoard },
  ],
};

export default roleMap;
