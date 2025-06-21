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
      { version: '2.1', date: '2023-10-27', author: 'Alice', status: 'Published', changes: 'Minor bug fixes.',
        files: [
          { name: 'EngineControl_V2.1.slx', type: 'Simulink', content: '// Simulink binary content (省略)' },
          { name: 'Interface_Spec.pdf', type: 'PDF', content: 'PDF文档内容（省略）' },
          { name: 'Test_Vectors.csv', type: 'CSV', content: 'input,output\n1000,0.5\n2000,0.7' }
        ]
      },
      { version: '2.0', date: '2023-10-26', author: 'Alice', status: 'Published', changes: 'Initial release of version 2.',
        files: [
          { name: 'EngineControl_V2.0.slx', type: 'Simulink', content: '// Simulink binary content (省略)' },
          { name: 'Interface_Spec.pdf', type: 'PDF', content: 'PDF文档内容（省略）' }
        ]
      },
      { version: '1.5', date: '2023-09-15', author: 'Alice', status: 'Archived', changes: 'Deprecated in favor of V2.',
        files: [
          { name: 'EngineControl_V1.5.slx', type: 'Simulink', content: '// Simulink binary content (省略)' }
        ]
      },
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
      { version: '1.0', date: '2023-11-05', author: 'Bob', status: 'Pending Review', changes: 'First version for review.',
        files: [
          { name: 'BatteryThermalModel_V1.0.mo', type: 'Modelica', content: 'model BatteryThermalModel\n  parameter Real C = 1000;\n  Real T(start=25);\nequation\n  der(T) = (ambient_temp - T)/C + current_draw*0.1;\nend BatteryThermalModel;' },
          { name: 'Documentation.docx', type: 'DOCX', content: '文档内容（省略）' }
        ]
      },
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
    structurePreview: 'SysML_Block_Diagram.svg',
    files: []
  },
    {
    id: 'M004',
    name: 'Suspension_Dynamics',
    type: 'Simulink',
    description: 'Vehicle suspension dynamics simulation model.',
    tags: ['Vehicle Dynamics', 'Control System', 'Simulink'],
    uploader: 'Alice',
    uploadDate: '2023-11-12',
    status: 'Published',
    permission: 'Public',
    projectReferences: ['Project_Alpha', 'Project_Delta'],
    interface: {
      inputs: [
        { name: 'road_profile', type: 'array', unit: 'm' },
        { name: 'vehicle_speed', type: 'double', unit: 'km/h' },
      ],
      outputs: [
        { name: 'body_acceleration', type: 'double', unit: 'm/s^2' },
        { name: 'wheel_travel', type: 'double', unit: 'm' },
      ],
    },
    versions: [
      { version: '1.0', date: '2023-11-12', author: 'Alice', status: 'Published', changes: 'Initial release.',
        files: [
          { name: 'Suspension_Dynamics_V1.slx', type: 'Simulink', content: '// Simulink binary content (省略)' }
        ]
      },
    ],
    structurePreview: 'Simulink_Suspension.png',
    files: [
        { name: 'Suspension_Dynamics_V1.slx', size: '3.1 MB' },
    ]
  },
  // Alice更多个人模型
  {
    id: 'P007',
    name: 'Alice_Private_Pending_Model',
    type: 'SysML',
    description: 'Alice的待审核SysML模型，仅自己可见。',
    tags: ['SysML', 'Pending'],
    uploader: 'Alice',
    uploadDate: '2023-11-21',
    status: 'Pending Review',
    permission: 'Private',
    projectReferences: [],
    interface: { inputs: [], outputs: [] },
    versions: [
      { version: '0.2', date: '2023-11-21', author: 'Alice', status: 'Pending Review', changes: '待审核。', files: [] }
    ],
    structurePreview: '',
    files: []
  },
  {
    id: 'P008',
    name: 'Alice_Private_Published_Model',
    type: 'Modelica',
    description: 'Alice的已发布Modelica模型，仅自己可见。',
    tags: ['Modelica', 'Published'],
    uploader: 'Alice',
    uploadDate: '2023-11-22',
    status: 'Published',
    permission: 'Private',
    projectReferences: [],
    interface: { inputs: [], outputs: [] },
    versions: [
      { version: '1.0', date: '2023-11-22', author: 'Alice', status: 'Published', changes: '正式发布。', files: [] }
    ],
    structurePreview: '',
    files: []
  },
  // Bob更多个人模型
  {
    id: 'P009',
    name: 'Bob_Private_Draft_Model2',
    type: 'Simulink',
    description: 'Bob的第二个草稿模型，仅自己可见。',
    tags: ['Simulink', 'Draft'],
    uploader: 'Bob',
    uploadDate: '2023-11-23',
    status: 'Draft',
    permission: 'Private',
    projectReferences: [],
    interface: { inputs: [], outputs: [] },
    versions: [
      { version: '0.1', date: '2023-11-23', author: 'Bob', status: 'Draft', changes: '初始草稿。', files: [] }
    ],
    structurePreview: '',
    files: []
  },
  {
    id: 'P010',
    name: 'Bob_Private_Archived_Model2',
    type: 'Modelica',
    description: 'Bob的第二个归档模型，仅自己可见。',
    tags: ['Modelica', 'Archived'],
    uploader: 'Bob',
    uploadDate: '2023-11-24',
    status: 'Archived',
    permission: 'Private',
    projectReferences: [],
    interface: { inputs: [], outputs: [] },
    versions: [
      { version: '1.0', date: '2023-11-24', author: 'Bob', status: 'Archived', changes: '归档。', files: [] }
    ],
    structurePreview: '',
    files: []
  },
  // Charlie更多个人模型
  {
    id: 'P011',
    name: 'Charlie_Private_Pending_Model2',
    type: 'SysML',
    description: 'Charlie的第二个待审核模型，仅自己可见。',
    tags: ['SysML', 'Pending'],
    uploader: 'Charlie',
    uploadDate: '2023-11-25',
    status: 'Pending Review',
    permission: 'Private',
    projectReferences: [],
    interface: { inputs: [], outputs: [] },
    versions: [
      { version: '0.2', date: '2023-11-25', author: 'Charlie', status: 'Pending Review', changes: '待审核。', files: [] }
    ],
    structurePreview: '',
    files: []
  },
  {
    id: 'P012',
    name: 'Charlie_Private_Archived_Model2',
    type: 'Simulink',
    description: 'Charlie的第二个归档模型，仅自己可见。',
    tags: ['Simulink', 'Archived'],
    uploader: 'Charlie',
    uploadDate: '2023-11-26',
    status: 'Archived',
    permission: 'Private',
    projectReferences: [],
    interface: { inputs: [], outputs: [] },
    versions: [
      { version: '1.0', date: '2023-11-26', author: 'Charlie', status: 'Archived', changes: '归档。', files: [] }
    ],
    structurePreview: '',
    files: []
  },
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