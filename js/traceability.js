import { mbseData } from './data.js';
import { showGenericModal, hideGenericModal, showNotification, showLoading, hideLoading } from './uiUtils.js';
import { logError } from './logger.js';

export class TraceabilityModule {
  constructor() {
    this.traceabilityTableBody = document.getElementById('traceabilityTableBody');
    this.exportReportButton = document.getElementById('exportReport');
    this.viewUncoveredButton = document.getElementById('viewUncovered');
    this.showImpactPathCheckbox = document.getElementById('showImpactPath');
    this.traceabilityMermaidGraphDiv = document.getElementById('traceabilityMermaidGraph');

    // Dynamically generate traceability data based on requirements and architecture (simplified)
    this.traceabilityData = this.generateDynamicTraceabilityData();
  }

  init() {
    this.renderTraceabilityTable();
    this.renderTraceabilityGraph();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.exportReportButton.addEventListener('click', () => this.exportTraceabilityReport());
    this.viewUncoveredButton.addEventListener('click', () => this.viewUncoveredRequirements());
    this.showImpactPathCheckbox.addEventListener('change', (e) => {
      this.toggleImpactPath(e.target.checked);
      this.renderTraceabilityGraph(); // Re-render graph with impact path changes
    });
  }

  generateDynamicTraceabilityData() {
    // Simplified dynamic generation: link each requirement to a functional block if available
    const requirements = mbseData.requirements || [];
    const functionalBlocks = mbseData.functionalBlocks || [];
    let dynamicTraceData = [];

    requirements.forEach((req, index) => {
        const block = functionalBlocks[index % functionalBlocks.length]; // Cycle through blocks
        dynamicTraceData.push({
            reqId: req.id,
            reqName: req.name, // For highlighting later
            functionModule: block ? block.name : 'N/A',
            functionModuleId: block ? block.id : null, // For graph linking
            modelName: block ? `${block.id}_model.mo` : 'generic_model.mo',
            verificationMethod: `Sim ${req.id}`,
            // Simulate status: 'passed', 'failed', 'pending'
            status: ['passed', 'failed', 'pending'][Math.floor(Math.random() * 3)] 
        });
    });
    mbseData.traceability = dynamicTraceData; // Update shared data if necessary
    return dynamicTraceData;
  }


  renderTraceabilityTable() {
    this.traceabilityData = this.generateDynamicTraceabilityData(); // Refresh data
    this.traceabilityTableBody.innerHTML = '';

    if (this.traceabilityData.length === 0) {
        const row = this.traceabilityTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.className = 'text-center text-gray-500 py-4';
        cell.textContent = '暂无追溯数据。';
        return;
    }

    this.traceabilityData.forEach(item => {
      const row = this.traceabilityTableBody.insertRow();
      row.className = 'hover:bg-gray-50 hover-lift transition-all duration-150';
      row.setAttribute('data-req-id', item.reqId);
      row.setAttribute('data-func-id', item.functionModuleId);

      const statusClass = this.getStatusClass(item.status);
      const statusText = this.getStatusText(item.status);

      row.innerHTML = `
        <td class="border border-gray-200 px-4 py-3 font-medium text-gray-900" data-type="requirement">${item.reqId}</td>
        <td class="border border-gray-200 px-4 py-3 text-gray-700" data-type="function">${item.functionModule}</td>
        <td class="border border-gray-200 px-4 py-3 text-gray-700">${item.modelName}</td>
        <td class="border border-gray-200 px-4 py-3 text-gray-700">${item.verificationMethod}</td>
        <td class="border border-gray-200 px-4 py-3">
          <span class="${statusClass}">${statusText}</span>
        </td>
      `;
      // Add event listeners for bi-directional highlighting (simplified)
      row.querySelectorAll('td[data-type]').forEach(cell => {
        cell.addEventListener('click', (e) => this.handleTraceElementClick(e.currentTarget));
      });
    });
  }

  async renderTraceabilityGraph() {
    if (!this.traceabilityMermaidGraphDiv || !window.mermaid) return;
    
    let mermaidSyntax = 'graph LR;\n'; // Left-to-Right graph
    const showImpact = this.showImpactPathCheckbox.checked;
    const impactedElementId = this.traceabilityData.length > 0 ? this.traceabilityData[0].reqId : null; // Simulate R001 is impacted

    if (this.traceabilityData.length === 0) {
        mermaidSyntax += '    NoTrace["暂无追溯数据"];';
    } else {
        this.traceabilityData.forEach(item => {
            const reqNode = `${item.reqId}[R: ${item.reqId}]`;
            const funcNode = item.functionModuleId ? `${item.functionModuleId}[F: ${item.functionModule}]` : null;
            const modelNode = `${item.modelName.replace(/[\.\s]/g,'_')}[M: ${item.modelName}]`; // Sanitize ID
            const verifNode = `${item.verificationMethod.replace(/\s/g,'_')}[V: ${item.verificationMethod}]`;

            mermaidSyntax += `    subgraph "Trace for ${item.reqId}"\n`;
            mermaidSyntax += `        ${reqNode} --> ${funcNode || modelNode};\n`;
            if (funcNode) mermaidSyntax += `        ${funcNode} --> ${modelNode};\n`;
            mermaidSyntax += `        ${modelNode} --> ${verifNode};\n`;
            mermaidSyntax += `    end\n`;

            if (showImpact && item.reqId === impactedElementId) {
                 mermaidSyntax += `    style ${item.reqId} fill:#f87171,stroke:#b91c1c,stroke-width:2px\n`; // Red for direct impact
                 if(funcNode) mermaidSyntax += `    style ${item.functionModuleId} fill:#fbbf24,stroke:#d97706,stroke-width:2px\n`; // Yellow for indirect
            }
        });
    }
    
    this.traceabilityMermaidGraphDiv.innerHTML = ''; // Clear previous
    this.traceabilityMermaidGraphDiv.setAttribute('data-mermaid', mermaidSyntax);
    try {
        const { svg } = await window.mermaid.render('traceabilitySvgId', mermaidSyntax);
        this.traceabilityMermaidGraphDiv.innerHTML = svg;
    } catch (e) {
        this.traceabilityMermaidGraphDiv.innerHTML = `Error rendering graph: ${e.message}`;
        logError('TraceabilityModule', 'renderTraceabilityGraph', e);
    }
  }
  
