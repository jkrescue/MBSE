import { mbseData } from './data.js';
import { 
    showGenericModal, hideGenericModal, createConfirmationModal, createPromptModal, 
    showNotification, showLoading, hideLoading, displayFieldError, clearFieldError
} from './uiUtils.js';
import { logError } from './logger.js';

const REQUIREMENT_FORM_TEMPLATE_ID = 'addEditRequirementFormTemplate';
const LOCAL_STORAGE_KEY = 'mbseRequirementsData';

export class RequirementsModule {
  constructor() {
    this.requirements = []; // Loaded from localStorage or default data
    this.tableBody = document.getElementById('requirementsTableBody');
    this.addRequirementButton = document.getElementById('addRequirement');
    this.autoReviewCheckbox = document.getElementById('autoReview');
    this.impactAnalysisCheckbox = document.getElementById('impactAnalysis');
    this.exportButton = document.getElementById('exportRequirements');
    this.importButton = document.getElementById('importRequirements');
    this.importFileInput = document.getElementById('importRequirementsFile');
    
    this.requirementFormTemplate = document.getElementById(REQUIREMENT_FORM_TEMPLATE_ID);
  }

  init() {
    this.loadRequirementsFromLocalStorage();
    this.renderRequirementsTable();
    this.setupEventListeners();
    this.updateParentAppStatus(); // Notify app about current counts
  }

  setupEventListeners() {
    this.addRequirementButton.addEventListener('click', () => this.showAddEditRequirementModal(null));
    
    this.autoReviewCheckbox.addEventListener('change', (e) => {
      this.updateConfiguration('autoReview', e.target.checked);
      document.getElementById('autoReviewStatus').textContent = e.target.checked ? '模拟已启用' : '模拟已禁用';
    });
    this.impactAnalysisCheckbox.addEventListener('change', (e) => {
      this.updateConfiguration('impactAnalysis', e.target.checked);
      document.getElementById('impactAnalysisStatus').textContent = e.target.checked ? '模拟已启用' : '模拟已禁用';
    });

    this.exportButton.addEventListener('click', () => this.exportRequirementsData());
    this.importButton.addEventListener('click', () => this.importFileInput.click());
    this.importFileInput.addEventListener('change', (e) => this.importRequirementsData(e.target.files[0]));
  }
  
  getRequirementsCount() {
    return this.requirements.length;
  }

  updateParentAppStatus() {
    // A bit of a hack; ideally, the app instance would be passed or an event bus used.
    // For now, assume there's a global way to trigger app's status update or app polls.
    if (window.mbseAppInstance && typeof window.mbseAppInstance.updateSystemStatus === 'function') {
        window.mbseAppInstance.updateSystemStatus();
    }
    // Update systemStatus in mbseData directly for now
    mbseData.systemStatus.requirementCount = this.requirements.length;
    // Assuming verification logic is elsewhere, just update total
    mbseData.systemStatus.verificationTotal = this.requirements.length; 
  }

  renderRequirementsTable() {
    this.tableBody.innerHTML = '';
    if (!this.requirements || this.requirements.length === 0) {
        const row = this.tableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 7; // Number of columns
        cell.className = 'text-center text-gray-500 py-4';
        cell.textContent = '暂无需求数据。';
        return;
    }

    this.requirements.forEach(req => {
      const row = this.tableBody.insertRow();
      row.className = 'hover:bg-gray-50 transition-colors duration-150';
      row.innerHTML = `
        <td class="border border-gray-200 px-4 py-3 font-medium text-gray-900">${req.id}</td>
        <td class="border border-gray-200 px-4 py-3 text-gray-700">${req.name}</td>
        <td class="border border-gray-200 px-4 py-3">
          <span class="status-${req.status}">${this.getStatusText(req.status)}</span>
        </td>
        <td class="border border-gray-200 px-4 py-3 text-gray-700">${req.owner}</td>
        <td class="border border-gray-200 px-4 py-3 text-gray-700">${req.version}</td>
        <td class="border border-gray-200 px-4 py-3 text-gray-700 capitalize">${req.priority}</td>
        <td class="border border-gray-200 px-4 py-3">
          <div class="flex space-x-2">
            <button data-id="${req.id}" class="edit-req-btn text-blue-600 hover:text-blue-800 text-sm">编辑</button>
            <button data-id="${req.id}" class="delete-req-btn text-red-600 hover:text-red-800 text-sm">删除</button>
          </div>
        </td>
      `;
      row.querySelector('.edit-req-btn').addEventListener('click', () => this.showAddEditRequirementModal(req.id));
      row.querySelector('.delete-req-btn').addEventListener('click', () => this.deleteRequirement(req.id));
    });
    this.updateParentAppStatus();
  }

