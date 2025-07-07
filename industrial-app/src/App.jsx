import { useState } from 'react';
import './App.css';
import DashboardPanel from "./components/DashboardPanel";
import ParamPanel from "./components/ParamPanel";
import { Button, Modal, message, InputNumber } from 'antd';

const mockData = {
  vehicle_config: {
    vehicle_name: "EV-X Prototype",
    mass_kg: 1480,
    engine_power_kw: 180,
    torque_nm: 320,
    drag_coefficient: 0.28,
    frontal_area_m2: 2.1,
    tire_radius_m: 0.32,
    gear_ratio: 4.2,
    track: "Nürburgring",
    lap_count: 3
  },
  simulation_status: {
    is_running: false,
    current_lap: 2,
    progress_percent: 67,
    start_time: "2025-07-07T10:00:00Z",
    estimated_remaining: "00:01:23"
  },
  simulation_result: {
    total_lap_time_s: 495.2,
    max_speed_kph: 208.4,
    total_energy_kwh: 21.8,
    brake_temp_peak_c: 648,
    lap_time_per_lap: [162.3, 164.5, 168.4]
  },
  charts: {
    speed_time: { x: [0, 5, 10, 15, 20], y: [0, 72, 140, 188, 208] },
    torque_time: { x: [0, 5, 10, 15, 20], y: [0, 120, 250, 300, 320] },
    brake_temp_time: { x: [0, 5, 10, 15, 20], y: [300, 480, 620, 648, 640] }
  },
  user_target: {
    target_max_speed_kph: 200,
    target_lap_time_s: 510,
    target_energy_kwh: 22.0,
    target_brake_temp_c: 650
  },
  requirement_validation: [
    { id: "REQ-001", title: "最大速度要求", description: "车辆需达到最高时速 200km/h", type: "性能性", status: "已验证", passed: true },
    { id: "REQ-002", title: "单圈时间阈值", description: "每圈圈速应小于 170s", type: "指标性", status: "未验证", passed: false },
    { id: "REQ-003", title: "能耗限制", description: "每圈能耗应低于 22kWh", type: "能效性", status: "验证中", passed: false },
    { id: "REQ-004", title: "制动热管理", description: "制动盘温度不得超过 650°C", type: "安全性", status: "已验证", passed: true }
  ],
  ui_state: {
    can_start_simulation: true,
    can_stop_simulation: false,
    can_export_report: true,
    is_loading: false,
    active_tab: "charts"
  },
  report: {
    download_url: "/api/report/ev-x-lap-report.pdf",
    generated_at: "2025-07-07T10:08:00Z",
    file_size_kb: 482
  }
};

