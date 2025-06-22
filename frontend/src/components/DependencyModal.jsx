import React from 'react';
import './DependencyModal.css';

const DependencyModal = ({ show, onClose, model, allModels }) => {
  if (!show || !model) {
    return null;
  }

  // Find models that this model depends on (Forward dependencies)
  const dependencies = model.versions?.[0]?.dependencies?.map(dep => {
      return allModels.find(m => m.id === dep.modelId);
  }).filter(Boolean) || [];

  // Find models that depend on this model (Reverse dependencies)
  const dependents = allModels.filter(otherModel => 
    otherModel.versions?.some(v => 
      v.dependencies?.some(d => d.modelId === model.id)
    )
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>依赖关系: {model.name}</h2>
        
        <div className="dependency-section">
          <h3>此模型依赖于 ({dependencies.length})</h3>
          {dependencies.length > 0 ? (
            <ul>
              {dependencies.map(dep => (
                <li key={dep.id}>{dep.name} (v{model.versions?.[0]?.dependencies.find(d => d.modelId === dep.id)?.version})</li>
              ))}
            </ul>
          ) : (
            <p>无依赖项</p>
          )}
        </div>

        <div className="dependency-section">
          <h3>依赖此模型的项 ({dependents.length})</h3>
          {dependents.length > 0 ? (
            <ul>
              {dependents.map(dep => <li key={dep.id}>{dep.name}</li>)}
            </ul>
          ) : (
            <p>未被任何模型依赖</p>
          )}
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-primary">关闭</button>
        </div>
      </div>
    </div>
  );
};

export default DependencyModal; 