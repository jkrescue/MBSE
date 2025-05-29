import BpmnModeler from 'bpmn-js/lib/Modeler';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import { showNotification, showLoading, hideLoading } from './uiUtils.js';
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
    
    // Workflow templates
    this.templates = {
      'requirement-review': {
        name: '需求评审流程',
        description: '标准需求评审和确认流程'
      },
      'design-verification': {
        name: '设计验证流程',
        description: '设计方案验证和确认流程'
      },
      'simulation-analysis': {
        name: '仿真分析流程',
        description: '系统仿真和性能分析流程'
      }
    };
  }

  async init() {
    try {
      this.modeler = new BpmnModeler({
        container: this.canvas,
        propertiesPanel: {
          parent: this.propertiesPanel
        },
        additionalModules: [
          propertiesPanelModule
        ],
        keyboard: {
          bindTo: document
        }
      });

      this.setupEventListeners();
      await this.createNewDiagram();
      this.setupTemplatesList();
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

    // Listen for BPMN events
    this.modeler.on('element.changed', (event) => {
      const element = event.element;
      const bo = getBusinessObject(element);
      console.log('Element changed:', bo.id, bo.name);
      // 可以在这里添加更多的元素变更处理逻辑
    });
  }

  setupTemplatesList() {
    const templatesList = document.getElementById('workflowTemplates');
    if (!templatesList) return;

    Object.entries(this.templates).forEach(([id, template]) => {
      const item = document.createElement('div');
      item.className = 'p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors';
      item.innerHTML = `
        <h3 class="font-medium text-gray-900">${template.name}</h3>
        <p class="text-sm text-gray-600">${template.description}</p>
      `;
      item.addEventListener('click', () => this.loadTemplate(id));
      templatesList.appendChild(item);
    });
  }

  async createNewDiagram() {
    try {
      const diagramXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                   xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                   id="sample-diagram" 
                   targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="Process_1" isExecutable="false">
    <bpmn2:startEvent id="StartEvent_1"/>
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
    } catch (error) {
      logError('WorkflowModule', 'createNewDiagram', error);
      showNotification('创建新工作流失败', 'error');
    }
  }

  async saveWorkflow() {
    showLoading();
    try {
      const { xml } = await this.modeler.saveXML({ format: true });
      localStorage.setItem('lastWorkflow', xml);
      showNotification('工作流保存成功', 'success');
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
      // 这里应该从服务器加载模板，现在用模拟数据
      const template = this.templates[templateId];
      if (!template) throw new Error('模板不存在');
      
      // 模拟加载模板
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.createNewDiagram(); // 暂时只创建新图
      showNotification(`已加载模板: ${template.name}`, 'success');
    } catch (error) {
      logError('WorkflowModule', 'loadTemplate', error);
      showNotification('加载模板失败', 'error');
    } finally {
      hideLoading();
    }
  }

  showNewDiagramDialog() {
    // 可以添加创建新图时的配置对话框
    this.createNewDiagram();
  }
}