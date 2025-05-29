import { mbseData } from './data.js';
import { showNotification, showLoading, hideLoading, displayFieldError, clearFieldError } from './uiUtils.js';
import { logError } from './logger.js';

export class ArchitectureModule {
  constructor() {
    this.architectureTableBody = document.getElementById('architectureTableBody');
    this.architectureSummaryDiv = document.getElementById('architectureSummary'); // 新增信息汇总区域
    this.refreshButton = document.getElementById('refreshArchitecture');
    this.functionBlockCountInput = document.getElementById('functionBlockCount');
    this.interfaceFileInput = document.getElementById('interfaceFile');
    this.architectureMermaidGraphDiv = document.getElementById('architectureMermaidGraph');
    
    this.functionalBlocks = [...mbseData.functionalBlocks]; // Use a mutable copy
    this.interfaceDefinitions = {...mbseData.interfaceDefinitions};
    // 新增SysML核心元素
    this.requirements = [
      { id: 'R1', name: '冷却能力', description: '系统需具备高温下冷却能力', status: '已分配' },
      { id: 'R2', name: '能耗限制', description: '能耗不超过目标值', status: '未分配' }
    ];
    this.useCases = [
      { id: 'UC1', name: '高温工况', description: '应对高温环境', status: '已分配' },
      { id: 'UC2', name: '低温启动', description: '低温下快速启动', status: '未分配' }
    ];
    this.constraints = [
      { id: 'C1', name: '最大流量', description: '冷却液最大流量约束', status: '约束' },
      { id: 'C2', name: '响应时间', description: '控制响应时间<1s', status: '约束' }
    ];
    this.params = [
      { id: 'P1', name: '目标温度', value: '85°C', status: '参数' }
    ];
  }

  init() {
    // 只保留信息汇总卡片，不再渲染图片和SysML映射表
    this.renderArchitectureSummary();
    this.renderArchitectureModelDescription();
    this.setupEventListeners();
    this.updateFunctionBlockCount(parseInt(this.functionBlockCountInput.value) || 5); // Initial render
  }

