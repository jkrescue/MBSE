import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardPanel({ simulationResult, charts, userTarget, chartType }) {
  // 图表类型与数据映射
  let chartConfig = null;
  if (chartType === 'speed') {
    chartConfig = {
      title: '速度-时间',
      data: {
        labels: charts.speed_time.x,
        datasets: [{ label: '速度(km/h)', data: charts.speed_time.y, borderColor: '#1890ff', fill: false }]
      }
    };
  } else if (chartType === 'torque') {
    chartConfig = {
      title: '扭矩-时间',
      data: {
        labels: charts.torque_time.x,
        datasets: [{ label: '扭矩(Nm)', data: charts.torque_time.y, borderColor: '#52c41a', fill: false }]
      }
    };
  } else if (chartType === 'brake') {
    chartConfig = {
      title: '制动温度-时间',
      data: {
        labels: charts.brake_temp_time.x,
        datasets: [{ label: '制动温度(℃)', data: charts.brake_temp_time.y, borderColor: '#faad14', fill: false }]
      }
    };
  }
  return (
    <div className="dashboard-panel" style={{background:'none',boxShadow:'none',padding:0}}>
      <h4 style={{fontWeight:500,fontSize:'1.05rem',margin:'0 0 8px 0',textAlign:'left'}}>{chartConfig.title}</h4>
      <Line data={chartConfig.data} options={{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'top'}}}} height={180} />
    </div>
  );
}
