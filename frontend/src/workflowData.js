export const initialNodes = [
  {
    id: 'N1',
    position: { x: 0, y: 0 },
    data: {
      label: '需求管理与同步',
      active: true,
      subNodes: [
        { id: 'link', label: '链接需求服务', active: true, required: true, tool: 'Polarion', url: 'https://polarion.example.com', desc: '创建与Polarion或Doors的同步关系' },
        { id: 'create', label: '需求创建', active: true, required: true, tool: 'Polarion', desc: '导入文档或livedoc新建' },
        { id: 'edit', label: '需求编辑', active: false, required: false, tool: 'Polarion' },
        { id: 'review', label: '需求评审', active: false, required: false, tool: 'Polarion' },
        { id: 'flow', label: '需求流转', active: false, required: false, tool: 'EA', desc: '同步到EA' }
      ],
      subEdges: [
        { id: 'link-create', source: 'link', target: 'create' },
        { id: 'create-edit', source: 'create', target: 'edit' },
        { id: 'edit-review', source: 'edit', target: 'review' },
        { id: 'review-flow', source: 'review', target: 'flow' }
      ]
    }
  },
  {
    id: 'N2',
    position: { x: 250, y: 0 },
    data: {
      label: '功能与架构设计',
      active: true,
      subNodes: [
        { id: 'sync', label: '同步需求', active: true, required: true, tool: 'EA' },
        { id: 'design', label: '功能与架构设计', active: true, required: true, tool: 'EA' },
        { id: 'review', label: '系统架构评审', active: false, required: false, tool: 'WebCollaboration' },
        { id: 'publish', label: '模型发布', active: false, required: false, tool: 'EA' }
      ],
      subEdges: [
        { id: 'sync-design', source: 'sync', target: 'design' },
        { id: 'design-review', source: 'design', target: 'review' },
        { id: 'review-publish', source: 'review', target: 'publish' }
      ]
    }
  },
  {
    id: 'N3',
    position: { x: 500, y: 0 },
    data: {
      label: '系统集成和仿真',
      active: true,
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
      ],
      subEdges: [
        { id: 'import-dispatch', source: 'import', target: 'dispatch' },
        { id: 'dispatch-upload', source: 'dispatch', target: 'upload' },
        { id: 'upload-instantiate', source: 'upload', target: 'instantiate' },
        { id: 'instantiate-config', source: 'instantiate', target: 'config' },
        { id: 'config-doe', source: 'config', target: 'doe' },
        { id: 'doe-schedule', source: 'doe', target: 'schedule' },
        { id: 'schedule-preview', source: 'schedule', target: 'preview' },
        { id: 'preview-review', source: 'preview', target: 'review' },
        { id: 'review-report', source: 'review', target: 'report' },
        { id: 'report-archive', source: 'report', target: 'archive' }
      ]
    }
  },
  {
    id: 'N4',
    position: { x: 750, y: 0 },
    data: {
      label: '设计追溯',
      active: true,
      subNodes: [
        { id: 'trace', label: '建立追溯关系链', active: true, required: true },
        { id: 'analysis', label: '需求覆盖度分析', active: false, required: false }
      ],
      subEdges: [
        { id: 'trace-analysis', source: 'trace', target: 'analysis' }
      ]
    }
  }
];

export const initialEdges = [
  { id: 'e1-2', source: 'N1', target: 'N2' },
  { id: 'e2-3', source: 'N2', target: 'N3' },
  { id: 'e3-4', source: 'N3', target: 'N4' }
];