  getStatusText(status) {
    const statusMap = {
      'approved': '已批准', 'pending': '待评审', 'review': '评审中', 'failed': '验证失败'
    };
    return statusMap[status] || status;
  }

  showAddEditRequirementModal(reqId = null) {
    const isEditing = reqId !== null;
    const requirement = isEditing ? this.requirements.find(r => r.id === reqId) : null;

    if (isEditing && !requirement) {
      showNotification('未找到要编辑的需求', 'error');
      return;
    }
    
    const formContent = this.requirementFormTemplate.content.cloneNode(true);
    const form = formContent.querySelector('#requirementForm'); // Get the form element

    if (isEditing) {
      form.querySelector('#reqId').value = requirement.id;
      form.querySelector('#reqId').readOnly = true; // Prevent ID change on edit
      form.querySelector('#reqName').value = requirement.name;
      form.querySelector('#reqDescription').value = requirement.description || '';
      form.querySelector('#reqOwner').value = requirement.owner;
      form.querySelector('#reqPriority').value = requirement.priority || 'medium';
      form.querySelector('#reqOriginalId').value = requirement.id; // Store original ID if needed
    } else {
      form.querySelector('#reqId').value = 'R' + Date.now(); // Suggested new ID
    }
    
    const modalTitle = isEditing ? `编辑需求: ${requirement.id}` : '添加新需求';
    const buttons = [
      { text: '取消', class: 'bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded', onClick: hideGenericModal },
      { text: isEditing ? '保存更改' : '添加需求', class: 'bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded', 
        onClick: () => this.handleRequirementFormSubmit(form, isEditing) }
    ];
    
    showGenericModal(modalTitle, formContent, buttons);
  }

  handleRequirementFormSubmit(formElement, isEditing) {
    const id = formElement.querySelector('#reqId').value.trim();
    const name = formElement.querySelector('#reqName').value.trim();
    const owner = formElement.querySelector('#reqOwner').value.trim();
    const description = formElement.querySelector('#reqDescription').value.trim();
    const priority = formElement.querySelector('#reqPriority').value;

    // Clear previous errors
    ['reqIdError', 'reqNameError', 'reqOwnerError'].forEach(clearFieldError);

    // Validation
    let isValid = true;
    if (!id) {
      displayFieldError('reqIdError', '需求编号不能为空。'); isValid = false;
    } else if (!isEditing && this.requirements.some(r => r.id === id)) {
      displayFieldError('reqIdError', '需求编号已存在。'); isValid = false;
    } else if (!/^[a-zA-Z0-9-_]+$/.test(id)) {
        displayFieldError('reqIdError', '编号只能包含字母、数字、连字符和下划线。'); isValid = false;
    }

    if (!name) {
      displayFieldError('reqNameError', '需求名称不能为空。'); isValid = false;
    }
    if (!owner) {
      displayFieldError('reqOwnerError', '负责人不能为空。'); isValid = false;
    }

    if (!isValid) return;

    if (isEditing) {
      const originalId = formElement.querySelector('#reqOriginalId').value;
      const reqIndex = this.requirements.findIndex(r => r.id === originalId);
      if (reqIndex > -1) {
        this.requirements[reqIndex] = {
          ...this.requirements[reqIndex], // Preserve other fields like status, version
          id, // ID might be editable if not readOnly
          name,
          owner,
          description,
          priority,
          version: this.requirements[reqIndex].version // Potentially increment version or manage separately
        };
        showNotification('需求更新成功', 'success');
      }
    } else {
      const newRequirement = {
        id, name, owner, description, priority,
        status: 'pending', version: 'v1.0' 
      };
      this.requirements.push(newRequirement);
      showNotification('需求添加成功', 'success');
    }

    this.saveRequirementsToLocalStorage();
    this.renderRequirementsTable();
    hideGenericModal();
  }

