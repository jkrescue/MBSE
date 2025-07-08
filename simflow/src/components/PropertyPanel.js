import React from 'react';
import { Tabs, Button, Input, Select, Upload, message } from 'antd';

const { TabPane } = Tabs;

export default function PropertyPanel() {
  // 这里只是静态结构，后续可根据选中节点动态渲染
  return (
    <div style={{padding: 16}}>
      <Tabs defaultActiveKey="base">
        <TabPane tab="基础配置" key="base">
          <Input placeholder="节点名称" style={{marginBottom: 8}} />
          <Input placeholder="节点类型" style={{marginBottom: 8}} disabled />
          <Input placeholder="描述" style={{marginBottom: 8}} />
        </TabPane>
        <TabPane tab="工具绑定" key="tool">
          <Select style={{width: '100%', marginBottom: 8}} placeholder="选择工具">
            <Select.Option value="polarion">Polarion</Select.Option>
            <Select.Option value="doors">DOORS</Select.Option>
            <Select.Option value="ea">EA</Select.Option>
            <Select.Option value="magicdraw">MagicDraw</Select.Option>
            <Select.Option value="simulink">Simulink</Select.Option>
            <Select.Option value="dymola">Dymola</Select.Option>
            <Select.Option value="ug">UG</Select.Option>
            <Select.Option value="ansys">Ansys</Select.Option>
            <Select.Option value="abaqus">Abaqus</Select.Option>
          </Select>
          <Button type="primary" block>路径检测</Button>
        </TabPane>
        <TabPane tab="模型配置" key="model">
          <Upload>
            <Button block>选择/导入模型文件</Button>
          </Upload>
          <Input placeholder="变量映射" style={{marginTop: 8}} />
          <Input placeholder="脚本路径" style={{marginTop: 8}} />
        </TabPane>
        <TabPane tab="运行控制" key="run">
          <Button type="primary" block style={{marginBottom: 8}}>Run</Button>
          <Button block style={{marginBottom: 8}}>Stop</Button>
          <Button block>查看日志</Button>
        </TabPane>
        <TabPane tab="结果预览" key="result">
          <div style={{height: 120, background: '#f5f6fa', marginBottom: 8, textAlign: 'center', lineHeight: '120px', color: '#aaa'}}>
            结果图像预览
          </div>
          <Button block>导出结果</Button>
        </TabPane>
      </Tabs>
    </div>
  );
}
