import React, { useState } from 'react';
import './HelpBot.css';

const HelpBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleBot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="help-bot-container">
      {isOpen && (
        <div className="help-bot-popup">
          <div className="help-bot-header">
            <h3>GrowthMap Help</h3>
            <button className="close-btn" onClick={toggleBot}>&times;</button>
          </div>
          <div className="help-bot-content">
            <p>Welcome! How can we help you today?</p>
            {/* Q&A will go here */}
          </div>
        </div>
      )}
      <button className="help-bot-fab" onClick={toggleBot} aria-label="Help">
        <span className="help-icon">?</span>
      </button>
    </div>
  );
};

export default HelpBot;
