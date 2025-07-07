import React from "react";
import { Button, Progress } from "antd";

export default function ControlPanel({ simulationStatus, uiState }) {
  return (
    <div className="control-panel">
      <div style={{ marginBottom: 12 }}>
        <Button type="primary" style={{ margin: 8 }} disabled={!uiState.can_start_simulation}>开始仿真</Button>
        <Button style={{ margin: 8 }} disabled={!uiState.can_stop_simulation}>停止仿真</Button>
      </div>
      <div style={{ marginBottom: 8 }}>
        当前圈数：{simulationStatus.current_lap} / {simulationStatus.lap_count || 3}
      </div>
      <Progress percent={simulationStatus.progress_percent} status={uiState.is_loading ? 'active' : 'normal'} />
      <div style={{ marginTop: 8 }}>
        预计剩余时间：{simulationStatus.estimated_remaining}
      </div>
    </div>
  );
}
