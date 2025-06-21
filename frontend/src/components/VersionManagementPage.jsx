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
      result.push({ type: 'equal', leftLine: i, rightLine: j, text: aLines[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      result.push({ type: 'added', leftLine: null, rightLine: j, text: bLines[j - 1] });
      j--; added++;
    } else if (i > 0 && (j === 0 || lcs[i][j - 1] < lcs[i - 1][j])) {
      result.push({ type: 'removed', leftLine: i, rightLine: null, text: aLines[i - 1] });
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

    return (
      <div className="file-diff-block">
        <div className="file-diff-header">
          <span>{leftName}</span>
          <span>{rightName}</span>
        </div>
        <div className="file-diff-conclusion">{conclusion}</div>
        <div className="file-diff-body">
          {diffs.map((d, idx) => (
            <div className={`file-diff-line file-diff-${d.type}`} key={idx}>
              <div className="line-num left">{d.leftLine}</div>
              <pre className="line-content left">{d.type !== 'added' ? d.text : ''}</pre>
              <div className="line-num right">{d.rightLine}</div>
              <pre className="line-content right">{d.type !== 'removed' ? d.text : ''}</pre>
            </div>
          ))}
        </div>
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
            <ul className="version-list">
              {model.versions.map(version => (
                <li key={version.version} className={`version-item ${compareSelection.includes(version) ? 'selected' : ''}`}>
                  <div className="version-select">
                    <input 
                      type="checkbox"
                      checked={compareSelection.includes(version)}
                      onChange={() => handleCompareSelect(version)}
                      title="选择以进行比较"
                    />
                  </div>
                  <div className="version-info">
                    <h3>版本 {version.version}</h3>
                    <p><strong>创建者:</strong> {version.author || version.creator}</p>
                    <p><strong>创建时间:</strong> {version.date}</p>
                    <p><strong>描述:</strong> {version.description || version.changes}</p>
                    {version.files && <p><strong>文件数:</strong> {version.files.length}</p>}
                  </div>
                  <div className="version-actions">
                    <button onClick={() => setDetailVersion(version)} className="btn btn-primary">查看详情</button>
                    <button onClick={() => handleDeleteVersion(version.version)} className="btn btn-danger">删除</button>
                    <button onClick={() => handleRollback(version)} className="btn btn-warning">回退到此版本</button>
                  </div>
                </li>
              ))}
            </ul>
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