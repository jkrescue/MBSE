import BpmnModeler from 'bpmn-js/lib/Modeler';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import tokenSimulationModule from 'bpmn-js-token-simulation';
import colorPickerModule from 'bpmn-js-color-picker';
import gridModule from 'diagram-js-grid';
import minimapModule from 'diagram-js-minimap';
import { showNotification, showLoading, hideLoading, createConfirmationModal } from './uiUtils.js';
import { logError } from './logger.js';

export class WorkflowModule {
  constructor() {
    this.modeler = null;
    this.currentDiagram = null;
    this.canvas = document.getElementById('bpmnCanvas');
    this.propertiesPanel = document.getElementById('propertiesPanel');
    this.saveButton = document.getElementById('saveWorkflow');
    this.exportButton = document.getElementById('exportWorkflow');
    this.importButton = document.getElementById('importWorkflow');
    this.newButton = document.getElementById('newWorkflow');
    this.lastSaveTimeElement = document.getElementById('lastSaveTime');
    
    // Enhanced workflow templates
    this.templates = {
      'requirement-review': {
        name: '需求评审流程',
        description: '标准需求评审和确认流程',
        xml: this.getRequirementReviewTemplate()
      },
      'design-verification': {
        name: '设计验证流程',
        description: '设计方案验证和确认流程',
        xml: this.getDesignVerificationTemplate()
      },
      'simulation-analysis': {
        name: '仿真分析流程',
        description: '系统仿真和性能分析流程',
        xml: this.getSimulationAnalysisTemplate()
      }
    };

    // Auto-save interval (5 minutes)
    this.autoSaveInterval = 300000;
  }

  async init() {
    try {
      this.modeler = new BpmnModeler({
        container: this.canvas,
        propertiesPanel: {
          parent: this.propertiesPanel
        },
        additionalModules: [
          propertiesPanelModule,
          tokenSimulationModule,
          colorPickerModule,
          gridModule,
          minimapModule
        ],
        keyboard: {
          bindTo: document
        },
        grid: {
          visible: true
        },
        minimap: {
          open: true
        }
      });

      this.setupEventListeners();
      await this.loadLastWorkflow() || await this.createNewDiagram();
      this.setupTemplatesList();
      this.setupAutoSave();
      
      // Enable token simulation by default
      const tokenSimulation = this.modeler.get('tokenSimulation');
      tokenSimulation.toggleMode();
    } catch (error) {
      logError('WorkflowModule', 'init', error);
      showNotification('工作流模块初始化失败', 'error');
    }
  }

