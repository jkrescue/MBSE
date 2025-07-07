import React, { useState } from "react";
import { Input, InputNumber, Form, Card } from "antd";

export default function ParamPanel({ vehicleConfig }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Card
      className="param-card"
      title={<span>整车参数配置</span>}
      extra={<a onClick={() => setCollapsed(c => !c)} style={{fontSize:14}}>{collapsed ? '展开' : '收起'}</a>}
      style={{ 
        width: '100%', 
        minWidth: 320, 
        maxWidth: 480, 
        minHeight: 400, 
        maxHeight: 600, 
        margin: '0 auto',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        borderRadius: 8, 
        boxShadow: '0 2px 8px #0001', 
        border: '1px solid #dbe2ea',
        background: '#fff'
      }}
      bodyStyle={{ padding: collapsed ? 0 : 16, display: collapsed ? 'none' : 'block', overflow: 'auto', maxHeight: 520 }}
      headStyle={{ fontWeight: 600, fontSize: 16 }}
    >
      {!collapsed && (
        <Form layout="vertical">
          <Form.Item label="车型名称">
            <Input value={vehicleConfig.vehicle_name} readOnly />
          </Form.Item>
          <Form.Item label="整备质量(kg)">
            <InputNumber value={vehicleConfig.mass_kg} readOnly style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="发动机功率(kW)">
            <InputNumber value={vehicleConfig.engine_power_kw} readOnly style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="最大扭矩(Nm)">
            <InputNumber value={vehicleConfig.torque_nm} readOnly style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="风阻系数">
            <InputNumber value={vehicleConfig.drag_coefficient} readOnly style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="正面面积(m²)">
            <InputNumber value={vehicleConfig.frontal_area_m2} readOnly style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="轮胎半径(m)">
            <InputNumber value={vehicleConfig.tire_radius_m} readOnly style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="传动比">
            <InputNumber value={vehicleConfig.gear_ratio} readOnly style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="赛道">
            <Input value={vehicleConfig.track} readOnly />
          </Form.Item>
          <Form.Item label="圈数">
            <InputNumber value={vehicleConfig.lap_count} readOnly style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      )}
    </Card>
  );
}
