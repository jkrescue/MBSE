import React from "react";
import { Input } from "antd";
import "../App.css";

export default function HeaderBar() {
  return (
    <div className="header-bar">
      <span className="app-title">🚗 功能分析器（工业App）</span>
      <Input placeholder="🎯 目标值输入（如：速度 > 50）" style={{ width: 300, marginLeft: 24 }} />
    </div>
  );
}
