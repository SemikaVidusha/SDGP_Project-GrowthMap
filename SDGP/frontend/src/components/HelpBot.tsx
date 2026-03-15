import React, { useState } from 'react';
import './HelpBot.css';

const faqs = [
  {
    id: 1,
    question: "How do I create an account?",
    answer: "You can create an account by clicking the 'Sign Up' button at the top right corner of the page and filling out the required details."
  },
  {
    id: 2,
    question: "What is GrowthMap?",
    answer: "GrowthMap is your personalized Career Pathway Platform to test your skills, find gaps, and reach your dream career."
  },
  {
    id: 3,
    question: "How does the Skill Gap Analysis work?",
    answer: "It compares your current skills from quiz results with industry requirements and suggests courses or learning paths."
  },
  {
    id: 4,
    question: "I forgot my password, what should I do?",
    answer: "Go to the Login page and click on 'Forgot Password'. You will receive an OTP in your email to reset it."
  }
];

const HelpBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleBot = () => {
    setIsOpen(!isOpen);
    if (isOpen) setExpandedId(null); // Reset accordion when closing bot
  };

  const toggleAccordion = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
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
            <p className="help-bot-welcome">Welcome! How can we help you today?</p>
            <div className="help-bot-faqs">
              {faqs.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <button 
                    className={`faq-question ${expandedId === faq.id ? 'active' : ''}`}
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={expandedId === faq.id}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    {faq.question}
                    <span className="faq-icon" aria-hidden="true">{expandedId === faq.id ? '−' : '+'}</span>
                  </button>
                  <div 
                    id={`faq-answer-${faq.id}`}
                    className={`faq-answer ${expandedId === faq.id ? 'expanded' : ''}`}
                    role="region"
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
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
