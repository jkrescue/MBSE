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
      { version: '2.1', date: '2023-10-27', author: 'Alice', status: 'Published', changes: 'Minor bug fixes.' },
      { version: '2.0', date: '2023-10-26', author: 'Alice', status: 'Published', changes: 'Initial release of version 2.' },
      { version: '1.5', date: '2023-09-15', author: 'Alice', status: 'Archived', changes: 'Deprecated in favor of V2.' },
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
      { version: '1.0', date: '2023-11-05', author: 'Bob', status: 'Pending Review', changes: 'First version for review.' },
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
    description: 'Overall system architecture definition.',
    tags: ['Architecture', 'SysML', 'System'],
    uploader: 'Charlie',
    uploadDate: '2023-11-10',
    status: 'Draft',
    permission: 'Private',
    projectReferences: [],
     interface: {
      inputs: [],
      outputs: [],
    },
    versions: [
      { version: '0.1', date: '2023-11-10', author: 'Charlie', status: 'Draft', changes: 'Initial draft.' },
    ],
    structurePreview: 'SysML_Block_Diagram.svg',
    files: [
        { name: 'SystemArchitecture_Main.sysml', size: '5.8 MB' },
    ]
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
      { version: '1.0', date: '2023-11-12', author: 'Alice', status: 'Published', changes: 'Initial release.' },
    ],
    structurePreview: 'Simulink_Suspension.png',
    files: [
        { name: 'Suspension_Dynamics_V1.slx', size: '3.1 MB' },
    ]
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

export const modelTypes = ['Simulink', 'Modelica', 'SysML', 'Other'];
export const allTags = ['Engine', 'Control System', 'Simulink', 'Battery', 'Thermal', 'Modelica', 'Architecture', 'System', 'Vehicle Dynamics']; 