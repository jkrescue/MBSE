export const initialNodes = [
  {
    id: 'N1',
    position: { x: 0, y: 0 },
    data: {
      label: '需求管理与同步',
      active: true,
      status: 'pending',
      subNodes: [
        { id: 'link', label: '链接需求服务', active: true, required: true },
        { id: 'create', label: '需求创建', active: true, required: true },
        { id: 'edit', label: '需求编辑', active: false, required: false },
        { id: 'review', label: '需求评审', active: false, required: false },
        { id: 'flow', label: '需求流转', active: false, required: false }
      ]
    }
  },
  {
    id: 'N2',
    position: { x: 250, y: 0 },
    data: {
      label: '功能与架构设计',
      active: true,
      status: 'pending',
      subNodes: [
        { id: 'sync', label: '同步需求', active: true, required: true },
        { id: 'design', label: '功能与架构设计', active: true, required: true },
        { id: 'review', label: '系统架构评审', active: false, required: false },
        { id: 'publish', label: '模型发布', active: false, required: false }
      ]
    }
  },
  {
    id: 'N3',
    position: { x: 500, y: 0 },
    data: {
      label: '系统集成和仿真',
      active: true,
      status: 'pending',
      subNodes: [
        { id: 'import', label: '系统架构录入', active: true, required: true },
        { id: 'dispatch', label: '模型派发配置', active: true, required: true },
        { id: 'upload', label: '模型上传与校验', active: false, required: false },
        { id: 'instantiate', label: '模型实例生成', active: false, required: false },
        { id: 'config', label: '方案参数配置', active: true, required: true },
        { id: 'doe', label: '设计变量与DOE设置', active: false, required: false },
        { id: 'schedule', label: '仿真任务调度', active: true, required: true },
        { id: 'preview', label: '结果预览与KPI分析', active: false, required: false },
        { id: 'review', label: '系统模型评审', active: false, required: false },
        { id: 'report', label: '权衡分析报告输出', active: false, required: false },
        { id: 'archive', label: '评审结论与归档', active: false, required: false }
      ]
    }
  },
  {
    id: 'N4',
    position: { x: 750, y: 0 },
    data: {
      label: '设计追溯',
      active: true,
      status: 'pending',
      subNodes: [
        { id: 'trace', label: '建立追溯关系链', active: true, required: true },
        { id: 'analysis', label: '需求覆盖度分析', active: false, required: false }
      ]
    }
  }
];

export const initialEdges = [
  { id: 'e1-2', source: 'N1', target: 'N2' },
  { id: 'e2-3', source: 'N2', target: 'N3' },
  { id: 'e3-4', source: 'N3', target: 'N4' }
];
