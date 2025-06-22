export const models = [
  {
    id: 'M001',
    name: 'EngineControl_V2',
    type: 'Simulink',
    description: 'A model for controlling the engine fuel injection system. This is the second major version.',
    tags: ['Engine', 'Control System', 'Simulink'],
    uploader: 'Alice',
    uploadDate: '2023-10-26',
    status: 'Published',
    permission: 'Public',
    rating: 5,
    isRecommended: true,
    projectReferences: ['Project_Alpha', 'Project_Beta'],
    interface: {
      inputs: [
        { name: 'engine_speed', type: 'double', unit: 'rpm' },
        { name: 'throttle_position', type: 'double', unit: '%' },
      ],
      outputs: [
        { name: 'fuel_injection_rate', type: 'double', unit: 'g/s' },
      ],
    },
    versions: [
      { version: '2.1', date: '2023-10-27', author: 'Alice', status: 'Published', changes: 'Minor bug fixes.', releaseTag: 'Stable Release',
        qualityMetrics: {
          testCoverage: 95,
          staticCheckScore: 98,
          documentationScore: 90,
          dependencyHealth: 'good',
        },
        workflow: {
          currentStage: 'Published',
          assignedReviewers: { tech: 'David', qa: 'Eve' },
          history: [
            { stage: 'Draft', status: 'Completed', user: 'Alice', date: '2023-10-26 10:00', comment: 'Initial version created.' },
            { stage: 'StaticCheck', status: 'Passed', user: 'AutoBot', date: '2023-10-26 11:00', comment: 'MAAB compliance: 98%. Coverage: 95%.', metrics: { compliance: 98, coverage: 95 } },
            { stage: 'TechnicalReview', status: 'Passed', user: 'David', date: '2023-10-27 09:30', comment: 'Architecture looks solid. Approved for QA.' },
            { stage: 'QATesting', status: 'Passed', user: 'Eve', date: '2023-10-27 14:00', comment: 'All test cases passed.' },
          ]
        },
        dependencies: [
          { modelId: 'M002', version: '1.0' },
          { modelId: 'M004', version: '1.0' }
        ],
        files: [
          { name: 'EngineControl_V2.1.slx', type: 'Simulink', content: '// Simulink binary content (省略)' },
          { name: 'Interface_Spec.pdf', type: 'PDF', content: 'PDF文档内容（省略）' },
          { name: 'Test_Vectors.csv', type: 'CSV', content: 'input,output\n1000,0.5\n2000,0.7' }
        ]
      },
      { version: '2.0', date: '2023-10-26', author: 'Alice', status: 'Archived', changes: 'Initial release of version 2.', releaseTag: 'Feature Complete',
        dependencies: [
          { modelId: 'M002', version: '1.0' }
        ],
        files: [
          { name: 'EngineControl_V2.0.slx', type: 'Simulink', content: '// Simulink binary content (省略)' },
          { name: 'Interface_Spec.pdf', type: 'PDF', content: 'PDF文档内容（省略）' }
        ]
      },
      { version: '1.5', date: '2023-09-15', author: 'Alice', status: 'Archived', changes: 'Deprecated in favor of V2.', releaseTag: null,
        dependencies: [],
        files: [
          { name: 'EngineControl_V1.5.slx', type: 'Simulink', content: '// Simulink binary content (省略)' }
        ]
      },
    ],
    changeLog: [
      { date: '2023-10-27 11:00', user: 'Alice', action: '创建版本', details: '创建了版本 v2.1' },
      { date: '2023-10-26 09:30', user: 'Alice', action: '创建版本', details: '创建了版本 v2.0' },
      { date: '2023-09-15 14:00', user: 'Alice', action: '创建版本', details: '创建了版本 v1.5' },
    ],
    structurePreview: 'Simulink_Topology_Diagram.png', // Placeholder for a graphical preview
    files: [
        { name: 'EngineControl_V2.1.slx', size: '2.5 MB' },
        { name: 'Interface_Spec.pdf', size: '500 KB' },
        { name: 'Test_Vectors.csv', size: '1.2 MB' },
    ]
  },
  {
    id: 'M002',
    name: 'BatteryThermalModel',
    type: 'Modelica',
    description: 'Thermal model for the main battery pack.',
    tags: ['Battery', 'Thermal', 'Modelica'],
    uploader: 'Bob',
    uploadDate: '2023-11-05',
    status: 'Pending Review',
    permission: 'Project-Authorized',
    rating: 4,
    isRecommended: false,
    projectReferences: ['Project_Gamma'],
    interface: {
      inputs: [
        { name: 'ambient_temp', type: 'double', unit: 'Celsius' },
        { name: 'current_draw', type: 'double', unit: 'A' },
      ],
      outputs: [
        { name: 'battery_temp', type: 'double', unit: 'Celsius' },
      ],
    },
    versions: [
      { version: '1.0', date: '2023-11-05', author: 'Bob', status: 'Pending Review', changes: 'First version for review.', releaseTag: 'Beta Test',
        qualityMetrics: {
          testCoverage: 80,
          staticCheckScore: 85,
          documentationScore: 75,
          dependencyHealth: 'good',
        },
        workflow: {
          currentStage: 'TechnicalReview',
          assignedReviewers: { tech: 'David', qa: 'Eve' },
          history: [
            { stage: 'Draft', status: 'Completed', user: 'Bob', date: '2023-11-05 15:00', comment: 'Initial version for review.' },
            { stage: 'StaticCheck', status: 'Passed', user: 'AutoBot', date: '2023-11-05 16:00', comment: 'MAAB compliance: 85%. Coverage: 80%.', metrics: { compliance: 85, coverage: 80 } }
          ]
        },
        dependencies: [
          { modelId: 'M004', version: '0.5' }
        ],
        files: [
          { name: 'BatteryThermalModel_V1.0.mo', type: 'Modelica', content: 'model BatteryThermalModel\n  parameter Real C = 1000;\n  Real T(start=25);\nequation\n  der(T) = (ambient_temp - T)/C + current_draw*0.1;\nend BatteryThermalModel;' },
          { name: 'Documentation.docx', type: 'DOCX', content: '文档内容（省略）' }
        ]
      },
    ],
    changeLog: [
      { date: '2023-11-05 15:00', user: 'Bob', action: '创建版本', details: '创建了版本 v1.0' },
    ],
    structurePreview: 'Modelica_Structure.png',
     files: [
        { name: 'BatteryThermalModel_V1.0.mo', size: '800 KB' },
        { name: 'Documentation.docx', size: '2.1 MB' },
    ]
  },
  {
    id: 'M003',
    name: 'SystemArchitecture_Main',
    type: 'SysML',
    description: '一个高级驾驶辅助系统 (ADAS) 的体系结构模型。',
    tags: ['Architecture', 'SysML', 'ADAS'],
    uploader: 'Charlie',
    uploadDate: '2023-11-10',
    status: 'Published',
    permission: 'Project-Authorized',
    rating: 4,
    isRecommended: false,
    projectReferences: ['Project_ADAS'],
     interface: {
      inputs: [],
      outputs: [],
    },
    versions: [
      { 
        version: '0.2', 
        date: '2023-11-15', 
        author: 'Charlie', 
        status: 'Published', 
        changes: '删除了Block A，增加了Activity BAction，以反映新的需求。',
        releaseTag: 'Internal Build',
        qualityMetrics: {
          testCoverage: 0,
          staticCheckScore: 90,
          documentationScore: 60,
          dependencyHealth: 'warning',
        },
        workflow: {
          currentStage: 'Draft',
          assignedReviewers: { tech: 'David', qa: 'Eve' },
          history: [
            { stage: 'Draft', status: 'Completed', user: 'Charlie', date: '2023-11-15 18:00', comment: 'Ready for review' },
            { stage: 'StaticCheck', status: 'Passed', user: 'AutoBot', date: '2023-11-15 19:00', comment: 'SysML validation passed. Compliance: 90%.', metrics: { compliance: 90, coverage: null } },
            { stage: 'TechnicalReview', status: 'Passed', user: 'David', date: '2023-11-16 11:00', comment: 'LGTM.' },
            { stage: 'QATesting', status: 'Failed', user: 'Eve', date: '2023-11-16 17:00', comment: 'Found critical issue in BAction activity. It does not handle edge case XYZ. Please fix.' },
          ],
          actionItems: [
            "Fix critical issue in BAction activity regarding edge case XYZ."
          ]
        },
        dependencies: [],
        files: [
          { 
            name: 'SystemArchitecture_V0.2.xml', 
            type: 'SysML-XML', 
            content: `<SysMLModel name="SystemArchitecture_Main" version="0.2">
  <OwnedElement>
    <Package name="SystemBlocks">
      <Block name="MainController">
        <Port name="in" direction="in"/>
        <Port name="out" direction="out"/>
      </Block>
      <Block name="Sensor">
        <Port name="dataOut" direction="out"/>
      </Block>
    </Package>
    <Package name="SystemActivities">
      <Activity name="BAction">
        <Action name="step1" description="Initialize sensors."/>
        <Action name="step2" description="Process data."/>
      </Activity>
    </Package>
  </OwnedElement>
</SysMLModel>` 
          }
        ]
      },
      { 
        version: '0.1', 
        date: '2023-11-10', 
        author: 'Charlie', 
        status: 'Archived', 
        changes: '初始草稿，包含了核心的控制器和传感器模块，以及一个测试块A。',
        releaseTag: null,
        dependencies: [],
        files: [
          { 
            name: 'SystemArchitecture_V0.1.xml', 
            type: 'SysML-XML', 
            content: `<SysMLModel name="SystemArchitecture_Main" version="0.1">
  <OwnedElement>
    <Package name="SystemBlocks">
      <Block name="MainController">
        <Port name="in" direction="in"/>
        <Port name="out" direction="out"/>
      </Block>
      <Block name="Sensor">
        <Port name="dataOut" direction="out"/>
      </Block>
      <Block name="A">
        <OwnedAttribute name="prop1" type="Real"/>
        <OwnedOperation name="doSomething"/>
      </Block>
    </Package>
    <Package name="SystemActivities">
      <!-- No activities in this version -->
    </Package>
  </OwnedElement>
</SysMLModel>`
          }
        ]
      },
    ],
    changeLog: [
        { date: '2023-11-15 18:00', user: 'Charlie', action: '创建版本', details: '创建了版本 v0.2' },
        { date: '2023-11-10 12:00', user: 'Charlie', action: '创建版本', details: '创建了版本 v0.1' },
    ],
    structurePreview: 'SysML_Block_Diagram.svg',
    files: []
  },
    {
    id: 'M004',
    name: 'Suspension_Dynamics',
    type: 'Simulink',
    description: 'A quarter-car model for suspension system analysis and tuning.',
    tags: ['Suspension', 'Simulink', 'Dynamics'],
    uploader: 'David',
    uploadDate: '2023-11-20',
    status: 'In Progress',
    permission: 'Private',
    rating: 3,
    isRecommended: false,
    projectReferences: ['Project_Beta'],
     interface: {
      inputs: [
        { name: 'road_profile', type: 'double', unit: 'm' },
      ],
      outputs: [
        { name: 'body_acceleration', type: 'double', unit: 'm/s^2' },
        { name: 'wheel_deflection', type: 'double', unit: 'm' },
      ],
    },
    versions: [
      { version: '0.5', date: '2023-11-20', author: 'David', status: 'In Progress', changes: 'Initial setup of the quarter-car model.', releaseTag: null,
        dependencies: [],
        files: [
          { name: 'Suspension_V0.5.slx', type: 'Simulink', content: '// Simulink binary content (省略)' }
        ]
      },
    ],
    changeLog: [],
    structurePreview: 'Simulink_Topology_Diagram.png',
    files: [],
    tags: ['Suspension', 'Simulink', 'Dynamics']
  },
  {
    id: 'M005',
    name: 'Vehicle_Dynamics_Model',
    type: 'Simulink',
    description: '整车动力学模型，用于仿真车辆的操控和稳定性。',
    tags: ['Dynamics', 'Simulink', 'Vehicle'],
    uploader: 'frank',
    uploadDate: '2024-01-10',
    status: 'Published',
    permission: 'Public',
    rating: 5,
    isRecommended: true,
    projectReferences: ['Project_Omega'],
    interface: {
      inputs: [{ name: 'steering_wheel_angle', type: 'double', unit: 'deg' }, { name: 'brake_pedal_pos', type: 'double', unit: '%' }],
      outputs: [{ name: 'vehicle_speed', type: 'double', unit: 'kph' }, { name: 'lateral_acceleration', type: 'double', unit: 'g' }]
    },
    versions: [
      {
        version: '1.2', date: '2024-01-20', author: 'frank', status: 'Published', changes: '优化了轮胎模型，提升了高频响应的准确性。',
        files: [
          { name: 'Vehicle_Dynamics_V1.2.slx', content: '// Simulink model content...\\n// Added TireModel_V3 block.' },
          { name: 'config_v1.2.m', content: 'params.tire_model = "Pacejka_2002_Optimized";' }
        ]
      },
      {
        version: '1.1', date: '2024-01-15', author: 'frank', status: 'Archived', changes: '修正了空气动力学系数的错误。',
        files: [
          { name: 'Vehicle_Dynamics_V1.1.slx', content: '// Simulink model content...\\n// Using TireModel_V2 block.' },
          { name: 'config_v1.1.m', content: 'params.aero_drag_coeff = 0.28;\\nparams.tire_model = "Pacejka_2002";' }
        ]
      },
      {
        version: '1.0', date: '2024-01-10', author: 'frank', status: 'Archived', changes: '初始版本，包含基本悬挂和动力总成。',
        files: [
          { name: 'Vehicle_Dynamics_V1.0.slx', content: '// Simulink model content...\\n// Initial structure' },
          { name: 'config_v1.0.m', content: 'params.aero_drag_coeff = 0.32;\\nparams.tire_model = "Pacejka_Simple";' }
        ]
      }
    ],
    changeLog: [{ date: '2024-01-20', user: 'frank', action: '创建版本', details: 'v1.2' }],
    tags: ['Dynamics', 'Simulink', 'Vehicle'],
    structurePreview: 'Simulink_Topology_Diagram.png',
    files: [
      { name: 'Vehicle_Dynamics_V1.2.slx', size: '3.1 MB' },
      { name: 'config_v1.2.m', size: '2 KB' }
    ]
  },
  {
    id: 'M006',
    name: 'Radar_Signal_Processing',
    type: 'SysML',
    description: '毫米波雷达信号处理算法的架构模型。',
    tags: ['Radar', 'Signal Processing', 'SysML'],
    uploader: 'eve',
    uploadDate: '2024-02-01',
    status: 'Published',
    permission: 'Project-Authorized',
    rating: 4,
    isRecommended: false,
    projectReferences: ['Project_ADAS_Gen2'],
    interface: { inputs: [], outputs: [] },
    versions: [
      {
        version: '2.0', date: '2024-02-10', author: 'eve', status: 'Published', changes: '重构了滤波器模块，新增了目标跟踪活动。',
        files: [{
          name: 'RadarArch_V2.0.xml',
          type: 'SysML-XML',
          content: JSON.stringify(`<SysMLModel name="RadarSignalProcessing" version="2.0">
  <OwnedElement>
    <Package name="Filters">
      <Block name="KalmanFilter"/>
    </Package>
    <Package name="Trackers">
      <Block name="MultiTargetTracker"/>
    </Package>
    <Package name="SystemActivities">
      <Activity name="TrackTargets"/>
    </Package>
  </OwnedElement>
</SysMLModel>`, null, 2)
        }]
      },
      {
        version: '1.0', date: '2024-02-01', author: 'eve', status: 'Archived', changes: '初始架构，包含基本的信号采集和FFT处理。',
        files: [{
          name: 'RadarArch_V1.0.xml',
          type: 'SysML-XML',
          content: JSON.stringify(`<SysMLModel name="RadarSignalProcessing" version="1.0">
  <OwnedElement>
    <Package name="SignalChain">
      <Block name="ADC"/>
      <Block name="FFT"/>
    </Package>
  </OwnedElement>
</SysMLModel>`, null, 2)
        }]
      }
    ],
    changeLog: [{ date: '2024-02-10', user: 'eve', action: '创建版本', details: 'v2.0' }],
    tags: ['Radar', 'Signal Processing', 'SysML'],
    structurePreview: 'SysML_Block_Diagram.svg',
    files: [{ name: 'RadarArch_V2.0.xml', size: '12 KB' }]
  },
  {
    id: 'M007',
    name: 'Power_Management_Unit',
    type: 'Simulink',
    description: '电源管理单元（PMU）的控制逻辑模型。',
    tags: ['Power', 'Control', 'ECU'],
    uploader: 'Alice',
    uploadDate: '2024-02-15 08:00:00',
    status: 'Pending Review',
    permission: 'Private',
    rating: 3,
    isRecommended: false,
    projectReferences: ['Project_Beta'],
    interface: {
      inputs: [{ name: 'v_batt', type: 'double', unit: 'V' }, { name: 'load_request', type: 'enum', values: ['low', 'medium', 'high'] }],
      outputs: [{ name: 'output_voltage', type: 'double', unit: 'V' }]
    },
    versions: [
      {
        version: '0.9', date: '2024-02-20', author: 'Alice', status: 'Pending Review', changes: '增加了过压保护逻辑。',
        files: [{ name: 'PMU_V0.9.slx', content: '// Added over-voltage protection circuit.' }],
        interface: { // 版本特定的接口覆盖
          inputs: [{ name: 'v_batt', type: 'double', unit: 'V' }, { name: 'load_request', type: 'enum', values: ['low', 'medium', 'high'] }, { name: 'ovp_threshold', type: 'double', unit: 'V' }],
          outputs: [{ name: 'output_voltage', type: 'double', unit: 'V' }, { name: 'status_flag', type: 'uint8' }]
        }
      },
      {
        version: '0.8', date: '2024-02-15', author: 'Alice', status: 'Archived', changes: '基础功能实现，支持三种负载模式。',
        files: [{ name: 'PMU_V0.8.slx', content: '// Basic functionality for load management.' }]
      }
    ],
    changeLog: [{ date: '2024-02-20', user: 'Alice', action: '创建版本', details: 'v0.9' }],
    tags: ['Power', 'Control', 'ECU'],
    structurePreview: 'Simulink_Topology_Diagram.png',
    files: [{ name: 'PMU_V0.9.slx', size: '980 KB' }]
  },
  {
    id: 'M008',
    name: 'Bob_Private_SysML_ClimateControl',
    type: 'SysML',
    description: 'Bob的私有SysML模型，用于座舱气候控制系统架构。',
    tags: ['SysML', 'HVAC', 'Private'],
    uploader: 'Bob',
    uploadDate: '2024-03-01',
    status: 'Draft',
    permission: 'Private',
    rating: 0,
    isRecommended: false,
    projectReferences: [],
    interface: { inputs: [], outputs: [] },
    versions: [
      { version: '0.1', date: '2024-03-01', author: 'Bob', status: 'Draft', changes: '初始架构草稿。', files: [{name: 'Climate_Control.xml', content: '<SysML></SysML>'}] }
    ],
    changeLog: [],
    structurePreview: 'SysML_Block_Diagram.svg',
    files: [{ name: 'Climate_Control.xml', size: '15 KB' }]
  },
  {
    id: 'M009',
    name: 'Bob_Private_Simulink_ABS',
    type: 'Simulink',
    description: 'Bob的私有Simulink模型，用于ABS防抱死系统逻辑仿真。',
    tags: ['Simulink', 'ABS', 'Control', 'Private'],
    uploader: 'Bob',
    uploadDate: '2024-03-05',
    status: 'In Progress',
    permission: 'Private',
    rating: 0,
    isRecommended: false,
    projectReferences: [],
    interface: { inputs: [], outputs: [] },
    versions: [
      { version: '0.2', date: '2024-03-05', author: 'Bob', status: 'In Progress', changes: '添加了轮速传感器模块。', files: [{name: 'ABS_control.slx', content: '// Simulink content'}] }
    ],
    changeLog: [],
    structurePreview: 'Simulink_Topology_Diagram.png',
    files: [{ name: 'ABS_control.slx', size: '1.2 MB' }]
  },
  {
    id: 'M010',
    name: 'Bob_Private_FMU_Engine',
    type: 'FMU/SSP',
    description: 'Bob的私有FMU模型，一个导出的发动机模型，用于集成测试。',
    tags: ['FMU', 'Engine', 'Integration', 'Private'],
    uploader: 'Bob',
    uploadDate: '2024-03-10',
    status: 'Published',
    permission: 'Private',
    rating: 0,
    isRecommended: false,
    projectReferences: ['Project_Gamma'],
    interface: { inputs: [], outputs: [] },
    versions: [
      { version: '1.0', date: '2024-03-10', author: 'Bob', status: 'Published', changes: '导出为FMU 2.0 Co-simulation。', files: [{name: 'Engine_CS.fmu', content: '// FMU binary content'}] }
    ],
    changeLog: [],
    structurePreview: '',
    files: [{ name: 'Engine_CS.fmu', size: '5.5 MB' }]
  }
];

export const users = {
    'Alice': { role: 'Engineer' },
    'Bob': { role: 'Engineer' },
    'Charlie': { role: 'Engineer' },
    'David': { role: 'Architect/Reviewer' },
    'Eve': { role: 'Project Manager' },
    'Frank': { role: 'Administrator' },
};

export const modelTypes = ['All Types', 'Simulink', 'Modelica', 'SysML', 'FMU/SSP', 'Other'];
export const statusOptions = ['All Statuses', 'Published', 'Pending Review', 'Draft', 'Rejected', 'Archived'];
export const allTags = [
  'core-component',
  'battery-management',
  'self-developed',
  'powertrain',
  'thermal',
  'control-logic',
  'standard-lib',
  'Engine',
  'Control System',
  'Simulink',
  'Battery',
  'Modelica',
  'Architecture',
  'System',
  'Vehicle Dynamics',
]; 