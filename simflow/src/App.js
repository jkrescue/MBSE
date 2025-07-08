import React from 'react';
import { Layout, Menu, Button, Tabs, message } from 'antd';
import { PlayCircleOutlined, StopOutlined, FileAddOutlined, SaveOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';
import Palette from './components/Palette';
import FlowCanvas from './components/FlowCanvas';
import PropertyPanel from './components/PropertyPanel';
import StatusBar from './components/StatusBar';
import './App.css';

const { Header, Sider, Content } = Layout;

export default function App() {
  return (
    <Layout style={{height: '100vh'}}>
      {/* 顶部工具栏 */}
      <Header className="toolbar" style={{background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee'}}>
        <Button icon={<FileAddOutlined />} type="text">新建</Button>
        <Button icon={<SaveOutlined />} type="text">保存</Button>
        <Button icon={<ImportOutlined />} type="text">导入流程</Button>
        <Button icon={<ExportOutlined />} type="text">导出报告</Button>
        <Button icon={<PlayCircleOutlined />} type="primary" style={{marginLeft: 16}}>运行</Button>
        <Button icon={<StopOutlined />} type="default" style={{marginLeft: 8}}>终止</Button>
        <div style={{flex: 1}} />
        <span style={{fontWeight: 'bold'}}>SimFlow 工作流编排平台</span>
      </Header>
      <Layout>
        {/* 左侧节点库 */}
        <Sider width={220} className="palette-sider" style={{background: '#fafafa', borderRight: '1px solid #eee'}}>
          <Palette />
        </Sider>
        {/* 中央画布与右侧属性面板 */}
        <Layout>
          <Content style={{padding: 0, background: '#f5f6fa', display: 'flex'}}>
            <div style={{flex: 2, minWidth: 0, borderRight: '1px solid #eee'}}>
              <FlowCanvas />
            </div>
            <div style={{width: 340, background: '#fff', minHeight: '100vh'}}>
              <PropertyPanel />
            </div>
          </Content>
          {/* 底部状态栏 */}
          <StatusBar />
        </Layout>
      </Layout>
    </Layout>
  );
}