  deleteRequirement(id) {
    const requirement = this.requirements.find(req => req.id === id);
    if (!requirement) return;

    createConfirmationModal(
      '删除需求',
      `确定删除需求 "${requirement.name}" (ID: ${id}) 吗？此操作无法撤销。`,
      () => {
        this.requirements = this.requirements.filter(req => req.id !== id);
        this.saveRequirementsToLocalStorage();
        this.renderRequirementsTable();
        showNotification('需求删除成功', 'success');
      }
    );
  }

  updateConfiguration(configName, value) {
    // Placeholder for actual config update logic
    console.log(`配置项 (需求模块) "${configName}" 更新为: ${value}`);
    showNotification(`配置项 "${configName}" 已${value ? '启用' : '禁用'} (模拟)`, 'info');
  }

  loadRequirementsFromLocalStorage() {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        this.requirements = JSON.parse(storedData);
      } else {
        this.requirements = [...mbseData.requirements]; // Use initial data if nothing in local storage
        this.saveRequirementsToLocalStorage(); // Save initial data to LS
      }
    } catch (error) {
      logError('RequirementsModule', 'loadRequirementsFromLocalStorage', error);
      showNotification('加载需求数据失败，使用默认数据。', 'error');
      this.requirements = [...mbseData.requirements];
    }
    document.getElementById('lastReqSyncTime').textContent = new Date().toLocaleString();
  }

  saveRequirementsToLocalStorage() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.requirements));
      localStorage.setItem('requirementsLastSync', new Date().toISOString());
      document.getElementById('lastReqSyncTime').textContent = new Date().toLocaleString();
    } catch (error) {
      logError('RequirementsModule', 'saveRequirementsToLocalStorage', error);
      showNotification('保存需求数据失败。', 'error');
    }
    this.updateParentAppStatus();
  }
  
  exportRequirementsData() {
    showLoading();
    try {
      const jsonData = JSON.stringify(this.requirements, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mbse_requirements_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('需求数据导出成功', 'success');
    } catch (error) {
      logError('RequirementsModule', 'exportRequirementsData', error);
      showNotification('导出需求数据失败', 'error');
    } finally {
      hideLoading();
    }
  }

  importRequirementsData(file) {
    if (!file) return;
    showLoading();
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData) && importedData.every(item => item.id && item.name)) {
          // Basic validation, can be more thorough
          createConfirmationModal(
            '导入确认',
            `确定要导入 ${importedData.length} 条需求数据吗？这将覆盖现有数据。`,
            () => {
              this.requirements = importedData;
              this.saveRequirementsToLocalStorage();
              this.renderRequirementsTable();
              showNotification('需求数据导入成功', 'success');
            },
            () => showNotification('导入已取消', 'info')
          );
        } else {
          showNotification('导入失败：文件格式不正确。', 'error');
        }
      } catch (error) {
        logError('RequirementsModule', 'importRequirementsData', error);
        showNotification('导入失败：无法解析文件。', 'error');
      } finally {
        hideLoading();
        this.importFileInput.value = ''; // Reset file input
      }
    };
    reader.onerror = () => {
      showNotification('导入失败：无法读取文件。', 'error');
      hideLoading();
      this.importFileInput.value = '';
    };
    reader.readAsText(file);
  }

  async simulateLoad() {
    // Simulate loading or re-validating requirements
    showNotification('模拟加载需求...', 'info');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async work
    this.renderRequirementsTable(); // Re-render in case data changed
  }
}