  handleTraceElementClick(clickedCell) {
    const type = clickedCell.dataset.type;
    const id = clickedCell.textContent; // Or a data-id attribute if content is complex
    
    document.querySelectorAll('#traceabilityTableBody tr, #architectureTableBody tr').forEach(row => {
        row.classList.remove('highlighted-trace', 'ring-red-400', 'ring-orange-400');
    });
    
    showNotification(`模拟高亮: ${type} "${id}" 及其关联项。`, 'info', 1500);

    // Example highlighting logic (very simplified)
    if (type === 'requirement') {
      const rows = document.querySelectorAll(`#traceabilityTableBody tr[data-req-id="${id}"]`);
      rows.forEach(r => r.classList.add('highlighted-trace', 'ring-red-400')); // Direct
    } else if (type === 'function') {
      const rows = document.querySelectorAll(`#traceabilityTableBody tr[data-func-id="${id}"]`); // Assuming func id matches module name for now
      rows.forEach(r => r.classList.add('highlighted-trace', 'ring-orange-400')); // Related
    }
    // Add more complex logic to find related items across tables/data structures
  }


  getStatusClass(status) {
    const classMap = { 'passed': 'status-passed', 'failed': 'status-failed', 'pending': 'status-pending' };
    return classMap[status] || 'status-pending';
  }
  getStatusText(status) {
    const textMap = { 'passed': '通过', 'failed': '失败', 'pending': '待验证' };
    return textMap[status] || status;
  }

  exportTraceabilityReport() {
    showLoading();
    setTimeout(() => {
      try {
        const reportTitle = "MBSE 应用追溯报告 (模拟)\n";
        const date = `生成日期: ${new Date().toLocaleString()}\n\n`;
        let content = "需求ID,功能模块,模型名称,验证方法,状态\n";
        this.traceabilityData.forEach(item => {
          content += `${item.reqId},"${item.functionModule}","${item.modelName}","${item.verificationMethod}",${item.status}\n`;
        });
        
        const blob = new Blob([reportTitle + date + content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `traceability_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('追溯报告已导出 (模拟 CSV)', 'success');
      } catch (error) {
        logError('TraceabilityModule', 'exportTraceabilityReport', error);
        showNotification('导出追溯报告失败', 'error');
      } finally {
        hideLoading();
      }
    }, 1500);
  }

  viewUncoveredRequirements() {
    const uncovered = this.traceabilityData.filter(item => item.status === 'pending' || item.status === 'failed');
    let contentHtml = '';

    if (uncovered.length === 0) {
      contentHtml = '<p class="text-green-600">太棒了！所有需求均已覆盖并通过验证 (模拟)。</p>';
    } else {
      contentHtml = '<p class="mb-2">以下需求未完全覆盖或验证失败 (模拟):</p><ul class="list-disc list-inside space-y-1 max-h-60 overflow-y-auto">';
      uncovered.forEach(item => {
        contentHtml += `<li class="${item.status === 'failed' ? 'text-red-600' : 'text-yellow-600'}">
                          <strong>${item.reqId}</strong> (${item.functionModule}): ${this.getStatusText(item.status)}
                        </li>`;
      });
      contentHtml += '</ul>';
    }
    showGenericModal('未覆盖需求检查 (模拟)', contentHtml, [{ text: '关闭', class: 'bg-primary text-white px-4 py-2 rounded', onClick: hideGenericModal }]);
  }

  toggleImpactPath(enabled) {
    showNotification(`变更影响路径图已${enabled ? '启用' : '禁用'} (模拟)`, 'info');
    // Actual graph update will be handled by re-rendering if needed
    this.renderTraceabilityGraph();
  }

  async simulateAnalysis() {
    showNotification('模拟分析追溯性...', 'info');
    await new Promise(resolve => setTimeout(resolve, 700));
    this.traceabilityData = this.generateDynamicTraceabilityData(); // Re-generate based on current app state
    this.renderTraceabilityTable();
    this.renderTraceabilityGraph();
  }

  async getReportSummary() {
    const passed = this.traceabilityData.filter(t => t.status === 'passed').length;
    const total = this.traceabilityData.length;
    return `总计 ${total} 条追溯链路, ${passed} 条通过验证 (模拟).`;
  }
}
