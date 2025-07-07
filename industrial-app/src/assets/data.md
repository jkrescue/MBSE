1. 整车参数配置数据（用户输入）
json
复制
编辑
{
  "vehicle_config": {
    "vehicle_name": "EV-X Prototype",
    "mass_kg": 1480,
    "engine_power_kw": 180,
    "torque_nm": 320,
    "drag_coefficient": 0.28,
    "frontal_area_m2": 2.1,
    "tire_radius_m": 0.32,
    "gear_ratio": 4.2,
    "track": "Nürburgring",
    "lap_count": 3
  }
}
✅ 2. 仿真控制状态（按钮控制反馈）
json
复制
编辑
{
  "simulation_status": {
    "is_running": false,
    "current_lap": 2,
    "progress_percent": 67,
    "start_time": "2025-07-07T10:00:00Z",
    "estimated_remaining": "00:01:23"
  }
}
✅ 3. 仿真结果数据（用于图表显示）
json
复制
编辑
{
  "simulation_result": {
    "total_lap_time_s": 495.2,
    "max_speed_kph": 208.4,
    "total_energy_kwh": 21.8,
    "brake_temp_peak_c": 648,
    "lap_time_per_lap": [162.3, 164.5, 168.4]
  },
  "charts": {
    "speed_time": {
      "x": [0, 5, 10, 15, 20],
      "y": [0, 72, 140, 188, 208]
    },
    "torque_time": {
      "x": [0, 5, 10, 15, 20],
      "y": [0, 120, 250, 300, 320]
    },
    "brake_temp_time": {
      "x": [0, 5, 10, 15, 20],
      "y": [300, 480, 620, 648, 640]
    }
  }
}
✅ 4. 用户设定目标数据（用于需求验证）
json
复制
编辑
{
  "user_target": {
    "target_max_speed_kph": 200,
    "target_lap_time_s": 510,
    "target_energy_kwh": 22.0,
    "target_brake_temp_c": 650
  }
}
✅ 5. 需求验证项（展示在页面底部需求追踪表中）
json
复制
编辑
{
  "requirement_validation": [
    {
      "id": "REQ-001",
      "title": "最大速度要求",
      "description": "车辆需达到最高时速 200km/h",
      "type": "性能性",
      "status": "已验证",
      "passed": true
    },
    {
      "id": "REQ-002",
      "title": "单圈时间阈值",
      "description": "每圈圈速应小于 170s",
      "type": "指标性",
      "status": "未验证",
      "passed": false
    },
    {
      "id": "REQ-003",
      "title": "能耗限制",
      "description": "每圈能耗应低于 22kWh",
      "type": "能效性",
      "status": "验证中",
      "passed": false
    },
    {
      "id": "REQ-004",
      "title": "制动热管理",
      "description": "制动盘温度不得超过 650°C",
      "type": "安全性",
      "status": "已验证",
      "passed": true
    }
  ]
}
✅ 6. UI 表现控制状态（可传给前端控制按钮/图表状态）
json
复制
编辑
{
  "ui_state": {
    "can_start_simulation": true,
    "can_stop_simulation": false,
    "can_export_report": true,
    "is_loading": false,
    "active_tab": "charts"
  }
}
✅ 7. 报告导出信息（用于提示或文件下载）
json
复制
编辑
{
  "report": {
    "download_url": "/api/report/ev-x-lap-report.pdf",
    "generated_at": "2025-07-07T10:08:00Z",
    "file_size_kb": 482
  }
}
✅ 数据集说明（汇总）
模块	接口用途	备注
vehicle_config	参数输入/初始化界面	与表单绑定
simulation_status	控制区按钮动态更新	用于 loading 和进度显示
simulation_result	图表与指标展示	提供仿真指标与图表数据
requirement_validation	底部需求追踪表	可标记 ✅❌⏳ 状态
user_target	用户目标设定输入	可与结果进行自动比对
report	导出 PDF 报告	报告下载链接
ui_state	控制按钮可用状态	与交互逻辑联动