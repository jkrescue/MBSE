import { mbseData } from './data.js';
import { showNotification, displayFieldError, clearFieldError } from './uiUtils.js'; // No showLoading/hideLoading as it's managed by App
import { logError } from './logger.js';

export class SimulationModule {
  constructor() {
    this.simulationRunning = false;
    this.runButton = document.getElementById('runSimulation');
    this.casesInput = document.getElementById('simulationCases');
    this.durationInput = document.getElementById('simulationDuration');
    this.comparisonCheckbox = document.getElementById('enableComparison');
    this.kpiCheckbox = document.getElementById('enableKPI');
    
    this.progressContainer = document.getElementById('simulationProgressContainer');
    this.progressBar = document.getElementById('simulationProgressBar');
    this.statusText = document.getElementById('simulationStatusText');

    this.chartCanvas = document.getElementById('simulationChart');
    this.chartInstance = null;
    this.resultsSummaryDiv = document.getElementById('simulationSummary');
  }

  init() {
    this.setupEventListeners();
    this.renderSimulationArchitecture();
    this.renderSimulationConfigCard();
    this.renderInitialChartPlaceholder();
  }

  setupEventListeners() {
    this.runButton.addEventListener('click', () => this.runSimulation());
    
    this.casesInput.addEventListener('change', (e) => this.updateConfig('cases', e.target.value));
    this.durationInput.addEventListener('change', (e) => this.updateConfig('duration', e.target.value));
    this.comparisonCheckbox.addEventListener('change', (e) => this.updateConfig('comparison', e.target.checked));
    this.kpiCheckbox.addEventListener('change', (e) => this.updateConfig('kpi', e.target.checked));
  }

  updateConfig(key, value) {
    clearFieldError(`simulation${key.charAt(0).toUpperCase() + key.slice(1)}Error`);
    if ((key === 'cases' || key === 'duration')) {
        const numVal = parseInt(value);
        const min = parseInt(document.getElementById(`simulation${key.charAt(0).toUpperCase() + key.slice(1)}`).min);
        const max = parseInt(document.getElementById(`simulation${key.charAt(0).toUpperCase() + key.slice(1)}`).max);
        if (isNaN(numVal) || numVal < min || numVal > max) {
            displayFieldError(`simulation${key.charAt(0).toUpperCase() + key.slice(1)}Error`, `值必须在 ${min} 到 ${max} 之间。`);
            return;
        }
    }
    showNotification(`仿真配置 "${key}" 更新为: ${value} (模拟)`, 'info');
    // Store config if needed, e.g., this.config[key] = value;
  }

  async runSimulation(consoleLogCallback) {
    if (this.simulationRunning) return;

    const cases = parseInt(this.casesInput.value);
    const duration = parseInt(this.durationInput.value);

    clearFieldError('simulationCasesError');
    clearFieldError('simulationDurationError');

    let isValid = true;
    if (isNaN(cases) || cases < parseInt(this.casesInput.min) || cases > parseInt(this.casesInput.max)) {
        displayFieldError('simulationCasesError', `工况数必须在 ${this.casesInput.min} 到 ${this.casesInput.max} 之间。`);
        isValid = false;
    }
    if (isNaN(duration) || duration < parseInt(this.durationInput.min) || duration > parseInt(this.durationInput.max)) {
        displayFieldError('simulationDurationError', `时长必须在 ${this.durationInput.min} 到 ${this.durationInput.max} 之间。`);
        isValid = false;
    }
    if (!isValid) {
        showNotification('仿真配置无效，请检查输入。', 'error');
        return Promise.reject(new Error("仿真配置无效"));
    }

    this.simulationRunning = true;
    this.runButton.disabled = true;
    this.runButton.textContent = '仿真进行中...';
    this.progressContainer.classList.remove('hidden');
    this.progressBar.style.width = '0%';
    this.statusText.textContent = '初始化仿真...';
    if(consoleLogCallback) consoleLogCallback('仿真初始化...');

    const steps = 10; // Simulate 10 steps
    const stepDuration = (duration * 1000) / steps / 2 ; // Make it seem faster than actual duration

    try {
      for (let i = 0; i <= steps; i++) {
        const progress = (i / steps) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.statusText.textContent = `执行计算步骤 ${i}/${steps}... (模拟)`;
        if(consoleLogCallback) consoleLogCallback(`仿真步骤 ${i}/${steps}`);
        
        if (i === steps) { // Last step, generate results
             this.generateAndDisplayResults(cases, duration);
             if (this.kpiCheckbox.checked) {
                 this.generateKPIChart(cases);
             }
        }
        await new Promise(resolve => setTimeout(resolve, stepDuration));
      }
      
      this.statusText.textContent = '仿真完成。正在生成报告...';
      if(consoleLogCallback) consoleLogCallback('仿真完成，生成报告...');
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate report generation

      showNotification('仿真执行完成 (模拟)', 'success');
      if(consoleLogCallback) consoleLogCallback('仿真成功结束。');
      return Promise.resolve();

    } catch (error) {
      showNotification('仿真执行失败 (模拟): ' + error.message, 'error');
      logError('SimulationModule', 'runSimulation', error);
      if(consoleLogCallback) consoleLogCallback(`仿真错误: ${error.message}`);
      return Promise.reject(error);
    } finally {
      this.simulationRunning = false;
      this.runButton.disabled = false;
      this.runButton.textContent = '运行仿真';
      this.progressContainer.classList.add('hidden');
      this.progressBar.style.width = '0%';
    }
  }

