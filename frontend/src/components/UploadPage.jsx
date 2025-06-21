import React, { useState } from 'react';
import './UploadPage.css';
import { modelTypes, allTags as availableTags } from '../data';
import { FaQuestionCircle } from 'react-icons/fa';

function UploadPage({ onAddModel, onBack, currentUser }) {
  const [name, setName] = useState('');
  const [type, setType] = useState(modelTypes[0]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [showFileTip, setShowFileTip] = useState(false);
  let fileTipTimer = null;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [modelInfo, setModelInfo] = useState(null);
  const [isInterfaceDocRequired, setIsInterfaceDocRequired] = useState(false);
  const [interfaceDoc, setInterfaceDoc] = useState(null);

  const handleTagToggle = (tag) => {
    setTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description) {
      alert('请填写模型名称和描述');
      return;
    }
    if (isInterfaceDocRequired && !interfaceDoc) {
      alert('请上传接口文档');
      return;
    }

    const newModel = {
      id: `M${Date.now()}`,
      name,
      type,
      description,
      tags,
      uploader: currentUser,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Draft',
      permission: 'Private',
      projectReferences: [],
      interface: { inputs: [], outputs: [] },
      versions: [
        { version: '0.1', date: new Date().toISOString().split('T')[0], author: currentUser, status: 'Draft', changes: 'Initial draft.' }
      ],
      structurePreview: 'default_preview.png',
      files: [] // File uploads would be handled here
    };
    
    onAddModel(newModel);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('模型尺寸过大，单个文件不能超过20MB');
      setUploading(false);
      setUploadProgress(0);
      document.getElementById('model-file-input').value = '';
      return;
    }
    if (file.name.toLowerCase().includes('old')) {
      setUploadError('模型版本需要更新，请上传新版模型文件');
      setUploading(false);
      setUploadProgress(0);
      document.getElementById('model-file-input').value = '';
      return;
    }
    setSelectedFile(file);
    setUploading(true);
    setUploadProgress(0);
    let progress = 0;
    const ext = file.name.split('.').pop().toLowerCase();
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploading(false);
        if (["slx","fmu","mo"].includes(ext)) {
          setModelInfo({
            name: file.name,
            interface: [
              { name: 'input1', type: 'real', unit: 'V' },
              { name: 'input2', type: 'real', unit: 'A' }
            ],
            metrics: [
              { name: '指标1', value: '通过' },
              { name: '指标2', value: '良好' }
            ]
          });
          setIsInterfaceDocRequired(false);
        } else {
          setModelInfo(null);
          setIsInterfaceDocRequired(true);
        }
      }
      setUploadProgress(progress);
    }, 120);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploading(false);
    document.getElementById('model-file-input').value = '';
  };

  const handleInterfaceDocChange = (e) => {
    setInterfaceDoc(e.target.files[0]);
  };

  return (
    <div className="upload-page">
      {uploadError && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.18)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',padding:'2em 2.5em',borderRadius:10,boxShadow:'0 4px 24px rgba(0,0,0,0.13)',minWidth:320}}>
            <div style={{fontSize:'1.15em',color:'#e74c3c',fontWeight:700,marginBottom:'1em'}}>{uploadError}</div>
            <button onClick={()=>setUploadError('')} style={{padding:'8px 24px',borderRadius:6,background:'#007bff',color:'#fff',border:'none',fontWeight:600,cursor:'pointer'}}>关闭</button>
          </div>
        </div>
      )}
      <button onClick={onBack} className="back-button">← 返回模型总览</button>
      <h2>上传/注册新模型</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>模型名称</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label>模型类型</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {modelTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>描述</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="form-group">
            <label>标签</label>
            <div className="tags-input">
                {availableTags.map(tag => (
                    <span 
                        key={tag} 
                        className={`tag-item ${tags.includes(tag) ? 'selected' : ''}`}
                        onClick={() => handleTagToggle(tag)}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>

        <div className="form-group" style={{position:'relative',display:'flex',alignItems:'flex-start'}}>
          <div style={{flex:1}}>
            <label style={{display:'flex',alignItems:'center',gap:'6px'}}>
              模型文件
              <span style={{position:'relative',display:'inline-block'}}
                onMouseEnter={() => { fileTipTimer = setTimeout(() => setShowFileTip(true), 50); }}
                onMouseLeave={() => { clearTimeout(fileTipTimer); setShowFileTip(false); }}>
                <FaQuestionCircle style={{color:'#3498db',cursor:'pointer'}} />
                {showFileTip && (
                  <span style={{position:'absolute',left:'22px',top:'-6px',background:'#fff',color:'#232b36',border:'1px solid #e1e4e8',borderRadius:6,padding:'7px 14px',fontSize:'0.98em',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',zIndex:10,whiteSpace:'nowrap'}}>
                    当前仅支持.slx, .mo, .fmu, .ame, .ssp, .xml, .eap, .mdl格式
                  </span>
                )}
              </span>
            </label>
            <input id="model-file-input" type="file" onChange={handleFileChange} />
            {uploading && (
              <div style={{margin:'8px 0 0 0'}}>
                <div style={{height: '12px', background: '#e1e4e8', borderRadius: '6px', overflow: 'hidden'}}>
                  <div style={{width: `${uploadProgress}%`, height: '100%', background: '#007bff', transition: 'width 0.2s'}}></div>
                </div>
                <div style={{fontSize:'0.95em',color:'#007bff',marginTop:'2px'}}>上传中... {uploadProgress}%</div>
              </div>
            )}
            {selectedFile && !uploading && (
              <div style={{marginTop:'8px',display:'flex',alignItems:'center',gap:'1em'}}>
                <span style={{color:'#232b36',fontSize:'0.98em'}}>{selectedFile.name}</span>
                <button type="button" onClick={handleRemoveFile} style={{padding:'2px 12px',borderRadius:4,background:'#e74c3c',color:'#fff',border:'none',fontWeight:600,cursor:'pointer'}}>删除</button>
              </div>
            )}
          </div>
          {/* 模型信息说明区块，独立一行，接口文档上方 */}
          {modelInfo && (
            <div style={{background:'#f6f8fa',border:'1.5px solid #007bff',borderRadius:8,padding:'1.1em 1.5em',margin:'18px 0 10px 0',boxShadow:'0 2px 8px rgba(0,123,255,0.07)'}}>
              <div style={{fontWeight:700,fontSize:'1.08em',color:'#007bff',marginBottom:'0.5em'}}>模型信息说明</div>
              <table style={{width:'100%',borderCollapse:'collapse',background:'#fff',borderRadius:6,overflow:'hidden',boxShadow:'0 1px 4px rgba(27,31,35,0.03)'}}>
                <thead>
                  <tr style={{background:'#f6f8fa',color:'#232b36',fontWeight:600}}>
                    <th style={{padding:'8px 12px',border:'1px solid #e1e4e8'}}>类型</th>
                    <th style={{padding:'8px 12px',border:'1px solid #e1e4e8'}}>名称</th>
                    <th style={{padding:'8px 12px',border:'1px solid #e1e4e8'}}>类型/单位</th>
                    <th style={{padding:'8px 12px',border:'1px solid #e1e4e8'}}>描述</th>
                  </tr>
                </thead>
                <tbody>
                  {modelInfo.interface.map((i,idx)=>(
                    <tr key={'intf'+idx}>
                      <td style={{padding:'8px 12px',border:'1px solid #e1e4e8'}}>接口</td>
                      <td style={{padding:'8px 12px',border:'1px solid #e1e4e8'}}>{i.name}</td>
                      <td style={{padding:'8px 12px',border:'1px solid #e1e4e8'}}>{i.type}/{i.unit}</td>
                      <td style={{padding:'8px 12px',border:'1px solid #e1e4e8'}}>输入信号</td>
                    </tr>
                  ))}
                  {modelInfo.metrics.map((m,idx)=>(
                    <tr key={'metric'+idx}>
                      <td style={{padding:'8px 12px',border:'1px solid #e1e4e8'}}>指标</td>
                      <td style={{padding:'8px 12px',border:'1px solid #e1e4e8'}}>{m.name}</td>
                      <td style={{padding:'8px 12px',border:'1px solid #e1e4e8'}}>-</td>
                      <td style={{padding:'8px 12px',border:'1px solid #e1e4e8'}}>{m.value}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{padding:'8px 12px',border:'1px solid #e1e4e8'}}>描述</td>
                    <td style={{padding:'8px 12px',border:'1px solid #e1e4e8'}} colSpan={3}>{modelInfo.desc || '该模型为自动识别，接口和指标信息仅供参考。'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="form-group">
          <label style={{display:'flex',alignItems:'center',gap:'6px'}}>
            接口文档 {isInterfaceDocRequired ? <span style={{color:'#e74c3c',fontWeight:600}}>(必选)</span> : <span style={{color:'#888'}}>(可选)</span>}
            <span style={{position:'relative',display:'inline-block'}}
              onMouseEnter={() => { fileTipTimer = setTimeout(() => setShowFileTip('interface'), 50); }}
              onMouseLeave={() => { clearTimeout(fileTipTimer); setShowFileTip(false); }}>
              <FaQuestionCircle style={{color:'#3498db',cursor:'pointer'}} />
              {showFileTip === 'interface' && (
                <span style={{position:'absolute',left:'22px',top:'-6px',background:'#fff',color:'#232b36',border:'1px solid #e1e4e8',borderRadius:6,padding:'7px 14px',fontSize:'0.98em',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',zIndex:10,whiteSpace:'nowrap'}}>
                  格式可以为json，txt，csv, md
                </span>
              )}
            </span>
          </label>
          <input type="file" onChange={handleInterfaceDocChange} />
        </div>
        <div className="form-group">
          <label>辅助文件 (可选)</label>
          <input type="file" />
        </div>

        <button type="submit" className="submit-button">提交注册</button>
      </form>
    </div>
  );
}

export default UploadPage; 