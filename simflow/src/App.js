import React, { useState } from 'react';
import { Layout, Button, message } from 'antd';
import { PlayCircleOutlined, FileAddOutlined } from '@ant-design/icons';
import Palette from './components/Palette';
import FlowCanvas from './components/FlowCanvas';
import PropertyPanel from './components/PropertyPanel';

const { Header, Sider, Content } = Layout;

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  
  console.log('SimFlow App 组件渲染');

  return (
    <div style={{ height: '100vh', background: '#f0f2f5' }}>
      <Layout style={{ height: '100%' }}>
        {/* 顶部工具栏 */}
        <Header style={{ 
          background: '#fff',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #d9d9d9'
        }}>
          <Button 
            icon={<FileAddOutlined />}
            onClick={() => message.info('新建功能')}
          >
            新建
          </Button>
          <Button 
            icon={<PlayCircleOutlined />}
            type="primary"
            style={{ marginLeft: 16 }}
            onClick={() => message.success('运行功能')}
          >
            运行
          </Button>
          <div style={{ flex: 1 }} />
          <span style={{ fontWeight: 'bold', fontSize: 16 }}>
            SimFlow 工作流编排平台
          </span>
        </Header>
        
        <Layout>
          {/* 左侧节点库 */}
          <Sider 
            width={240} 
            style={{ 
              background: '#fafafa',
              borderRight: '1px solid #d9d9d9'
            }}
          >
            <Palette />
          </Sider>

          {/* 中央画布 */}
          <Content style={{ 
            background: '#fff',
            margin: 0,
            display: 'flex'
          }}>
            <div style={{ 
              flex: 1, 
              borderRight: '1px solid #d9d9d9'
            }}>
              <FlowCanvas onNodeSelect={setSelectedNode} />
            </div>
            
            {/* 右侧属性面板 */}
            <div style={{ 
              width: 300, 
              background: '#fafafa',
              borderLeft: '1px solid #d9d9d9'
            }}>
              <PropertyPanel selectedNode={selectedNode} />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
