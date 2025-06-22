import React, { useState, useEffect } from 'react';
import './VersionManagementPage.css';
import Modal from './Modal';
// import VersionDiffModal from './VersionDiffModal';

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

// 虚拟用户和角色体系
const USER_LIST = [
  { name: 'frank', role: 'admin' },         // 平台管理员
  { name: 'alice', role: 'uploader' },     // 模型开发者
  { name: 'bob', role: 'uploader' },       // 模型开发者
  { name: 'charlie', role: 'user' },       // 普通用户
  { name: 'david', role: 'user' },         // 普通用户
  { name: 'eve', role: 'reviewer' }        // 审核人/专家
];

const ROLE_OPTIONS = [
  { value: 'admin', label: '管理员' },
  { value: 'uploader', label: '上传者' },
  { value: 'reviewer', label: '审核人' },
  { value: 'user', label: '普通用户' },
];

const VersionManagementPage = ({ model: initialModel, models: allModels, currentUser, currentRole, onUpdateModels }) => {
  const [model, setModel] = useState(initialModel);
  const [compareSelection, setCompareSelection] = useState([]);
  const [isDiffModalOpen, setDiffModalOpen] = useState(false);
  const [detailVersion, setDetailVersion] = useState(null);
  const [taggingVersion, setTaggingVersion] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [editingDeps, setEditingDeps] = useState(null); // { version, deps: [] }
  const [depModel, setDepModel] = useState('');
  const [depVersion, setDepVersion] = useState('');
  const [baseVersion, setBaseVersion] = useState(null);
  const [compareVersion, setCompareVersion] = useState(null);

  useEffect(() => {
    setModel(initialModel);
  }, [initialModel]);

  // Utility function to get current timestamp
  const getCurrentTimestamp = () => {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
  };

  const handleModelChange = (e) => {
    const selectedId = e.target.value;
    const newSelectedModel = allModels.find(m => m.id === selectedId);
    setModel(newSelectedModel);
    setCompareSelection([]);
    setDetailVersion(null);
  };

  const handleDeleteVersion = (versionNumber) => {
    if (window.confirm(`确定要删除版本 ${versionNumber} 吗？此操作不可恢复。`)) {
      const updatedVersions = model.versions.filter(v => v.version !== versionNumber);
      
      const newLog = { 
        date: getCurrentTimestamp(), 
        user: currentUser, 
        action: '删除版本', 
        details: `删除了版本 v${versionNumber}` 
      };
      const updatedLog = [newLog, ...(model.changeLog || [])];

      const updatedModel = { ...model, versions: updatedVersions, changeLog: updatedLog };
      
      setModel(updatedModel);
      
      const updatedAllModels = allModels.map(m => m.id === model.id ? updatedModel : m);
      onUpdateModels(updatedAllModels);
    }
  };

  const handleSetTag = (version) => {
    const updatedVersions = model.versions.map(v => 
      v.version === version.version ? { ...v, releaseTag: newTag } : v
    );

    const newLog = {
      date: getCurrentTimestamp(),
      user: currentUser,
      action: '设置标签',
      details: `为版本 v${version.version} 设置了标签: "${newTag}"`
    };
    const updatedLog = [newLog, ...(model.changeLog || [])];

    const updatedModel = { ...model, versions: updatedVersions, changeLog: updatedLog };
    setModel(updatedModel);

    const updatedAllModels = allModels.map(m => m.id === model.id ? updatedModel : m);
    onUpdateModels(updatedAllModels);

    setTaggingVersion(null);
    setNewTag('');
  };

  const handleUpdateDependencies = () => {
    const { version, deps } = editingDeps;

    const updatedVersions = model.versions.map(v => 
      v.version === version.version ? { ...v, dependencies: deps } : v
    );

    const newLog = {
      date: getCurrentTimestamp(),
      user: currentUser,
      action: '更新依赖',
      details: `更新了版本 v${version.version} 的依赖关系`
    };
    const updatedLog = [newLog, ...(model.changeLog || [])];
    
    const updatedModel = { ...model, versions: updatedVersions, changeLog: updatedLog };
    setModel(updatedModel);

    const updatedAllModels = allModels.map(m => m.id === model.id ? updatedModel : m);
    onUpdateModels(updatedAllModels);

    setEditingDeps(null);
    setDepModel('');
    setDepVersion('');
  }

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

  const handleStartCompare = () => {
    if (compareSelection.length === 2) {
      const sorted = [...compareSelection].sort((a,b) => new Date(a.date) - new Date(b.date));
      setBaseVersion(sorted[0]);
      setCompareVersion(sorted[1]);
      setDiffModalOpen(true);
    } else {
      alert('请选择两个版本进行对比。');
    }
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

    const newLog = {
      date: getCurrentTimestamp(),
      user: currentUser,
      action: '回退版本',
      details: `从 v${version.version} 回退创建了新版本 v${newVersionNum}`
    };
    const updatedLog = [newLog, ...(model.changeLog || [])];

    const updatedModel = { ...model, versions: updatedVersions, changeLog: updatedLog };

    setModel(updatedModel);
    
    const updatedAllModels = allModels.map(m => m.id === model.id ? updatedModel : m);
    onUpdateModels(updatedAllModels);

    alert(`已回退到版本${version.version}，新版本号为${newVersionNum}`);
  };

  // 判断当前用户是否有编辑权限
  const canEdit = model && (currentRole === 'admin' || currentUser === model.uploader);

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

  const renderTagModal = () => {
    if (!taggingVersion) return null;
    return (
      <div className="version-detail-modal">
        <div className="version-detail-content" style={{maxWidth: 400}}>
          <h2>设置版本标签</h2>
          <p>为版本 <strong>{taggingVersion.version}</strong> 设置一个发布标签 (例如: Stable, Beta, Nightly)。</p>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="输入标签..."
            className="tag-input"
          />
          <div className="tag-modal-actions">
            <button onClick={() => handleSetTag(taggingVersion)} className="btn btn-primary">保存</button>
            <button onClick={() => setTaggingVersion(null)} className="btn btn-secondary">取消</button>
          </div>
        </div>
      </div>
    );
  };

  const renderDependencies = (dependencies) => {
    if (!dependencies || dependencies.length === 0) {
      return <div className="no-deps">无依赖关系</div>;
    }
  
    return (
      <div className="deps-list">
        {dependencies.map((dep, index) => {
          const depModelInfo = allModels.find(m => m.id === dep.modelId);
          return (
            <div key={index} className="dep-item">
              <span className="dep-model-name">{depModelInfo ? depModelInfo.name : dep.modelId}</span>
              <span className="dep-version">v{dep.version}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDependenciesModal = () => {
    if (!editingDeps) return null;
  
    const availableModels = allModels.filter(m => m.id !== model.id);
    const selectedDepModelDetails = allModels.find(m => m.id === depModel);
  
    return (
      <div className="version-detail-modal">
        <div className="version-detail-content" style={{maxWidth: 600}}>
          <h2>编辑版本 {editingDeps.version.version} 的依赖</h2>
          
          <div className="current-deps-list">
            <h4>当前依赖:</h4>
            {editingDeps.deps.length === 0 ? <p>无</p> : (
              <ul>
                {editingDeps.deps.map((d, i) => {
                  const name = allModels.find(m => m.id === d.modelId)?.name || d.modelId;
                  return (
                    <li key={i}>
                      {name} v{d.version}
                      <button onClick={() => {
                        const newDeps = editingDeps.deps.filter((_, idx) => idx !== i);
                        setEditingDeps({...editingDeps, deps: newDeps});
                      }} className="btn-remove-dep">移除</button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="add-dep-form">
            <h4>新增依赖:</h4>
            <select value={depModel} onChange={e => { setDepModel(e.target.value); setDepVersion(''); }}>
              <option value="">选择模型...</option>
              {availableModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            {selectedDepModelDetails && (
              <select value={depVersion} onChange={e => setDepVersion(e.target.value)}>
                <option value="">选择版本...</option>
                {selectedDepModelDetails.versions.map(v => <option key={v.version} value={v.version}>{v.version}</option>)}
              </select>
            )}
            <button
              onClick={() => {
                if (!depModel || !depVersion) return;
                const newDep = { modelId: depModel, version: depVersion };
                // 防止重复添加
                if (editingDeps.deps.some(d => d.modelId === newDep.modelId && d.version === newDep.version)) return;
                setEditingDeps({...editingDeps, deps: [...editingDeps.deps, newDep]});
                setDepModel('');
                setDepVersion('');
              }}
              className="btn btn-primary"
              disabled={!depModel || !depVersion}
            >
              添加
            </button>
          </div>

          <div className="tag-modal-actions">
            <button onClick={handleUpdateDependencies} className="btn btn-primary">保存</button>
            <button onClick={() => setEditingDeps(null)} className="btn btn-secondary">取消</button>
          </div>
        </div>
      </div>
    );
  }

  const renderChangeLog = (log) => {
    if (!log || log.length === 0) {
      return (
        <div className="change-log-container">
          <h3>版本操作日志</h3>
          <p>暂无操作记录。</p>
        </div>
      );
    }

    return (
      <div className="change-log-container">
        <h3>版本操作日志</h3>
        <table className="change-log-table">
          <thead>
            <tr>
              <th>操作时间</th>
              <th>操作人</th>
              <th>操作类型</th>
              <th>详情</th>
            </tr>
          </thead>
          <tbody>
            {log.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.user}</td>
                <td>{entry.action}</td>
                <td>{entry.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 只显示当前用户和角色
  const renderUserInfo = () => (
    <div style={{marginBottom: '1.2em', display:'flex', alignItems:'center', gap:'1em'}}>
      <span style={{fontWeight:600}}>当前用户：</span>
      <span style={{padding:'6px 12px', fontSize:'1em', borderRadius:4, background:'#f6f8fa', border:'1px solid #ccc'}}>Bob</span>
      <span style={{fontWeight:600}}>当前角色：</span>
      <span style={{padding:'6px 12px', fontSize:'1em', borderRadius:4, background:'#f6f8fa', border:'1px solid #ccc'}}>Engineer</span>
    </div>
  );

  return (
    <div className="vmp-container">
      <div className="vmp-sidebar">
        {/* ... */}
      </div>

      <div className="vmp-main-content">
        {renderUserInfo()}
        {model ? (
          <>
            <h2>{model.name} - 版本历史</h2>
            <div className="version-toolbar">
              <p>选择任意两个版本进行对比:</p>
              <button 
                onClick={handleStartCompare} 
                disabled={compareSelection.length !== 2}
                className="btn btn-primary"
              >
                比较选定的版本
              </button>
            </div>
            
            <div className="version-card-list">
              {model.versions.map((version, idx) => (
                <div
                  key={version.version}
                  className={`version-card${idx === 0 ? ' latest' : ''}${compareSelection.includes(version) ? ' selected' : ''}`}
                >
                  <div className="version-select">
                    <input
                      type="checkbox"
                      checked={compareSelection.includes(version)}
                      onChange={() => handleCompareSelect(version)}
                      title="选择以进行比较"
                    />
                  </div>
                  <div className="version-info">
                    <div className="version-card-header">
                      <h3>版本 {version.version}</h3>
                      {idx === 0 && <span className="badge latest-badge">最新</span>}
                      {version.releaseTag && <span className="badge release-badge">{version.releaseTag}</span>}
                    </div>
                    <div><strong>创建者:</strong> {version.author || version.creator}</div>
                    <div><strong>创建时间:</strong> {version.date}</div>
                    <div><strong>描述:</strong> {version.description || version.changes}</div>
                    <div className="version-dependencies">
                      <strong>依赖关系:</strong>
                      {renderDependencies(version.dependencies)}
                    </div>
                    {version.files && <div><strong>文件数:</strong> {version.files.length}</div>}
                  </div>
                  <div className="version-actions">
                    <button onClick={() => setDetailVersion(version)} className="btn btn-primary">查看详情</button>
                    {canEdit && <button onClick={() => setTaggingVersion(version)} className="btn btn-info">设置标签</button>}
                    {canEdit && <button onClick={() => setEditingDeps({ version, deps: [...(version.dependencies || [])]})} className="btn btn-secondary">编辑依赖</button>}
                    {canEdit && <button onClick={() => handleDeleteVersion(version.version)} className="btn btn-danger">删除</button>}
                    {canEdit && <button onClick={() => handleRollback(version)} className="btn btn-warning">回退到此版本</button>}
                  </div>
                </div>
              ))}
            </div>

            {detailVersion && renderDetail(detailVersion)}
            
          </>
        ) : (
          <p>请从模型总览页选择一个模型，或在此处选择一个模型以开始管理版本。</p>
        )}

        <Modal
          isOpen={isDiffModalOpen}
          onClose={() => setDiffModalOpen(false)}
          title={`版本对比: ${model.name}`}
        >
          {isDiffModalOpen && baseVersion && compareVersion && (
            <div className="version-diff-modal-content">
              <div className="version-selectors-in-modal">
                <label>基准版本:</label>
                <select value={baseVersion.version} onChange={e => setBaseVersion(model.versions.find(v => v.version === e.target.value))}>
                  {model.versions.map(v => <option key={v.version} value={v.version}>{v.version}</option>)}
                </select>
                <span>vs</span>
                <label>对比版本:</label>
                <select value={compareVersion.version} onChange={e => setCompareVersion(model.versions.find(v => v.version === e.target.value))}>
                  {model.versions.map(v => <option key={v.version} value={v.version}>{v.version}</option>)}
                </select>
              </div>

              {(() => {
                const v1 = baseVersion;
                const v2 = compareVersion;
                // @ts-ignore
                const allFilenames = [...new Set([...(v1.files || []).map(f => f.name), ...(v2.files || []).map(f => f.name)])];

                return (
                    <div className="diff-results-container">
                        {allFilenames.map((filename, index) => {
                            const file1 = (v1.files || []).find(f => f.name === filename);
                            const file2 = (v2.files || []).find(f => f.name === filename);
                            return <React.Fragment key={index}>{renderFileDiff(file1, file2)}</React.Fragment>
                        })}
                    </div>
                );
              })()}
            </div>
          )}
        </Modal>

        {renderTagModal()}
        {renderDependenciesModal()}
        {renderChangeLog(model ? model.changeLog : [])}
      </div>
    </div>
  );
};

export default VersionManagementPage; 