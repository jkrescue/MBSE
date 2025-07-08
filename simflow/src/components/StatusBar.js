import React from 'react';
import { Progress } from 'antd';

export default function StatusBar() {
  return (
    <div style={{height: 32, background: '#f0f2f5', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', padding: '0 16px'}}>
      <span>执行状态：</span>
      <Progress percent={30} size="small" style={{width: 120, margin: '0 16px'}} />
      <span>并行度：4</span>
      <span style={{marginLeft: 24}}>当前任务：节点A → 节点B</span>
    </div>
  );
}
