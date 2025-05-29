// Mock data for the MBSE application
const mbseData = {
  requirements: [
    {
      id: 'R001',
      name: '整车舒适性要求',
      status: 'approved',
      owner: '张工',
      version: 'v1.2',
      description: '确保车内温度控制在18-26°C范围内',
      priority: 'high'
    },
    {
      id: 'R002',
      name: '热能回收效率',
      status: 'pending',
      owner: '李工',
      version: 'v1.0',
      description: '热能回收效率需达到85%以上',
      priority: 'medium'
    },
    {
      id: 'R003',
      name: '响应时间要求',
      status: 'review',
      owner: '王工',
      version: 'v1.1',
      description: '系统响应时间不超过3秒',
      priority: 'high'
    },
    {
      id: 'R004',
      name: '能耗控制',
      status: 'approved',
      owner: '赵工',
      version: 'v2.0',
      description: '空调系统能耗不超过2.5kW',
      priority: 'high'
    },
  ],

  architecture: [
    {
      functionName: '冷却控制',
      module: '控制器A',
      description: '调节冷却循环',
      status: 'active'
    },
    {
      functionName: '车内温度监测',
      module: '传感器模块',
      description: '实时采集车内热信息',
      status: 'active'
    },
  ],
  
  // Functional blocks to be dynamically generated based on config
  functionalBlocks: [ 
    { id: 'FB1', name: '功能块 1', status: '模拟', description: '自动生成的功能块' },
    { id: 'FB2', name: '功能块 2', status: '模拟', description: '自动生成的功能块' },
    { id: 'FB3', name: '功能块 3', status: '模拟', description: '自动生成的功能块' },
    { id: 'FB4', name: '功能块 4', status: '模拟', description: '自动生成的功能块' },
    { id: 'FB5', name: '功能块 5', status: '模拟', description: '自动生成的功能块' },
  ],
  
  // Interface data to be updated on (mock) file upload
  interfaceDefinitions: {
    fileName: null,
    contentPreview: null,
    size: 0,
    lines: 0
  },

  traceability: [ // This will be more dynamically generated/updated
    {
      reqId: 'R001',
      functionModule: '温控策略 (FB1)',
      modelName: 'cooling_controller.mo',
      verificationMethod: 'Simulink仿真',
      status: 'passed'
    },
    {
      reqId: 'R002',
      functionModule: '能源回收 (FB2)',
      modelName: 'battery_model.fmu',
      verificationMethod: '测试用例 RT-12',
      status: 'passed'
    },
  ],

  systemStatus: { // Will be updated dynamically
    requirementCount: 4, // Initial count based on sample data
    modelCount: 5, // Example
    verificationPassed: 3,
    verificationTotal: 4
  },

  // For Mermaid graph generation in traceability
  traceabilityGraphLinks: [ // Example structure
    // { source: 'R001', target: 'FB1', label: 'implements' },
    // { source: 'FB1', target: 'M001_CoolingController', label: 'realized by' },
    // { source: 'M001_CoolingController', target: 'V001_Simulink', label: 'verified by' },
  ]
};

export { mbseData };