  generateAndDisplayResults(cases, totalDuration) {
    // Simulate dynamic data generation
    const labels = Array.from({ length: 10 }, (_, i) => `T${i * (totalDuration/10)}s`); // Time points
    const temperatureData = labels.map(() => 20 + Math.random() * 10 * (cases / 10)); // Temp varies with cases
    const powerData = labels.map(() => 1.5 + Math.random() * 1 * (cases / 20)); // Power varies
    
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.chartInstance = new Chart(this.chartCanvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '温度 (°C)',
            data: temperatureData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            yAxisID: 'y',
          },
          {
            label: '功率 (kW)',
            data: powerData,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            yAxisID: 'y1',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: '温度 (°C)'}
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: '功率 (kW)'},
            grid: { drawOnChartArea: false } // only want the grid lines for one axis to show up
          }
        }
      }
    });

    // Update summary
    this.resultsSummaryDiv.innerHTML = `
      <div class="bg-blue-50 p-3 rounded">
        <div class="text-xl font-bold text-blue-600">${(temperatureData.reduce((a,b)=>a+b,0)/temperatureData.length).toFixed(1)}°C</div>
        <div class="text-sm text-gray-600">平均温度</div>
      </div>
      <div class="bg-green-50 p-3 rounded">
        <div class="text-xl font-bold text-green-600">${(powerData.reduce((a,b)=>a+b,0)/powerData.length).toFixed(1)}kW</div>
        <div class="text-sm text-gray-600">平均功耗</div>
      </div>
       <div class="bg-yellow-50 p-3 rounded">
        <div class="text-xl font-bold text-yellow-600">${cases}</div>
        <div class="text-sm text-gray-600">工况数</div>
      </div>
       <div class="bg-purple-50 p-3 rounded">
        <div class="text-xl font-bold text-purple-600">${totalDuration}s</div>
        <div class="text-sm text-gray-600">总时长</div>
      </div>
    `;
  }

  generateKPIChart(cases) {
    const kpiContainer = document.createElement('div');
    kpiContainer.classList.add('kpi-chart-container');

    const kpiTitle = document.createElement('h3');
    kpiTitle.textContent = 'KPI 指标权衡图';
    kpiContainer.appendChild(kpiTitle);

    const kpiCanvas = document.createElement('canvas');
    kpiCanvas.id = 'kpiChart';
    kpiContainer.appendChild(kpiCanvas);

    this.resultsSummaryDiv.parentElement.appendChild(kpiContainer);

    const labels = Array.from({ length: cases }, (_, i) => `工况 ${i + 1}`);
    const data = labels.map(() => Math.random() * 100);

    new Chart(kpiCanvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'KPI 指标',
          data: data,
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  renderInitialChartPlaceholder() {
    if (this.chartInstance) this.chartInstance.destroy();
    this.chartCanvas.getContext('2d').clearRect(0,0,this.chartCanvas.width, this.chartCanvas.height); // Clear canvas
    this.resultsSummaryDiv.innerHTML = '<p class="text-gray-500 col-span-full text-center">运行仿真以查看结果。</p>';
  }

  renderSimulationArchitecture() {
    const architectureDiv = document.createElement('div');
    architectureDiv.classList.add('simulation-architecture');

    const architectureTitle = document.createElement('h3');
    architectureTitle.textContent = '系统联合仿真架构';
    architectureDiv.appendChild(architectureTitle);

    const architectureImage = document.createElement('img');
    architectureImage.src = './pic/SSP1.png';
    architectureImage.alt = '系统联合仿真架构';
    architectureImage.classList.add('architecture-image');
    architectureImage.style.cursor = 'pointer';
    architectureImage.addEventListener('dblclick', () => {
      architectureImage.src = architectureImage.src.includes('SSP1.png') ? './pic/SSP2.png' : './pic/SSP1.png';
    });
    architectureDiv.appendChild(architectureImage);

    const modelTitle = document.createElement('h3');
    modelTitle.textContent = '系统组件信息';
    architectureDiv.appendChild(modelTitle);

    const modelImage = document.createElement('img');
    modelImage.src = './pic/Frame 1.png';
    modelImage.alt = '系统组件信息';
    modelImage.classList.add('model-image');
    architectureDiv.appendChild(modelImage);

    this.runButton.parentElement.insertBefore(architectureDiv, this.runButton);
  }

  renderSimulationConfigCard() {
    const configContainer = document.createElement('div');
    configContainer.classList.add('simulation-config-container');

    for (let i = 1; i <= 3; i++) {
      const configCard = document.createElement('div');
      configCard.classList.add('simulation-config-card');
      configCard.style.display = 'inline-block'; // 横向排列
      configCard.style.marginRight = '10px';
      configCard.style.border = '1px solid #ccc';
      configCard.style.padding = '10px';
      configCard.style.borderRadius = '5px';
      configCard.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';

      const configTitle = document.createElement('h4');
      configTitle.textContent = `工况 ${i} 配置`;
      configTitle.style.textAlign = 'center';
      configCard.appendChild(configTitle);

      const powerLabel = document.createElement('label');
      powerLabel.textContent = `工况 ${i} 电机功率 (kW):`;
      const powerInput = document.createElement('input');
      powerInput.type = 'number';
      powerInput.min = '1';
      powerInput.max = '500';
      powerInput.value = (Math.random() * 500).toFixed(0);
      powerInput.classList.add('config-input');
      configCard.appendChild(powerLabel);
      configCard.appendChild(powerInput);

      const wheelbaseLabel = document.createElement('label');
      wheelbaseLabel.textContent = `工况 ${i} 底盘轴距 (mm):`;
      const wheelbaseInput = document.createElement('input');
      wheelbaseInput.type = 'number';
      wheelbaseInput.min = '2000';
      wheelbaseInput.max = '4000';
      wheelbaseInput.value = (2000 + Math.random() * 2000).toFixed(0);
      wheelbaseInput.classList.add('config-input');
      configCard.appendChild(wheelbaseLabel);
      configCard.appendChild(wheelbaseInput);

      const voltageLabel = document.createElement('label');
      voltageLabel.textContent = `工况 ${i} 电池电压 (V):`;
      const voltageInput = document.createElement('input');
      voltageInput.type = 'number';
      voltageInput.min = '200';
      voltageInput.max = '800';
      voltageInput.value = (200 + Math.random() * 600).toFixed(0);
      voltageInput.classList.add('config-input');
      configCard.appendChild(voltageLabel);
      configCard.appendChild(voltageInput);

      configContainer.appendChild(configCard);
    }

    this.casesInput.value = '3'; // 默认设置工况数为3
    this.casesInput.parentElement.appendChild(configContainer);
  }
}
