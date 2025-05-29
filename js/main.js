import { MBSEApp } from './app.js';
import { RequirementsModule } from './requirements.js';
import { ArchitectureModule } from './architecture.js';
import { SimulationModule } from './simulation.js';
import { TraceabilityModule } from './traceability.js';
import { WorkflowModule } from './workflow.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (window.mermaid) {
        try {
            window.mermaid.initialize({ 
                startOnLoad: false,
                theme: 'neutral',
            });
        } catch (e) {
            console.error("Mermaid initialization error:", e);
        }
    }

    const requirementsModule = new RequirementsModule();
    const architectureModule = new ArchitectureModule();
    const simulationModule = new SimulationModule();
    const traceabilityModule = new TraceabilityModule();
    const workflowModule = new WorkflowModule();

    const app = new MBSEApp(
        requirementsModule,
        architectureModule,
        simulationModule,
        traceabilityModule,
        workflowModule
    );
    
    app.init();
});