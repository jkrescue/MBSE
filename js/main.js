import { MBSEApp } from './app.js';
import { RequirementsModule } from './requirements.js';
import { ArchitectureModule } from './architecture.js';
import { SimulationModule } from './simulation.js';
import { TraceabilityModule } from './traceability.js';
// uiUtils are imported directly by modules/app that need them
// mbseData is imported directly by modules that need it
// logger is imported directly

document.addEventListener('DOMContentLoaded', async () => {
    if (window.mermaid) {
        try {
            // Using `await window.mermaid.initialize(...)` if it's async and you need to wait
            window.mermaid.initialize({ 
                startOnLoad: false, // We'll call run() manually
                theme: 'neutral', // 'default', 'neutral', 'forest', 'dark'
                // securityLevel: 'loose' // If complex diagrams have issues
            });
        } catch (e) {
            console.error("Mermaid initialization error:", e);
        }
    } else {
        console.error("Mermaid script not loaded or failed to initialize globally.");
    }

    const requirementsModule = new RequirementsModule();
    const architectureModule = new ArchitectureModule();
    const simulationModule = new SimulationModule();
    const traceabilityModule = new TraceabilityModule();

    const app = new MBSEApp(
        requirementsModule,
        architectureModule,
        simulationModule,
        traceabilityModule
    );
    
    // Make app instance globally available for easy debugging (optional)
    // window.mbseAppInstance = app; 
    
    app.init();
    
    // 模块切换处理
    document.querySelectorAll('.sidebar-menu').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const moduleName = btn.getAttribute('data-module');
        switchModule(moduleName);
      });
    });

    function switchModule(moduleName) {
      // 隐藏所有模块内容
      document.querySelectorAll('.module-content').forEach(el => el.classList.add('hidden'));
      // 显示选中的模块
      const targetModule = document.getElementById(`${moduleName}-module`);
      if (targetModule) {
        targetModule.classList.remove('hidden');
      }
      
      // 更新左侧菜单active状态
      document.querySelectorAll('.sidebar-menu').forEach(el => {
        el.classList.remove('bg-primary', 'text-white');
        el.classList.add('text-gray-700', 'hover:bg-gray-100');
      });
      const activeMenu = document.querySelector(`.sidebar-menu[data-module="${moduleName}"]`);
      if (activeMenu) {
        activeMenu.classList.remove('text-gray-700', 'hover:bg-gray-100');
        activeMenu.classList.add('bg-primary', 'text-white');
      }
    }
});
