import React, { useMemo } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeStyle = {
  border: '2px solid #ddd',
  borderRadius: '8px',
  padding: '10px 15px',
  fontSize: '14px',
  fontWeight: 'bold',
  background: '#fff',
};

const ModelLineageGraph = ({ model, allModels }) => {
    const { nodes, edges } = useMemo(() => {
        if (!model) return { nodes: [], edges: [] };

        const initialNodes = [];
        const initialEdges = [];

        // 1. Central Node (Current Model)
        const centralNode = {
            id: model.id,
            position: { x: 400, y: 200 },
            data: { label: `${model.name}\n(当前模型)` },
            style: { ...nodeStyle, borderColor: '#2980b9', background: '#eaf5ff' },
        };
        initialNodes.push(centralNode);

        // 2. Upstream Dependencies (Inputs)
        const latestVersion = model.versions[0];
        if (latestVersion?.dependencies) {
            latestVersion.dependencies.forEach((dep, index) => {
                const depModel = allModels.find(m => m.id === dep.modelId);
                const depLabel = depModel ? `${depModel.name}\nv${dep.version}` : `未知模型\n${dep.modelId}`;
                initialNodes.push({
                    id: dep.modelId,
                    type: 'input',
                    position: { x: 50, y: index * 120 },
                    data: { label: depLabel },
                    style: { ...nodeStyle, borderColor: '#27ae60' },
                });
                initialEdges.push({
                    id: `e-${dep.modelId}-${model.id}`,
                    source: dep.modelId,
                    target: model.id,
                    animated: true,
                    markerEnd: { type: 'arrowclosed' },
                });
            });
        }

        // 3. Downstream Impacts (Outputs)
        const downstreamModels = allModels.filter(m => 
            m.versions.some(v => 
                v.dependencies?.some(d => d.modelId === model.id)
            )
        );

        downstreamModels.forEach((downstreamModel, index) => {
            initialNodes.push({
                id: downstreamModel.id,
                type: 'output',
                position: { x: 750, y: index * 120 },
                data: { label: downstreamModel.name },
                style: { ...nodeStyle, borderColor: '#f39c12' },
            });
            initialEdges.push({
                id: `e-${model.id}-${downstreamModel.id}`,
                source: model.id,
                target: downstreamModel.id,
                markerEnd: { type: 'arrowclosed' },
            });
        });

        return { nodes: initialNodes, edges: initialEdges };
    }, [model, allModels]);

    return (
        <div style={{ height: '500px', width: '100%', border: '1px solid #eee', borderRadius: '8px' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};

export default ModelLineageGraph; 