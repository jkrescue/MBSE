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
});
