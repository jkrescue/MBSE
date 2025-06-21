const { useState } = React;

const mockData = {
  models: [
    {
      id: 'm1',
      name: 'DriveController',
      type: 'MATLAB',
      owner: 'zhangsan',
      visibility: 'public',
      tags: ['#standard', '#control'],
      versions: [
        {
          id: 'm1v1',
          tag: 'v1.0',
          status: 'published',
          metadata: {
            inputs: [{ name: 'throttle', type: 'double', unit: '%' }],
            outputs: [{ name: 'torque', type: 'double', unit: 'Nm' }],
            parameters: [{ name: 'gain', default: 1.0, type: 'double' }]
          }
        },
        {
          id: 'm1v2',
          tag: 'v1.1',
          status: 'draft',
          metadata: {
            inputs: [{ name: 'throttle', type: 'double' }, { name: 'brake', type: 'double' }],
            outputs: [{ name: 'torque', type: 'double' }],
            parameters: [{ name: 'gain', default: 1.2, type: 'double' }]
          }
        }
      ]
    },
    {
      id: 'm2',
      name: 'BatteryModel',
      type: 'Modelica',
      owner: 'lisi',
      visibility: 'private',
      tags: ['#battery'],
      versions: [
        {
          id: 'm2v1',
          tag: 'v2.0',
          status: 'published',
          metadata: {
            inputs: [{ name: 'temp', type: 'double' }],
            outputs: [{ name: 'voltage', type: 'double' }],
            parameters: [{ name: 'cap', default: 100, type: 'double' }]
          }
        }
      ]
    }
  ]
};

function Nav({ current, setPage }) {
  const buttons = [
    ['overview', '模型总览'],
    ['upload', '上传模型'],
  ];
  return (
    <nav>
      {buttons.map(([key, label]) => (
        <button key={key} onClick={() => setPage(key)} disabled={current === key}>{label}</button>
      ))}
    </nav>
  );
}

function Sidebar({ types, selectedTypes, toggleType }) {
  return (
    <div className="side">
      <h4>模型类型</h4>
      {types.map(type => (
        <div key={type}>
          <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => toggleType(type)} /> {type}
        </div>
      ))}
    </div>
  );
}

function ModelList({ models, selectModel }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>名称</th>
          <th>类型</th>
          <th>上传者</th>
          <th>可见性</th>
          <th>最新版本</th>
        </tr>
      </thead>
      <tbody>
        {models.map(m => {
          const latest = m.versions[m.versions.length - 1];
          return (
            <tr key={m.id} onClick={() => selectModel(m)} style={{ cursor: 'pointer' }}>
              <td>{m.name}</td>
              <td>{m.type}</td>
              <td>{m.owner}</td>
              <td>{m.visibility}</td>
              <td>{latest.tag} ({latest.status})</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function MetadataView({ metadata }) {
  return (
    <div>
      <h4>接口信息</h4>
      <pre>{JSON.stringify(metadata, null, 2)}</pre>
    </div>
  );
}

function VersionList({ versions, selectVersion }) {
  return (
    <div>
      <h4>版本列表</h4>
      <ul>
        {versions.map(v => (
          <li key={v.id} onClick={() => selectVersion(v)} style={{cursor: 'pointer'}}>
            {v.tag} - {v.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModelDetail({ model, close }) {
  const [version, setVersion] = useState(model.versions[model.versions.length - 1]);
  return (
    <div className="container">
      <button onClick={close}>返回</button>
      <h2>{model.name}</h2>
      <p>类型: {model.type}</p>
      <p>上传者: {model.owner}</p>
      <p>可见性: {model.visibility}</p>
      <VersionList versions={model.versions} selectVersion={setVersion} />
      <MetadataView metadata={version.metadata} />
    </div>
  );
}

function UploadPage({ addModel }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('MATLAB');
  const [owner, setOwner] = useState('');

  function submit(e) {
    e.preventDefault();
    const newModel = {
      id: 'm' + Math.random().toString(36).slice(2, 6),
      name,
      type,
      owner,
      visibility: 'private',
      tags: [],
      versions: [
        {
          id: 'v1',
          tag: 'v1.0',
          status: 'draft',
          metadata: { inputs: [], outputs: [], parameters: [] }
        }
      ]
    };
    addModel(newModel);
  }

  return (
    <div className="container">
      <h2>上传模型</h2>
      <form onSubmit={submit}>
        <div>
          <label>名称:</label>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label>类型:</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option>MATLAB</option>
            <option>Modelica</option>
            <option>SysML</option>
          </select>
        </div>
        <div>
          <label>上传者:</label>
          <input value={owner} onChange={e => setOwner(e.target.value)} />
        </div>
        <button type="submit">提交</button>
      </form>
    </div>
  );
}

function OverviewPage({ models, setModels, selectModel }) {
  const [filter, setFilter] = useState('');
  const [selectedTypes, setSelectedTypes] = useState(['MATLAB', 'Modelica', 'SysML']);

  const types = ['MATLAB', 'Modelica', 'SysML'];
  const toggleType = (type) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };
  const filtered = models.filter(m =>
    m.name.toLowerCase().includes(filter.toLowerCase()) && selectedTypes.includes(m.type)
  );

  return (
    <div className="container">
      <Sidebar types={types} selectedTypes={selectedTypes} toggleType={toggleType} />
      <div className="main">
        <div>
          <input type="text" placeholder="搜索模型" value={filter} onChange={e => setFilter(e.target.value)} />
        </div>
        <ModelList models={filtered} selectModel={selectModel} />
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('overview');
  const [models, setModels] = useState(mockData.models);
  const [selectedModel, setSelectedModel] = useState(null);

  const addModel = (model) => {
    setModels([...models, model]);
    setPage('overview');
  };

  if (selectedModel) {
    return <ModelDetail model={selectedModel} close={() => setSelectedModel(null)} />;
  }

  return (
    <div>
      <header>
        <h1>MMP Demo</h1>
        <Nav current={page} setPage={setPage} />
      </header>
      {page === 'overview' && <OverviewPage models={models} setModels={setModels} selectModel={setSelectedModel} />}
      {page === 'upload' && <UploadPage addModel={addModel} />}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
