import React, { useState } from 'react';
import './AdvancedSearchModal.css';

const AdvancedSearchModal = ({ show, onClose, onApply, modelFields }) => {
  const [groups, setGroups] = useState([[{ field: '', op: '=', value: '' }]]);

  if (!show) {
    return null;
  }

  const handleAddGroup = () => {
    setGroups([...groups, [{ field: '', op: '=', value: '' }]]);
  };

  const handleRemoveGroup = (groupIndex) => {
    setGroups(groups.filter((_, i) => i !== groupIndex));
  };

  const handleAddCondition = (groupIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].push({ field: '', op: '=', value: '' });
    setGroups(newGroups);
  };

  const handleRemoveCondition = (groupIndex, conditionIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex] = newGroups[groupIndex].filter((_, i) => i !== conditionIndex);
    // If the group becomes empty, remove the group itself
    if (newGroups[groupIndex].length === 0) {
      handleRemoveGroup(groupIndex);
    } else {
      setGroups(newGroups);
    }
  };

  const handleConditionChange = (groupIndex, conditionIndex, part, value) => {
    const newGroups = [...groups];
    newGroups[groupIndex][conditionIndex][part] = value;
    setGroups(newGroups);
  };
  
  const handleApply = () => {
    // Basic validation: filter out empty/incomplete conditions before applying
    const validGroups = groups
      .map(group => group.filter(cond => cond.field && cond.value))
      .filter(group => group.length > 0);
      
    onApply(validGroups);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>高级搜索</h2>
        <p>不同筛选组之间为"或"关系，组内各条件为"与"关系。</p>

        <div className="filter-groups-container">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="filter-group">
              {groupIndex > 0 && <div className="group-separator">OR</div>}
              <div className="group-content">
                {group.map((condition, conditionIndex) => (
                  <div key={conditionIndex} className="condition">
                    <select
                      value={condition.field}
                      onChange={(e) => handleConditionChange(groupIndex, conditionIndex, 'field', e.target.value)}
                    >
                      <option value="">选择字段...</option>
                      {modelFields.map(field => (
                        <option key={field.key} value={field.key}>{field.label}</option>
                      ))}
                    </select>
                    {/* Simplified operator for now */}
                    <span>=</span>
                    <input
                      type="text"
                      placeholder="输入值..."
                      value={condition.value}
                      onChange={(e) => handleConditionChange(groupIndex, conditionIndex, 'value', e.target.value)}
                    />
                    <button onClick={() => handleRemoveCondition(groupIndex, conditionIndex)} className="remove-btn">×</button>
                  </div>
                ))}
                <button onClick={() => handleAddCondition(groupIndex)} className="add-condition-btn">+ AND</button>
              </div>
              {groups.length > 1 && (
                <button onClick={() => handleRemoveGroup(groupIndex)} className="remove-group-btn">移除此组</button>
              )}
            </div>
          ))}
        </div>

        <button onClick={handleAddGroup} className="add-group-btn">+ OR</button>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">取消</button>
          <button onClick={handleApply} className="btn-primary">应用筛选</button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchModal; 