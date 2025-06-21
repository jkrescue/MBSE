import React, { useState } from 'react';
import { models as allModels } from '../data';
import './ReferenceInfoPage.css';

function ReferenceInfoPage() {
  const [expanded, setExpanded] = useState(null);

  // 只展示有引用的模型
  const referencedModels = allModels.filter(m => m.projectReferences && m.projectReferences.length > 0);

  return (
    <div className="reference-info-page">
      <h2>引用信息总览</h2>
      <p>下表展示了所有被项目引用的模型，点击模型名称可查看详细引用列表。</p>
      <table className="reference-table">
        <thead>
          <tr>
            <th>模型名称</th>
            <th>类型</th>
            <th>上传者</th>
            <th>引用项目数</th>
            <th>引用项目</th>
          </tr>
        </thead>
        <tbody>
          {referencedModels.length === 0 ? (
            <tr><td colSpan={5} style={{textAlign:'center'}}>暂无被引用的模型</td></tr>
          ) : referencedModels.map(model => (
            <React.Fragment key={model.id}>
              <tr className="reference-row">
                <td>
                  <span className="model-link" onClick={() => setExpanded(expanded === model.id ? null : model.id)}>
                    {model.name}
                  </span>
                </td>
                <td>{model.type}</td>
                <td>{model.uploader}</td>
                <td>{model.projectReferences.length}</td>
                <td>{model.projectReferences.join(', ')}</td>
              </tr>
              {expanded === model.id && (
                <tr className="reference-detail-row">
                  <td colSpan={5}>
                    <div className="reference-detail-block">
                      <strong>详细引用列表：</strong>
                      <ul>
                        {model.projectReferences.map(ref => (
                          <li key={ref}>{ref}（示例：项目文档/系统/需求等）</li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReferenceInfoPage; 