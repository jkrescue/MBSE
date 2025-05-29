import { mbseData } from './data.js';
import { showLoading, hideLoading, showNotification } from './uiUtils.js';
import { logError } from './logger.js';

export class MBSEApp {
  constructor(requirementsModule, architectureModule, simulationModule, traceabilityModule) {
    this.currentTab = 'requirements';
    this.requirementsModule = requirementsModule;
    this.architectureModule = architectureModule;
    this.simulationModule = simulationModule;
    this.traceabilityModule = traceabilityModule;

    this.consoleOutputElement = document.getElementById('consoleOutput');
  }

  init() {
    this.setupEventListeners();
    this.updateSystemStatus(); // Initial status update
    this.logToConsole('应用初始化完成。', 'INFO');
    
    // Initialize modules (they might have their own async init logic or UI rendering)
    if (this.requirementsModule && typeof this.requirementsModule.init === 'function') this.requirementsModule.init();
    if (this.architectureModule && typeof this.architectureModule.init === 'function') this.architectureModule.init();
    if (this.simulationModule && typeof this.simulationModule.init === 'function') this.simulationModule.init();
    if (this.traceabilityModule && typeof this.traceabilityModule.init === 'function') this.traceabilityModule.init();

    this.switchTab(this.currentTab); // Activate the default tab and render its content
  }

  setupEventListeners() {
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const tabName = e.currentTarget.getAttribute('data-tab');
        this.switchTab(tabName);
      });
    });

    document.getElementById('executeCurrentApp').addEventListener('click', () => {
      this.executeApplication('current_app_button');
    });
    document.getElementById('executeApp').addEventListener('click', () => { // Header button
      this.executeApplication('header_button');
    });
  }

  switchTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.remove('bg-primary', 'text-white', 'font-medium');
      button.classList.add('text-gray-600', 'hover:bg-gray-200');
    });

    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
      activeButton.classList.add('bg-primary', 'text-white', 'font-medium');
      activeButton.classList.remove('text-gray-600', 'hover:bg-gray-200');
    }

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    const activeTabContent = document.getElementById(`${tabName}-tab`);
    if (activeTabContent) {
      activeTabContent.classList.add('active');
    }
    this.currentTab = tabName;

    // Trigger rendering for dynamic content like Mermaid charts if the tab becomes active
    if (tabName === 'architecture' && this.architectureModule) {
        this.architectureModule.renderArchitectureGraph();
    } else if (tabName === 'traceability' && this.traceabilityModule) {
        this.traceabilityModule.renderTraceabilityGraph();
    }
  }

  updateSystemStatus() {
    const status = mbseData.systemStatus; // This should be dynamically updated by modules
    const totalReqs = this.requirementsModule ? this.requirementsModule.getRequirementsCount() : status.requirementCount;
    
    document.getElementById('requirementCount').textContent = totalReqs;
    document.getElementById('currentReqCount').textContent = totalReqs;
    
    // For now, modelCount and verification status are from mbseData, ideally should be aggregated
    document.getElementById('modelCount').textContent = status.modelCount;
    document.getElementById('verificationCount').textContent = `${status.verificationPassed}/${totalReqs}`; // Assume verificationTotal tracks totalReqs

    // Update last sync time for requirements
    const reqSyncTimeEl = document.getElementById('lastReqSyncTime');
    if (reqSyncTimeEl) {
        const lastSync = localStorage.getItem('requirementsLastSync');
        reqSyncTimeEl.textContent = lastSync ? new Date(lastSync).toLocaleString() : 'N/A';
    }
  }

  async executeApplication(source) {
    showLoading();
    this.logToConsole(`应用执行开始 (触发来源: ${source})`, 'INFO');

    try {
      this.logToConsole('步骤 1: 模拟加载需求...', 'INFO');
      await this.requirementsModule.simulateLoad();
      this.updateSystemStatus(); // Reflect any changes from loading
      await this.delay(500);

      this.logToConsole('步骤 2: 模拟分析架构...', 'INFO');
      await this.architectureModule.simulateAnalysis();
      await this.delay(500);

      this.logToConsole('步骤 3: 模拟运行仿真...', 'INFO');
      // Pass a callback to update app's console during simulation progress
      await this.simulationModule.runSimulation((log) => this.logToConsole(log, 'SIM')); 
      await this.delay(500);

      this.logToConsole('步骤 4: 模拟分析追溯性...', 'INFO');
      await this.traceabilityModule.simulateAnalysis();
      await this.delay(500);
      
      this.logToConsole('步骤 5: 模拟生成报告...', 'INFO');
      // This might be part of traceability or a separate step
      // For now, assume traceability analysis covers report data generation
      const reportSummary = await this.traceabilityModule.getReportSummary();
      this.logToConsole(`模拟报告摘要: ${reportSummary}`, 'INFO');
      
      document.getElementById('traceabilityRunId').textContent = `APP_RUN_${new Date().toISOString().slice(0,10).replace(/-/g,'')}_${String(Date.now()).slice(-2)}`;
      document.getElementById('traceabilityRunTime').textContent = new Date().toLocaleString();
      document.getElementById('traceabilityRunSummary').textContent = `共 ${mbseData.systemStatus.requirementCount} 个需求，${mbseData.systemStatus.modelCount} 个模型；${mbseData.systemStatus.verificationPassed} 个通过验证，${mbseData.systemStatus.requirementCount - mbseData.systemStatus.verificationPassed} 个存在问题.`;


      showNotification('应用执行完成 (模拟)', 'success');
      this.logToConsole('应用执行成功完成。', 'SUCCESS');
    } catch (error) {
      showNotification(`执行失败 (模拟): ${error.message}`, 'error');
      this.logToConsole(`执行错误: ${error.message}`, 'ERROR');
      logError('MBSEApp', 'executeApplication', error);
    } finally {
      hideLoading();
    }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  logToConsole(message, type = 'INFO') { // type can be INFO, WARN, ERROR, SUCCESS, SIM (for simulation)
    if (!this.consoleOutputElement) return;

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    let typeColor = 'text-green-400'; // Default for INFO

    switch(type.toUpperCase()) {
        case 'WARN':
            typeColor = 'text-yellow-400';
            break;
        case 'ERROR':
            typeColor = 'text-red-400';
            break;
        case 'SUCCESS':
            typeColor = 'text-green-300 font-semibold';
            break;
        case 'SIM':
            typeColor = 'text-blue-300';
            break;
    }
    
    logEntry.innerHTML = `<span class="text-gray-500">[${timestamp}]</span> <span class="${typeColor}">[${type}]</span> ${message}`;
    this.consoleOutputElement.appendChild(logEntry);
    this.consoleOutputElement.scrollTop = this.consoleOutputElement.scrollHeight;
  }
}
