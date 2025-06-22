import React from 'react';
import { FaStar, FaRegStar, FaAward } from 'react-icons/fa';
import './ModelOverviewPage.css'; // Reuse styles from overview

const StarRating = ({ rating = 0, max = 5 }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = max - fullStars;
  return (
    <div className="card-rating">
      {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} className="star filled" />)}
      {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} className="star" />)}
    </div>
  );
};

const ModelCard = ({ model, onSelectModel, onManageVersions, onSelect, isSelected }) => {
  const { rating, isRecommended, status } = model;

  const getStatusClass = (s) => {
    switch(s) {
      case 'Published': return 'status-published';
      case 'Pending Review': return 'status-pending';
      case 'Draft': return 'status-draft';
      case 'Rejected': return 'status-rejected';
      case 'Archived': return 'status-archived';
      default: return '';
    }
  };

  const handleCardClick = () => {
    onSelectModel(model);
  };
  
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action(model);
  };

  return (
    <div className={`model-card ${isSelected ? 'selected-card' : ''}`} >
      <div className="card-selection">
        <input type="checkbox" checked={isSelected} onChange={(e) => {
            e.stopPropagation();
            onSelect(model.id);
        }}/>
      </div>
      {isRecommended && (
        <div className="recommended-badge" title="官方推荐">
          <FaAward />
        </div>
      )}
      <div className="card-content" onClick={handleCardClick}>
        <div className="card-preview">
          <img 
            src={model.structurePreview || 'default_preview.png'} 
            alt={`${model.name} preview`}
            onError={(e) => { e.target.onerror = null; e.target.src='default_preview.png'; }}
          />
        </div>
        <div className="card-details">
          <h3 className="card-title">{model.name}</h3>
          <p className="card-type">{model.type}</p>
          <StarRating rating={rating} />
          <div className="card-tags">
            {model.tags.slice(0, 3).map(tag => <span key={tag} className="tag-item">{tag}</span>)}
          </div>
          <div className="card-footer">
            <span className={`status-badge ${getStatusClass(status)}`}>{status}</span>
            <button 
              className="action-button"
              onClick={(e) => handleActionClick(e, onManageVersions)}
            >
              版本管理
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelCard; 