import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';

// 自定义节点组件
import CustomTaskNode from './nodes/CustomTaskNode';
import CustomStartNode from './nodes/CustomStartNode';
import CustomEndNode from './nodes/CustomEndNode';
import CustomGatewayNode from './nodes/CustomGatewayNode';
import CustomSubProcessNode from './nodes/CustomSubProcessNode';

// 节点类型映射
const nodeTypes = {
  task: CustomTaskNode,
  startEvent: CustomStartNode,
  endEvent: CustomEndNode,
  gateway: CustomGatewayNode,
  subProcess: CustomSubProcessNode,
};

function ReactFlowModeler({ onNodeClick, onNodeDoubleClick, initialData = null }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // 初始化数据
  React.useEffect(() => {
    if (initialData) {
      setNodes(initialData.nodes || []);
      setEdges(initialData.edges || []);
    } else {
      // 默认空画布
      setNodes([]);
      setEdges([]);
    }
  }, [initialData]);

  // 连接处理
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // 节点点击处理
  const onNodeClickHandler = useCallback(
    (event, node) => {
      setSelectedNode(node);
      if (onNodeClick) {
        onNodeClick(node);
      }
    },
    [onNodeClick]
  );

  // 节点双击处理
  const onNodeDoubleClickHandler = useCallback(
    (event, node) => {
      if (onNodeDoubleClick) {
        onNodeDoubleClick(node);
      }
    },
    [onNodeDoubleClick]
  );

  // 添加节点
  const addNode = useCallback((type, position) => {
    const newNode = {
      id: `${type}_${Date.now()}`,
      type: type,
      position: position,
      data: {
        label: `新建${getNodeTypeName(type)}`,
        type: type,
        properties: getDefaultProperties(type),
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // 获取节点类型名称
  const getNodeTypeName = (type) => {
    const typeNames = {
      startEvent: '开始事件',
      task: '任务',
      gateway: '网关',
      subProcess: '子流程',
      endEvent: '结束事件',
    };
    return typeNames[type] || '节点';
  };

  // 获取默认属性
  const getDefaultProperties = (type) => {
    const defaultProps = {
      startEvent: { name: '开始', id: '' },
      task: { name: '任务', id: '', assignee: '', description: '' },
      gateway: { name: '网关', id: '', gatewayType: 'exclusive' },
      subProcess: { name: '子流程', id: '', description: '' },
      endEvent: { name: '结束', id: '' },
    };
    return defaultProps[type] || {};
  };

  // 删除选中节点
  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  // 导出数据
  const exportData = useCallback(() => {
    return {
      nodes: nodes.map(node => ({
        ...node,
        data: { ...node.data }
      })),
      edges: edges.map(edge => ({
        ...edge
      }))
    };
  }, [nodes, edges]);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClickHandler}
        onNodeDoubleClick={onNodeDoubleClickHandler}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap />
        
        {/* 工具栏 */}
        <Panel position="top-left">
          <div style={{ 
            background: 'white', 
            padding: '8px', 
            borderRadius: '4px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '4px'
          }}>
            <button 
              onClick={() => addNode('startEvent', { x: 100, y: 100 })}
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              开始事件
            </button>
            <button 
              onClick={() => addNode('task', { x: 100, y: 100 })}
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              任务
            </button>
            <button 
              onClick={() => addNode('gateway', { x: 100, y: 100 })}
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              网关
            </button>
            <button 
              onClick={() => addNode('subProcess', { x: 100, y: 100 })}
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              子流程
            </button>
            <button 
              onClick={() => addNode('endEvent', { x: 100, y: 100 })}
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              结束事件
            </button>
            {selectedNode && (
              <button 
                onClick={deleteSelectedNode}
                style={{ padding: '4px 8px', fontSize: '12px', color: 'red' }}
              >
                删除
              </button>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default ReactFlowModeler; 