function App() {
  const [data, setData] = useState(mockData);
  const [simLoading, setSimLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, content: '' });

  // 用户目标输入处理
  const handleTargetChange = (key, value) => {
    setData(d => ({
      ...d,
      user_target: { ...d.user_target, [key]: value }
    }));
  };

  // 仿真按钮交互反馈
  const handleStartSim = () => {
    setSimLoading(true);
    setData(d => ({
      ...d,
      ui_state: { ...d.ui_state, is_loading: true, can_start_simulation: false, can_stop_simulation: true },
      simulation_status: { ...d.simulation_status, is_running: true }
    }));
    setTimeout(() => {
      setSimLoading(false);
      setData(d => ({
        ...d,
        ui_state: { ...d.ui_state, is_loading: false, can_start_simulation: true, can_stop_simulation: false },
        simulation_status: { ...d.simulation_status, is_running: false, progress_percent: 100 },
        simulation_result: { ...d.simulation_result, total_lap_time_s: 490.1 },
        report: { ...d.report, generated_at: new Date().toISOString() }
      }));
      setModal({ visible: true, content: '仿真已完成！' });
    }, 2000);
  };

  // 导出报告交互反馈
  const handleExport = () => {
    setReportLoading(true);
    setTimeout(() => {
      setReportLoading(false);
      message.success('报告已导出！');
    }, 1200);
  };

  return (
    <div className="industrial-app svg-layout-bg">
      {/* 顶部标题栏 */}
      <header className="svg-header">
        <div className="svg-title">整车性能-赛道<span style={{fontWeight:700}}>APP</span></div>
        <Button type="link" className="svg-open-btn" href="/workflow" target="_blank">打开应用</Button>
      </header>
      {/* 主体网格布局 */}
      <div className="svg-main-grid">
        {/* 第一行：参数配置+目标设置/仿真控制 */}
        <div className="svg-param-card">
          <ParamPanel vehicleConfig={data.vehicle_config} />
        </div>
        <div className="svg-target-card">
          <div className="svg-target-section">
            <div className="svg-target-title">目标设置</div>
            <div className="svg-target-inputs">
              <div>最高速度目标：<InputNumber value={data.user_target.target_max_speed_kph} min={0} max={500} style={{width:80}} readOnly /> km/h</div>
              <div>单圈时间目标：<InputNumber value={data.user_target.target_lap_time_s} min={0} max={1000} style={{width:80}} readOnly /> s</div>
              <div>能耗目标：<InputNumber value={data.user_target.target_energy_kwh} min={0} max={100} style={{width:80}} readOnly /> kWh</div>
              <div>制动温度目标：<InputNumber value={data.user_target.target_brake_temp_c} min={0} max={1000} style={{width:80}} readOnly /> ℃</div>
            </div>
          </div>
          <div className="svg-sim-control">
            <div className="svg-sim-btns">
              <Button type="primary" loading={simLoading || data.ui_state.is_loading} disabled={!data.ui_state.can_start_simulation} onClick={handleStartSim} style={{marginRight:12}}>
                {simLoading || data.ui_state.is_loading ? '仿真中...' : '开始仿真'}
              </Button>
              <Button danger disabled={!data.ui_state.can_stop_simulation} style={{marginRight:12}}>
                停止仿真
              </Button>
              <Button onClick={handleExport} loading={reportLoading} disabled={!data.ui_state.can_export_report} style={{marginLeft:12}}>
                导出报告
              </Button>
            </div>
            <div className="svg-sim-progress">
              <span>当前进度：</span>
              <div className="svg-progress-bar">
                <div className="svg-progress-inner" style={{width:`${data.simulation_status.progress_percent}%`}}></div>
              </div>
              <span style={{marginLeft:8}}>{data.simulation_status.progress_percent}%</span>
            </div>
          </div>
        </div>
        {/* 第二行：结果预览（KPI） */}
        <div className="svg-result-card" style={{gridColumn:'1/3'}}>
          <div className="svg-result-title">结果预览</div>
          <div className="svg-kpi-row">
            <div className="svg-kpi-item">
              <div className="svg-kpi-label">总圈时(s)</div>
              <div className="svg-kpi-value">{data.simulation_result.total_lap_time_s}</div>
            </div>
            <div className="svg-kpi-item">
              <div className="svg-kpi-label">最高速度(km/h)</div>
              <div className="svg-kpi-value">{data.simulation_result.max_speed_kph} / 目标 {data.user_target.target_max_speed_kph} {data.simulation_result.max_speed_kph >= data.user_target.target_max_speed_kph ? <span className="svg-kpi-pass">✔</span> : <span className="svg-kpi-fail">✘</span>}</div>
            </div>
            <div className="svg-kpi-item">
              <div className="svg-kpi-label">总能耗(kWh)</div>
              <div className="svg-kpi-value">{data.simulation_result.total_energy_kwh} / 目标 {data.user_target.target_energy_kwh} {data.simulation_result.total_energy_kwh <= data.user_target.target_energy_kwh ? <span className="svg-kpi-pass">✔</span> : <span className="svg-kpi-fail">✘</span>}</div>
            </div>
            <div className="svg-kpi-item">
              <div className="svg-kpi-label">制动温度峰值(℃)</div>
              <div className="svg-kpi-value">{data.simulation_result.brake_temp_peak_c} / 目标 {data.user_target.target_brake_temp_c} {data.simulation_result.brake_temp_peak_c <= data.user_target.target_brake_temp_c ? <span className="svg-kpi-pass">✔</span> : <span className="svg-kpi-fail">✘</span>}</div>
            </div>
          </div>
        </div>
        {/* 第三行：三图表，横向排布，紧贴KPI区下方 */}
        <div className="svg-chart-row" style={{gridColumn:'1/3',marginTop:'-8px',marginBottom:'8px'}}>
          <div className="svg-chart-item">
            <DashboardPanel simulationResult={data.simulation_result} charts={data.charts} userTarget={data.user_target} chartType="speed" />
          </div>
          <div className="svg-chart-item">
            <DashboardPanel simulationResult={data.simulation_result} charts={data.charts} userTarget={data.user_target} chartType="torque" />
          </div>
          <div className="svg-chart-item">
            <DashboardPanel simulationResult={data.simulation_result} charts={data.charts} userTarget={data.user_target} chartType="brake" />
          </div>
        </div>
        {/* 第四行：需求追踪 */}
        <div className="svg-req-card" style={{gridColumn:'1/3'}}>
          <div className="svg-req-title-row">
            <span className="svg-req-title">需求追踪</span>
            <a className="svg-req-link" href="#" style={{float:'right'}}>查看完整的需求追溯关系</a>
          </div>
          <div className="svg-req-table-wrap">
            <table className="svg-req-table">
              <thead>
                <tr>
                  <th>ID</th><th>标题</th><th>描述</th><th>类型</th><th>状态</th><th>通过</th>
                </tr>
              </thead>
              <tbody>
                {data.requirement_validation.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.type}</td>
                    <td>{item.status}</td>
                    <td>{item.passed ? <span className="svg-kpi-pass">✔</span> : item.status === '验证中' ? <span className="svg-kpi-pending">⏳</span> : <span className="svg-kpi-fail">✘</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal open={modal.visible} onCancel={()=>setModal({visible:false,content:''})} onOk={()=>setModal({visible:false,content:''})} okText="知道了" cancelText="关闭">
        {modal.content}
      </Modal>
    </div>
  );
}

export default App;
