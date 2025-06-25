import { useState } from 'react';
import './AppView.css';

function AppView() {
  const saved = JSON.parse(localStorage.getItem('publishedWorkflow') || '{}');
  const [tab, setTab] = useState('overview');
  const params = saved.params || {};
  return (
    <div className="app-view">
      <h2>{saved.name || 'Workflow App'}</h2>
      <a href="/">返回设计器</a>
      <nav>
        <button onClick={() => setTab('overview')}>总览</button>
        <button onClick={() => setTab('params')}>参数</button>
        <button onClick={() => setTab('models')}>模型</button>
        <button onClick={() => setTab('results')}>结果</button>
        <button onClick={() => setTab('trace')}>追溯</button>
      </nav>
      {tab === 'overview' && (
        <div>
          <h3>节点状态</h3>
          <ul>
            {saved.nodes?.map((n) => (
              <li key={n.id}>
                {n.data.label} - {n.data.status || 'pending'}
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab === 'params' && (
        <div>
          <h3>基本参数</h3>
          <pre>{JSON.stringify(params, null, 2)}</pre>
        </div>
      )}
      {tab === 'models' && <div>模型页占位符</div>}
      {tab === 'results' && <div>结果页占位符</div>}
      {tab === 'trace' && <div>追溯页占位符</div>}
    </div>
  );
}

export default AppView;
