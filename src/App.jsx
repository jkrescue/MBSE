import React from "react";
import HeaderBar from "./components/HeaderBar";
import "./App.css";

export default function App() {
  return (
    <div className="app-bg">
      <HeaderBar />
      {/* 后续将添加 main-content、图表区、需求表等 */}
      <div className="main-content">
        {/* DashboardPanel、ControlPanel、ParamPanel 组件占位 */}
      </div>
      {/* ChartPanel 组件占位 */}
      {/* RequirementTable 组件占位 */}
    </div>
  );
}