  renderArchitectureSummary() {
    // 信息汇总区域，统计各类元素数量
    if (!this.architectureSummaryDiv) return;
    this.architectureSummaryDiv.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div class="bg-blue-50 rounded p-3 text-center">
          <div class="text-xs text-gray-500">需求</div>
          <div class="text-2xl font-bold text-blue-700">${this.requirements.length}</div>
        </div>
        <div class="bg-green-50 rounded p-3 text-center">
          <div class="text-xs text-gray-500">用例</div>
          <div class="text-2xl font-bold text-green-700">${this.useCases.length}</div>
        </div>
        <div class="bg-purple-50 rounded p-3 text-center">
          <div class="text-xs text-gray-500">功能块</div>
          <div class="text-2xl font-bold text-purple-700">${this.functionalBlocks.length}</div>
        </div>
        <div class="bg-yellow-50 rounded p-3 text-center">
          <div class="text-xs text-gray-500">接口</div>
          <div class="text-2xl font-bold text-yellow-700">${this.interfaceDefinitions.fileName ? 1 : 0}</div>
        </div>
      </div>
    `;
  }

  renderArchitectureModelDescription() {
    const container = document.getElementById('architectureModelDescription');
    if (!container) return;
    
    container.innerHTML = '<div class="text-gray-500 text-sm">正在加载系统模型说明...</div>';
    
    const loadPDFJS = () => {
      if (window.pdfjsLib) {
        console.log('PDF.js 已加载，开始解析 PDF 内容');
        this._loadPdfText(container);
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
        script.onload = () => {
          console.log('PDF.js 加载成功');
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
          this._loadPdfText(container);
        };
        script.onerror = (error) => {
          console.error('PDF.js 加载失败:', error);
          container.innerHTML = `
            <div class="text-red-500">
              PDF解析组件加载失败。
              <button onclick="location.reload()" class="ml-4 px-3 py-1 bg-primary text-white rounded text-sm hover:bg-blue-700">
                重试
              </button>
            </div>
          `;
        };
        document.body.appendChild(script);
      }
    };
    
    loadPDFJS();
  }

  _loadPdfText(container) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

    const documentStructure = {
      chapters: [],
      tables: [],
      images: []
    };

    showLoading();
    const pdfPath = window.location.origin + '/pic/功能与架构设计模板.pdf';
    console.log(`尝试加载 PDF 文件: ${pdfPath}`);

    const loadPDF = async (retryCount = 0) => {
      try {
        const pdf = await window.pdfjsLib.getDocument(pdfPath).promise;
        const numPages = pdf.numPages;
        console.log(`PDF 加载成功，共 ${numPages} 页`);
        container.innerHTML = '<div class="text-gray-500 text-sm">正在解析文档结构...</div>';

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const operatorList = await page.getOperatorList();
          const viewport = page.getViewport({ scale: 1 });

          console.log(`解析第 ${pageNum} 页，提取到 ${textContent.items.length} 个文本项`);

          // 提取文本内容
          textContent.items.forEach(item => {
            if (item.str.match(/^第[一二三四五六七八九十]+章/)) {
              documentStructure.chapters.push({
                id: `chapter-${pageNum}`,
                title: item.str,
                content: []
              });
            } else if (documentStructure.chapters.length > 0) {
              documentStructure.chapters[documentStructure.chapters.length - 1].content.push(item.str);
            }
          });

          // 提取图片内容
          operatorList.fnArray.forEach((fn, index) => {
            if (fn === window.pdfjsLib.OPS.paintJpegXObject || fn === window.pdfjsLib.OPS.paintImageXObject) {
              const imageName = `page-${pageNum}-image-${index}.jpeg`;
              const imagePath = `/pic/temp/${imageName}`;
              documentStructure.images.push({
                pageNum,
                reference: imagePath
              });
              // 保存图片到 temp 文件夹（伪代码，需后端支持）
              console.log(`保存图片: ${imagePath}`);
            }
          });
        }

        console.log('文档结构解析完成', documentStructure);
        this._renderDocumentStructure(container, documentStructure);
        hideLoading();
      } catch (error) {
        console.error('PDF 处理错误:', error);
        if (retryCount < 3) {
          console.log(`尝试重新加载 PDF (${retryCount + 1}/3)...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return loadPDF(retryCount + 1);
        }
        hideLoading();
        container.innerHTML = `
          <div class="text-red-500">
            无法加载系统模型说明。
            <div class="text-sm mt-2">错误信息: ${error.message}</div>
            <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-blue-700">
              重试加载
            </button>
          </div>
        `;
      }
    };

    loadPDF();
  }

  _renderDocumentStructure(container, structure) {
    let html = '<div class="document-structure">';

    // 添加系统总览图
    html += '<div class="overview-image mb-6">';
    html += '<img src="/pic/系统总览图.png" alt="系统总览图" class="w-full h-auto mb-4">';
    html += '<div class="text-sm text-gray-600">系统总览图</div>';
    html += '</div>';

    // 添加目录
    html += '<div class="toc mb-4 p-4 bg-gray-50 rounded-lg">';
    html += '<h3 class="text-lg font-semibold mb-2">目录</h3>';
    structure.chapters.forEach(chapter => {
      html += `<div class="toc-item" data-target="${chapter.id}">${chapter.title}</div>`;
    });
    html += '</div>';

    // 添加正文内容
    html += '<div class="content">';
    structure.chapters.forEach(chapter => {
      html += `
        <div id="${chapter.id}" class="chapter mb-6">
          <h2 class="text-xl font-bold mb-3">${chapter.title}</h2>
          <div class="content mb-4">${chapter.content.join(' ')}</div>
        </div>
      `;
    });

    // 添加图片
    const imageMapping = {
      '系统需求图': '/pic/系统需求图.jpeg',
      '系统需求表': '/pic/系统需求表.png',
      '系统组成图': '/pic/系统组成图.png',
      '系统架构图': '/pic/系统架构图.jpeg',
      '组件接口表': '/pic/组件接口表.png',
      '需求追溯矩阵': '/pic/需求追溯矩阵.png'
    };

    Object.keys(imageMapping).forEach(imageTitle => {
      html += '<div class="image-section mt-8">';
      html += `<h2 class="text-xl font-bold mb-4">${imageTitle}</h2>`;
      html += `<img src="${imageMapping[imageTitle]}" alt="${imageTitle}" class="w-full h-auto mb-4">`;
      html += `<div class="text-sm text-gray-600">${imageTitle}</div>`;
      html += '</div>';
    });

    html += '</div></div>';

    container.innerHTML = html;

    // 添加目录点击事件
    const tocItems = container.querySelectorAll('.toc-item');
    tocItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // 添加滚动监听以高亮当前章节
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const tocItem = container.querySelector(`.toc-item[data-target="${id}"]`);
        if (tocItem) {
          if (entry.isIntersecting) {
            tocItem.classList.add('active');
          } else {
            tocItem.classList.remove('active');
          }
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.chapter').forEach((section) => {
      observer.observe(section);
    });
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
    // 不再渲染功能块表格和SysML映射表
    if (this.architectureTableBody) this.architectureTableBody.innerHTML = '';
  }

  renderArchitectureMappingTable() {
    // 不再渲染SysML核心元素映射表
    const tbody = document.getElementById('architectureMappingTableBody');
    if (tbody) tbody.innerHTML = '';
  }

  async renderArchitectureGraph() {
    if (!this.architectureMermaidGraphDiv || !window.mermaid) return;
    // SysML核心视图关系图
    let mermaidSyntax = 'graph TD\n';
    // 需求与用例
    this.requirements.forEach(req => {
      mermaidSyntax += `    ${req.id}[\"<<Requirement>> ${req.name}\"]\n`;
    });
    this.useCases.forEach(uc => {
      mermaidSyntax += `    ${uc.id}[\"<<UseCase>> ${uc.name}\"]\n`;
    });
    // 需求到用例追溯
    mermaidSyntax += '    R1 --> UC1\n';
    // 用例到功能块
    this.functionalBlocks.forEach((block, i) => {
      mermaidSyntax += `    ${block.id}[\"<<Block>> ${block.name}\"]\n`;
      if (i === 0) mermaidSyntax += '    UC1 --> ' + block.id + '\n';
    });
    // 功能块到接口、约束、参数
    if (this.interfaceDefinitions.fileName) {
      mermaidSyntax += `    IF1[\"<<Interface>> ${this.interfaceDefinitions.fileName}\"]\n`;
      if (this.functionalBlocks[0]) mermaidSyntax += `    ${this.functionalBlocks[0].id} --> IF1\n`;
    }
    this.constraints.forEach((c, i) => {
      mermaidSyntax += `    C${i+1}[\"<<Constraint>> ${c.name}\"]\n`;
      if (this.functionalBlocks[i]) mermaidSyntax += `    ${this.functionalBlocks[i].id} --> C${i+1}\n`;
    });
    this.params.forEach((p, i) => {
      mermaidSyntax += `    P${i+1}[\"<<Param>> ${p.name}:${p.value}\"]\n`;
      if (this.functionalBlocks[i]) mermaidSyntax += `    ${this.functionalBlocks[i].id} --> P${i+1}\n`;
    });
    // 功能块之间的连接
    for(let i = 0; i < this.functionalBlocks.length - 1; i++) {
      if (this.functionalBlocks[i+1]) {
        mermaidSyntax += `    ${this.functionalBlocks[i].id} -.-> ${this.functionalBlocks[i+1].id}\n`;
      }
    }
    this.architectureMermaidGraphDiv.innerHTML = '';
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

// Vite/ESM兼容性修复：确保本文件只包含ES模块语法，不要有重复定义、语法错误或无效合并
export default ArchitectureModule;
