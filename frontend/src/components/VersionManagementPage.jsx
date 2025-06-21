import React, { useState, useEffect } from 'react';
import './VersionManagementPage.css';

// 基于LCS的精确Diff算法
function diffLines(a, b) {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const n = aLines.length;
  const m = bLines.length;
  
  const lcs = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (aLines[i - 1] === bLines[j - 1]) {
        lcs[i][j] = 1 + lcs[i - 1][j - 1];
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }

  const result = [];
  let i = n, j = m;
  let added = 0, removed = 0;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      result.push({ type: 'equal', leftLine: i, rightLine: j, left: aLines[i - 1], right: bLines[j - 1] });
      i--; j--;
    } else if (i > 0 && j > 0 && aLines[i - 1] !== bLines[j - 1]) {
      result.push({ type: 'changed', leftLine: i, rightLine: j, left: aLines[i - 1], right: bLines[j - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      result.push({ type: 'added', leftLine: null, rightLine: j, left: '', right: bLines[j - 1] });
      j--; added++;
    } else if (i > 0 && (j === 0 || lcs[i][j - 1] < lcs[i - 1][j])) {
      result.push({ type: 'removed', leftLine: i, rightLine: null, left: aLines[i - 1], right: '' });
      i--; removed++;
    }
  }
  
  result.reverse();
  const conclusion = `${added} 行增加, ${removed} 行删除。`;
  return { diffs: result, conclusion };
}

function diffVersions(v1, v2) {
  const diffs = [];
  if (v1.description !== v2.description) diffs.push('描述');
  if (v1.creator !== v2.creator) diffs.push('创建者');
  if (v1.date !== v2.date) diffs.push('创建时间');
  // 文件名对比
  const files1 = v1.files ? v1.files.map(f => f.name) : [];
  const files2 = v2.files ? v2.files.map(f => f.name) : [];
  if (JSON.stringify(files1) !== JSON.stringify(files2)) diffs.push('文件列表');
  let desc = diffs.length > 0
    ? `主要差异字段：${diffs.join('、')}。`
    : '两个版本内容完全一致。';
  return { diffs, desc };
}

// 简单XML结构解析（仅用于SysML Block/Package/Activity对比）
function parseSysMLStructure(xml) {
  if (!xml) return { blocks: [], packages: [], activities: [] };
  let blocks = [], packages = [], activities = [];
  try {
    // 只做简单正则解析，适合演示
    blocks = Array.from(xml.matchAll(/<Block name="([^"]+)"/g)).map(m => m[1]);
    packages = Array.from(xml.matchAll(/<Package name="([^"]+)"/g)).map(m => m[1]);
    activities = Array.from(xml.matchAll(/<Activity name="([^"]+)"/g)).map(m => m[1]);
  } catch (e) {}
  return { blocks, packages, activities };
}

function diffSysMLStruct(struct1, struct2) {
  // 返回{type, name, elementType}
  const diffList = [];
  ['blocks','packages','activities'].forEach(type => {
    const set1 = new Set(struct1[type]);
    const set2 = new Set(struct2[type]);
    // 新增
    for (const name of set2) if (!set1.has(name)) diffList.push({type:'增加', name, elementType:type});
    // 删除
    for (const name of set1) if (!set2.has(name)) diffList.push({type:'删除', name, elementType:type});
    // 保留的暂不标记为修改（如需更细粒度可扩展）
  });
  return diffList;
}

const VersionManagementPage = ({ model: initialModel, models: allModels }) => {
  const [model, setModel] = useState(initialModel);
  const [allModelsData, setAllModelsData] = useState(allModels);
  const [compareSelection, setCompareSelection] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [detailVersion, setDetailVersion] = useState(null);
  const [currentUser] = useState('系统'); // 可替换为真实登录用户

  useEffect(() => {
    setModel(initialModel);
  }, [initialModel]);

  const handleModelChange = (e) => {
    const selectedId = e.target.value;
    const newSelectedModel = allModelsData.find(m => m.id === selectedId);
    setModel(newSelectedModel);
    setCompareSelection([]);
    setShowCompare(false);
    setDetailVersion(null);
  };

  const handleDeleteVersion = (versionNumber) => {
    if (window.confirm(`确定要删除版本 ${versionNumber} 吗？此操作不可恢复。`)) {
      const updatedVersions = model.versions.filter(v => v.version !== versionNumber);
      const updatedModel = { ...model, versions: updatedVersions };
      setModel(updatedModel);
      const updatedAllModels = allModelsData.map(m => m.id === model.id ? updatedModel : m);
      setAllModelsData(updatedAllModels);
    }
  };

  const handleCompareSelect = (version) => {
    setCompareSelection(prev => {
      if (prev.includes(version)) {
        return prev.filter(v => v !== version);
      }
      if (prev.length < 2) {
        return [...prev, version];
      }
      return [prev[0], version];
    });
  };

  // 版本回退功能
  const handleRollback = (version) => {
    if (!window.confirm(`确定要回退到版本 ${version.version} 吗？此操作会生成一个新版本。`)) return;
    // 生成新版本号
    const latest = model.versions[0];
    let newVersionNum = '';
    if (latest) {
      const base = parseFloat(latest.version);
      newVersionNum = (base + 0.01).toFixed(2);
    } else {
      newVersionNum = '1.0';
    }
    const newVersion = {
      ...version,
      version: newVersionNum,
      date: new Date().toISOString().slice(0, 10),
      author: currentUser,
      status: 'Published',
      changes: `回退自版本${version.version}`
    };
    const updatedVersions = [newVersion, ...model.versions];
    const updatedModel = { ...model, versions: updatedVersions };
    setModel(updatedModel);
    const updatedAllModels = allModelsData.map(m => m.id === model.id ? updatedModel : m);
    setAllModelsData(updatedAllModels);
    alert(`已回退到版本${version.version}，新版本号为${newVersionNum}`);
  };

  // 文件内容对比视图
  function renderFileDiff(file1, file2) {
    if (!file1 && !file2) return null;
    const leftName = file1 ? file1.name : '(无)';
    const rightName = file2 ? file2.name : '(无)';
    const leftContent = file1 ? file1.content : '';
    const rightContent = file2 ? file2.content : '';
    const { diffs, conclusion } = diffLines(leftContent, rightContent);

    // SysML XML结构对比
    const isSysML = leftName.endsWith('.xml') || rightName.endsWith('.xml');
    let struct1 = {}, struct2 = {}, structDiff = [];
    if (isSysML) {
      struct1 = parseSysMLStructure(leftContent);
      struct2 = parseSysMLStructure(rightContent);
      structDiff = diffSysMLStruct(struct1, struct2);
    }

    return (
      <div className="file-diff-block pro-diff">
        {/* 主标题 */}
        <div className="pro-diff-main-title">
          {leftName} <span className="pro-diff-vs">vs</span> {rightName}
        </div>
        {/* 内容区：两栏对比 */}
        <div className="pro-diff-row pro-diff-main-content">
          {/* 左栏 */}
          <div className="pro-diff-main-col">
            <div className="struct-title">结构树</div>
            {isSysML ? (
              <div className="struct-content">
                <div><strong>Blocks:</strong> {struct1.blocks.length ? struct1.blocks.join(', ') : <span className="struct-empty">无</span>}</div>
                <div><strong>Packages:</strong> {struct1.packages.length ? struct1.packages.join(', ') : <span className="struct-empty">无</span>}</div>
                <div><strong>Activities:</strong> {struct1.activities.length ? struct1.activities.join(', ') : <span className="struct-empty">无</span>}</div>
              </div>
            ) : <div className="struct-empty">非SysML结构</div>}
            {/* diff内容 */}
            <div className="pro-diff-main-diff">
              {diffs.map((d, idx) => (
                <div key={idx} className={`pro-diff-line file-diff-${d.type}`}> 
                  <div className="pro-diff-lineno">{d.leftLine}</div>
                  <pre className="pro-diff-text">{d.left}</pre>
                </div>
              ))}
            </div>
          </div>
          {/* 右栏 */}
          <div className="pro-diff-main-col">
            <div className="struct-title">结构树</div>
            {isSysML ? (
              <div className="struct-content">
                <div><strong>Blocks:</strong> {struct2.blocks.length ? struct2.blocks.join(', ') : <span className="struct-empty">无</span>}</div>
                <div><strong>Packages:</strong> {struct2.packages.length ? struct2.packages.join(', ') : <span className="struct-empty">无</span>}</div>
                <div><strong>Activities:</strong> {struct2.activities.length ? struct2.activities.join(', ') : <span className="struct-empty">无</span>}</div>
              </div>
            ) : <div className="struct-empty">非SysML结构</div>}
            {/* diff内容 */}
            <div className="pro-diff-main-diff">
              {diffs.map((d, idx) => (
                <div key={idx} className={`pro-diff-line file-diff-${d.type}`}> 
                  <div className="pro-diff-lineno">{d.rightLine}</div>
                  <pre className="pro-diff-text">{d.right}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 结构变更结论 */}
        {isSysML && structDiff.length > 0 && (
          <div className="split-struct-conclusion">
            <div className="struct-conclusion-title">结构变更结论：</div>
            <ul>
              {structDiff.map((d, i) => (
                <li key={i}>
                  <span className={`struct-diff-type ${d.type==='增加'?'add':'remove'}`}>{d.type}</span>
                  <span className="struct-diff-elem">{d.elementType.replace('blocks','Block').replace('packages','Package').replace('activities','Activity')}</span>
                  <span className="struct-diff-name">{d.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* diff结论 */}
        <div className="pro-diff-conclusion">{conclusion}</div>
      </div>
    );
  }

  const renderComparison = () => {
    const [version1, version2] = compareSelection;
    const { diffs, desc } = diffVersions(version1, version2);
    const highlight = (field) => diffs.includes(field) ? 'diff-highlight' : '';
    // 文件名集合
    const fileNames = Array.from(new Set([
      ...(version1.files ? version1.files.map(f => f.name) : []),
      ...(version2.files ? version2.files.map(f => f.name) : [])
    ]));
    return (
      <div className="comparison-view">
        <h2>版本对比分析</h2>
        <div className="comparison-columns">
          <div className="comparison-column">
            <h3>版本 {version1.version}</h3>
            <p className={highlight('创建者')}><strong>创建者:</strong> {version1.author || version1.creator}</p>
            <p className={highlight('创建时间')}><strong>创建时间:</strong> {version1.date}</p>
            <p className={highlight('描述')}><strong>描述:</strong> {version1.description || version1.changes}</p>
          </div>
          <div className="comparison-column">
            <h3>版本 {version2.version}</h3>
            <p className={highlight('创建者')}><strong>创建者:</strong> {version2.author || version2.creator}</p>
            <p className={highlight('创建时间')}><strong>创建时间:</strong> {version2.date}</p>
            <p className={highlight('描述')}><strong>描述:</strong> {version2.description || version2.changes}</p>
          </div>
        </div>
        <div className="diff-desc">{desc}</div>
        <h3 style={{marginTop:'1.5rem'}}>文件内容对比</h3>
        {fileNames.map(name => {
          const f1 = version1.files ? version1.files.find(f => f.name === name) : null;
          const f2 = version2.files ? version2.files.find(f => f.name === name) : null;
          return renderFileDiff(f1, f2);
        })}
        <button onClick={() => setShowCompare(false)} className="btn btn-secondary">关闭比较</button>
      </div>
    );
  };

  const renderDetail = (version) => (
    <div className="version-detail-modal">
      <div className="version-detail-content">
        <h2>版本 {version.version} 详情</h2>
        <p><strong>创建者:</strong> {version.author || version.creator}</p>
        <p><strong>创建时间:</strong> {version.date}</p>
        <p><strong>描述:</strong> {version.description || version.changes}</p>
        {version.files && version.files.map((f, idx) => (
          <div key={idx} className="file-detail-block">
            <div className="file-detail-header">{f.name}</div>
            <pre className="file-detail-content">{f.content}</pre>
          </div>
        ))}
        <button onClick={() => setDetailVersion(null)} className="btn btn-secondary">关闭</button>
      </div>
    </div>
  );

  return (
    <div className="version-page">
      <h1>版本管理</h1>
      {!initialModel && (
        <div className="model-selector-container">
          <label htmlFor="model-select">选择一个模型以管理其版本:</label>
          <select id="model-select" onChange={handleModelChange} value={model?.id || ''}>
            <option value="" disabled>请选择...</option>
            {allModelsData.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      )}
      {model ? (
        <>
          <h2>{model.name} - 版本历史</h2>
          {compareSelection.length === 2 && !showCompare && (
            <div className="compare-actions">
                <button onClick={() => setShowCompare(true)} className="btn btn-primary">比较选定的两个版本</button>
            </div>
          )}
          {showCompare && compareSelection.length === 2 ? (
            renderComparison()
          ) : (
            <div className="version-card-list">
              {model.versions.map((version, idx) => (
                <div
                  key={version.version}
                  className={`version-card${idx === 0 ? ' latest' : ''}${compareSelection.includes(version) ? ' selected' : ''}`}
                  style={{
                    border: idx === 0 ? '2px solid #007bff' : '1px solid #e1e4e8',
                    background: idx === 0 ? '#f6faff' : '#fff',
                    boxShadow: '0 2px 8px rgba(27,31,35,0.04)',
                    borderRadius: '10px',
                    marginBottom: '1.2rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '1.2rem 1.5rem',
                    position: 'relative',
                  }}
                >
                  <div className="version-select" style={{marginRight: '1.2rem'}}>
                    <input
                      type="checkbox"
                      checked={compareSelection.includes(version)}
                      onChange={() => handleCompareSelect(version)}
                      title="选择以进行比较"
                      style={{width: 18, height: 18}}
                    />
                  </div>
                  <div className="version-info" style={{flex: 1}}>
                    <div style={{display:'flex', alignItems:'center', gap:'0.7em'}}>
                      <h3 style={{margin:0, fontWeight:700, color: idx === 0 ? '#007bff' : '#232b36'}}>版本 {version.version}</h3>
                      {idx === 0 && <span style={{background:'#007bff',color:'#fff',borderRadius: '6px',padding:'2px 10px',fontSize:'0.95em'}}>最新</span>}
                    </div>
                    <div style={{marginTop:6}}><strong>创建者:</strong> {version.author || version.creator}</div>
                    <div><strong>创建时间:</strong> {version.date}</div>
                    <div><strong>描述:</strong> {version.description || version.changes}</div>
                    {version.files && <div><strong>文件数:</strong> {version.files.length}</div>}
                  </div>
                  <div className="version-actions" style={{display:'flex', flexDirection:'column', gap:'0.5em', marginLeft:'1.5em'}}>
                    <button onClick={() => setDetailVersion(version)} className="btn btn-primary">查看详情</button>
                    <button onClick={() => handleDeleteVersion(version.version)} className="btn btn-danger">删除</button>
                    <button onClick={() => handleRollback(version)} className="btn btn-warning">回退到此版本</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {detailVersion && renderDetail(detailVersion)}
        </>
      ) : (
        <p>请从模型总览页选择一个模型，或在此处选择一个模型以开始管理版本。</p>
      )}
    </div>
  );
};

export default VersionManagementPage; 