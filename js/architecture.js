import { mbseData } from './data.js';
import { showNotification, showLoading, hideLoading, displayFieldError, clearFieldError } from './uiUtils.js';
import { logError } from './logger.js';

export class ArchitectureModule {
  constructor() {
    this.architectureTableBody = document.getElementById('architectureTableBody');
    this.refreshButton = document.getElementById('refreshArchitecture');
    this.functionBlockCountInput = document.getElementById('functionBlockCount');
    this.interfaceFileInput = document.getElementById('interfaceFile');
    this.architectureMermaidGraphDiv = document.getElementById('architectureMermaidGraph');
    
    this.functionalBlocks = [...mbseData.functionalBlocks]; // Use a mutable copy
    this.interfaceDefinitions = {...mbseData.interfaceDefinitions};
  }

  init() {
    this.renderArchitectureTable();
    this.renderArchitectureGraph();
    this.setupEventListeners();
    this.updateFunctionBlockCount(parseInt(this.functionBlockCountInput.value) || 5); // Initial render
  }

  setupEventListeners() {
    this.refreshButton.addEventListener('click', () => this.refreshArchitecture());
    
    this.functionBlockCountInput.addEventListener('change', (e) => {
      const count = parseInt(e.target.value);
      clearFieldError('functionBlockCountError');
      if (isNaN(count) || count < 1 || count > 20) {
        displayFieldError('functionBlockCountError', '数量必须在 1 到 20 之间。');
        return;
      }
      this.updateFunctionBlockCount(count);
    });

    this.interfaceFileInput.addEventListener('change', (e) => {
      this.handleInterfaceFileUpload(e.target.files[0]);
    });
  }

  renderArchitectureTable() {
    this.architectureTableBody.innerHTML = '';
    if (!this.functionalBlocks || this.functionalBlocks.length === 0) {
        const row = this.architectureTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 4;
        cell.className = 'text-center text-gray-500 py-4';
        cell.textContent = '暂无功能模块数据。';
        return;
    }
    this.functionalBlocks.forEach(item => {
      const row = this.architectureTableBody.insertRow();
      row.className = 'hover:bg-gray-50';
      const statusClass = item.status === 'active' ? 'text-green-600' : 'text-gray-500';
      const statusText = item.status === 'active' ? '激活' : (item.status === '模拟' ? '模拟' : '未激活');

      row.innerHTML = `
        <td class="border border-gray-200 px-4 py-3 font-medium text-gray-900">${item.name}</td>
        <td class="border border-gray-200 px-4 py-3 text-gray-700">${item.id}</td>
        <td class="border border-gray-200 px-4 py-3 text-gray-700">${item.description}</td>
        <td class="border border-gray-200 px-4 py-3">
          <span class="${statusClass} font-medium">${statusText}</span>
        </td>
      `;
    });
  }

  async renderArchitectureGraph() {
    if (!this.architectureMermaidGraphDiv || !window.mermaid) return;
    
    let mermaidSyntax = 'graph TD;\n';
    if (this.functionalBlocks.length === 0) {
        mermaidSyntax += '    NoBlocks["暂无功能块数据"];';
    } else {
        this.functionalBlocks.forEach(block => {
            mermaidSyntax += `    ${block.id}["${block.name}"];\n`;
        });
        // Add some sample connections for demo
        for(let i = 0; i < this.functionalBlocks.length - 1; i++) {
            if (this.functionalBlocks[i+1]) { // Check if next block exists
                 mermaidSyntax += `    ${this.functionalBlocks[i].id} --> ${this.functionalBlocks[i+1].id};\n`;
            }
        }
    }
    
    if (this.interfaceDefinitions.fileName) {
        const interfaceNodeId = 'InterfaceFile';
        mermaidSyntax += `    ${interfaceNodeId}[fa:fa-file-alt Interface: ${this.interfaceDefinitions.fileName}];\n`;
        if (this.functionalBlocks.length > 0 && this.functionalBlocks[0]) {
             mermaidSyntax += `    ${interfaceNodeId} -.-> ${this.functionalBlocks[0].id};\n`;
        }
    }

    this.architectureMermaidGraphDiv.innerHTML = ''; // Clear previous
    this.architectureMermaidGraphDiv.setAttribute('data-mermaid', mermaidSyntax);
    
    try {
        const { svg } = await window.mermaid.render('architectureSvgId', mermaidSyntax);
        this.architectureMermaidGraphDiv.innerHTML = svg;
    } catch (e) {
        this.architectureMermaidGraphDiv.innerHTML = `Error rendering graph: ${e.message}`;
        logError('ArchitectureModule', 'renderArchitectureGraph', e);
    }
  }

