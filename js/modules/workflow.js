import { showGenericModal, hideGenericModal, showNotification, showLoading, hideLoading } from '../uiUtils.js';
import { logError } from '../logger.js';

export class WorkflowModule {
  constructor() {
    this.workflowTableBody = document.getElementById('workflowTableBody');
    this.createWorkflowButton = document.getElementById('createWorkflow');
    this.saveWorkflowButton = document.getElementById('saveWorkflow');
    this.cancelWorkflowButton = document.getElementById('cancelWorkflow');
    this.workflowCreationSection = document.getElementById('workflowCreation');
    this.workflowCanvas = document.getElementById('workflowCanvas');
    
    this.workflows = [];
  }

  init() {
    this.setupEventListeners();
    this.loadExistingWorkflows();
  }

  setupEventListeners() {
    this.createWorkflowButton?.addEventListener('click', () => this.showWorkflowCreation());
    this.saveWorkflowButton?.addEventListener('click', () => this.saveWorkflow());
    this.cancelWorkflowButton?.addEventListener('click', () => this.hideWorkflowCreation());
  }

  showWorkflowCreation() {
    if (this.workflowCreationSection) {
      this.workflowCreationSection.classList.remove('hidden');
    }
  }

  hideWorkflowCreation() {
    if (this.workflowCreationSection) {
      this.workflowCreationSection.classList.add('hidden');
    }
  }

  loadExistingWorkflows() {
    // 模拟加载现有工作流
    this.workflows = [
      {
        name: '示例工作流',
        status: '已发布',
        createdAt: '2025-06-01'
      }
    ];
    this.renderWorkflowTable();
  }

  saveWorkflow() {
    const workflowName = prompt('请输入工作流名称：');
    if (!workflowName) {
      showNotification('工作流名称不能为空', 'error');
      return;
    }

    const newWorkflow = {
      name: workflowName,
      status: '草稿',
      createdAt: new Date().toLocaleDateString()
    };

    this.workflows.push(newWorkflow);
    this.renderWorkflowTable();
    this.hideWorkflowCreation();
    showNotification('工作流创建成功', 'success');
  }

  renderWorkflowTable() {
    if (!this.workflowTableBody) return;
    
    this.workflowTableBody.innerHTML = '';
    
    this.workflows.forEach((workflow, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="border border-gray-200 px-4 py-3 text-gray-700">${workflow.name}</td>
        <td class="border border-gray-200 px-4 py-3 text-gray-700">${workflow.status}</td>
        <td class="border border-gray-200 px-4 py-3 text-gray-700">${workflow.createdAt}</td>
        <td class="border border-gray-200 px-4 py-3">
          <button class="bg-primary hover:bg-blue-700 text-white px-3 py-1 rounded text-sm mr-2" onclick="workflowModule.editWorkflow(${index})">编辑</button>
          <button class="bg-danger hover:bg-red-600 text-white px-3 py-1 rounded text-sm" onclick="workflowModule.deleteWorkflow(${index})">删除</button>
        </td>
      `;
      this.workflowTableBody.appendChild(row);
    });
  }

  editWorkflow(index) {
    const workflow = this.workflows[index];
    const newName = prompt('编辑工作流名称:', workflow.name);
    if (newName && newName !== workflow.name) {
      this.workflows[index].name = newName;
      this.renderWorkflowTable();
      showNotification('工作流更新成功', 'success');
    }
  }

  deleteWorkflow(index) {
    if (confirm('确定要删除此工作流吗？')) {
      this.workflows.splice(index, 1);
      this.renderWorkflowTable();
      showNotification('工作流已删除', 'success');
    }
  }
}
