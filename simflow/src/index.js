import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css';

console.log('SimFlow 入口文件开始加载');

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('React 根节点创建完成');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('React 应用渲染完成');