  setupEventListeners() {
    this.saveButton?.addEventListener('click', () => this.saveWorkflow());
    this.exportButton?.addEventListener('click', () => this.exportWorkflow());
    this.importButton?.addEventListener('click', () => this.importWorkflow());
    this.newButton?.addEventListener('click', () => this.showNewDiagramDialog());

    // Enhanced BPMN events handling
    this.modeler.on('element.changed', (event) => {
      const element = event.element;
      const bo = getBusinessObject(element);
      this.updateLastSaveTime('未保存');
      
      // Validate element changes
      if (bo.name && bo.name.length > 50) {
        showNotification('元素名称不应超过50个字符', 'warning');
      }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          this.saveWorkflow();
        } else if (e.key === 'z') {
          e.preventDefault();
          this.modeler.get('commandStack').undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          this.modeler.get('commandStack').redo();
        }
      }
    });
  }

  setupTemplatesList() {
    const templatesList = document.getElementById('workflowTemplates');
    if (!templatesList) return;

    templatesList.innerHTML = ''; // Clear existing templates
    Object.entries(this.templates).forEach(([id, template]) => {
      const item = document.createElement('div');
      item.className = 'p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors workflow-template-item';
      item.innerHTML = `
        <h3 class="font-medium text-gray-900">${template.name}</h3>
        <p class="text-sm text-gray-600 mt-1">${template.description}</p>
        <div class="mt-2 text-xs text-primary">点击加载模板</div>
      `;
      item.addEventListener('click', () => {
        createConfirmationModal(
          '加载模板',
          `确定要加载"${template.name}"模板吗？当前未保存的更改将丢失。`,
          () => this.loadTemplate(id)
        );
      });
      templatesList.appendChild(item);
    });
  }

  setupAutoSave() {
    setInterval(() => {
      if (this.hasUnsavedChanges()) {
        this.saveWorkflow(true); // true for auto-save
      }
    }, this.autoSaveInterval);
  }

  hasUnsavedChanges() {
    return this.lastSaveTimeElement.textContent === '未保存';
  }

  updateLastSaveTime(time = null) {
    if (!time) {
      time = new Date().toLocaleString();
    }
    this.lastSaveTimeElement.textContent = time;
  }

  async createNewDiagram() {
    try {
      const diagramXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                   xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                   id="sample-diagram" 
                   targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="Process_1" isExecutable="true">
    <bpmn2:startEvent id="StartEvent_1" name="开始"/>
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="412" y="240" width="36" height="36"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`;

      await this.modeler.importXML(diagramXML);
      this.modeler.get('canvas').zoom('fit-viewport');
      this.updateLastSaveTime('未保存');
    } catch (error) {
      logError('WorkflowModule', 'createNewDiagram', error);
      showNotification('创建新工作流失败', 'error');
    }
  }

  async loadLastWorkflow() {
    const savedXML = localStorage.getItem('lastWorkflow');
    if (savedXML) {
      try {
        await this.modeler.importXML(savedXML);
        this.modeler.get('canvas').zoom('fit-viewport');
        this.updateLastSaveTime(localStorage.getItem('lastSaveTime') || '未知时间');
        return true;
      } catch (error) {
        logError('WorkflowModule', 'loadLastWorkflow', error);
        return false;
      }
    }
    return false;
  }

  async saveWorkflow(isAutoSave = false) {
    if (!this.hasUnsavedChanges() && isAutoSave) return;

    showLoading();
    try {
      const { xml } = await this.modeler.saveXML({ format: true });
      localStorage.setItem('lastWorkflow', xml);
      localStorage.setItem('lastSaveTime', new Date().toLocaleString());
      this.updateLastSaveTime();
      if (!isAutoSave) {
        showNotification('工作流保存成功', 'success');
      }
    } catch (error) {
      logError('WorkflowModule', 'saveWorkflow', error);
      showNotification('保存工作流失败', 'error');
    } finally {
      hideLoading();
    }
  }

  async exportWorkflow() {
    try {
      const { xml } = await this.modeler.saveXML({ format: true });
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workflow_${new Date().toISOString().slice(0,10)}.bpmn`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('工作流导出成功', 'success');
    } catch (error) {
      logError('WorkflowModule', 'exportWorkflow', error);
      showNotification('导出工作流失败', 'error');
    }
  }

  importWorkflow() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.bpmn,.xml';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      showLoading();
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const xml = event.target.result;
          await this.modeler.importXML(xml);
          this.modeler.get('canvas').zoom('fit-viewport');
          this.updateLastSaveTime('未保存');
          showNotification('工作流导入成功', 'success');
        };
        reader.readAsText(file);
      } catch (error) {
        logError('WorkflowModule', 'importWorkflow', error);
        showNotification('导入工作流失败', 'error');
      } finally {
        hideLoading();
      }
    };
    input.click();
  }

  async loadTemplate(templateId) {
    showLoading();
    try {
      const template = this.templates[templateId];
      if (!template) throw new Error('模板不存在');
      
      await this.modeler.importXML(template.xml);
      this.modeler.get('canvas').zoom('fit-viewport');
      this.updateLastSaveTime('未保存');
      showNotification(`已加载模板: ${template.name}`, 'success');
    } catch (error) {
      logError('WorkflowModule', 'loadTemplate', error);
      showNotification('加载模板失败', 'error');
    } finally {
      hideLoading();
    }
  }

  showNewDiagramDialog() {
    createConfirmationModal(
      '新建工作流',
      '确定要创建新的工作流吗？当前未保存的更改将丢失。',
      () => this.createNewDiagram()
    );
  }

  // Template XML generators
  getRequirementReviewTemplate() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                   xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
                   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                   id="requirement-review"
                   targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="RequirementReviewProcess" name="需求评审流程" isExecutable="true">
    <bpmn2:startEvent id="StartEvent_1" name="开始评审"/>
    <bpmn2:task id="Task_ReviewPreparation" name="评审准备"/>
    <bpmn2:task id="Task_ReviewMeeting" name="评审会议"/>
    <bpmn2:task id="Task_Modification" name="需求修改"/>
    <bpmn2:endEvent id="EndEvent_1" name="评审完成"/>
    <!-- Add more template-specific elements -->
  </bpmn2:process>
</bpmn2:definitions>`;
  }

  getDesignVerificationTemplate() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                   xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
                   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                   id="design-verification"
                   targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="DesignVerificationProcess" name="设计验证流程" isExecutable="true">
    <bpmn2:startEvent id="StartEvent_1" name="开始验证"/>
    <bpmn2:task id="Task_DesignReview" name="设计评审"/>
    <bpmn2:task id="Task_Simulation" name="仿真验证"/>
    <bpmn2:task id="Task_ResultAnalysis" name="结果分析"/>
    <bpmn2:endEvent id="EndEvent_1" name="验证完成"/>
    <!-- Add more template-specific elements -->
  </bpmn2:process>
</bpmn2:definitions>`;
  }

  getSimulationAnalysisTemplate() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                   xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
                   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                   id="simulation-analysis"
                   targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="SimulationAnalysisProcess" name="仿真分析流程" isExecutable="true">
    <bpmn2:startEvent id="StartEvent_1" name="开始仿真"/>
    <bpmn2:task id="Task_ModelPreparation" name="模型准备"/>
    <bpmn2:task id="Task_Simulation" name="仿真执行"/>
    <bpmn2:task id="Task_DataAnalysis" name="数据分析"/>
    <bpmn2:endEvent id="EndEvent_1" name="分析完成"/>
    <!-- Add more template-specific elements -->
  </bpmn2:process>
</bpmn2:definitions>`;
  }
}
</bptAction>