  async refreshArchitecture() {
    showLoading();
    document.getElementById('architectureRefreshStatus').textContent = '刷新中...';
    try {
      // Simulate data fetching/recalculation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example: slightly change some data for visual feedback
      this.functionalBlocks.forEach(block => {
        if (Math.random() > 0.7) block.status = (block.status === 'active' ? '模拟' : 'active');
      });

      this.renderArchitectureTable();
      this.renderArchitectureGraph();
      document.getElementById('architectureRefreshStatus').textContent = `已刷新于 ${new Date().toLocaleTimeString()}`;
      showNotification('架构图已刷新 (模拟)', 'success');
    } catch (error) {
      logError('ArchitectureModule', 'refreshArchitecture', error);
      showNotification('刷新架构图失败', 'error');
      document.getElementById('architectureRefreshStatus').textContent = '刷新失败';
    } finally {
      hideLoading();
    }
  }

  updateFunctionBlockCount(count) {
    this.functionalBlocks = Array.from({ length: count }, (_, i) => ({
      id: `FB${i + 1}`,
      name: `功能块 ${i + 1}`,
      description: `自动生成的第 ${i+1} 个功能块`,
      status: Math.random() > 0.5 ? 'active' : '模拟'
    }));
    this.renderArchitectureTable();
    this.renderArchitectureGraph();
    showNotification(`功能块数量已更新为 ${count}`, 'info');
    mbseData.systemStatus.modelCount = count + (this.interfaceDefinitions.fileName ? 1 : 0); // Example logic
    if (window.mbseAppInstance) window.mbseAppInstance.updateSystemStatus();
  }

  handleInterfaceFileUpload(file) {
    if (!file) return;
    const statusEl = document.getElementById('interfaceFileStatus');
    statusEl.textContent = '上传中...';
    showLoading();

    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => { // Simulate processing time
        this.interfaceDefinitions = {
          fileName: file.name,
          size: file.size,
          contentPreview: e.target.result.substring(0, 100) + (e.target.result.length > 100 ? '...' : ''),
          lines: e.target.result.split('\n').length
        };
        document.getElementById('architectureModelFile').textContent = file.name;
        statusEl.textContent = `已上传: ${file.name} (${(file.size / 1024).toFixed(1)} KB, ${this.interfaceDefinitions.lines} 行)`;
        showNotification(`接口文件 ${file.name} 已处理 (模拟)`, 'success');
        this.renderArchitectureGraph(); // Update graph with interface node
        mbseData.systemStatus.modelCount = this.functionalBlocks.length + 1; // Example logic
        if (window.mbseAppInstance) window.mbseAppInstance.updateSystemStatus();
        hideLoading();
      }, 1000);
    };
    reader.onerror = () => {
      statusEl.textContent = '文件读取失败。';
      showNotification('文件读取失败', 'error');
      logError('ArchitectureModule', 'handleInterfaceFileUpload', reader.error);
      hideLoading();
    };
    reader.readAsText(file); // Assuming text-based files
  }

  async simulateAnalysis() {
    showNotification('模拟分析架构...', 'info');
    await new Promise(resolve => setTimeout(resolve, 700));
    // Potentially update some internal state or re-render parts of the UI
    this.renderArchitectureGraph(); // Ensure graph is up-to-date
  }
}
