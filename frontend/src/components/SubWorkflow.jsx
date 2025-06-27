import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

export default function SubWorkflow({ nodes, edges, onNodeClick }) {
  return (
    <div style={{ height: '400px', width: '600px' }}>
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
