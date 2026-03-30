import React from 'react';
import { BookOpen, AlertCircle, Cpu, Network, Zap } from 'lucide-react';

const ExplanationPanel = () => {
  return (
    <div className="card explanation-card" style={{overflowY: 'auto'}}>
      <h2 style={{borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', color: '#60a5fa'}}>
        <BookOpen size={20} /> 
        Project Breakdown (For Presentation)
      </h2>
      
      <div className="explain-section" style={{marginTop: '1rem'}}>
        <h3><AlertCircle size={16} /> 1. The Real-World Problem</h3>
        <p>In financial fraud datasets, legitimate transactions outnumber fraudulent ones 99 to 1 (Class Imbalance). If an algorithm just guesses "Not Fraud" every time, it looks 99% accurate—but fails completely. <b>I solved this using SMOTE</b> (Synthetic Minority Over-sampling Technique) in the backend to generate synthetic fraud data so the algorithms could learn effectively.</p>
      </div>

      <div className="explain-section">
        <h3><Network size={16} /> 2. Algorithm Comparison (DAA Focus)</h3>
        <p>I built and compared two different machine learning models to analyze their time and space complexity against their actual real-world performance:</p>
        <ul style={{marginBottom: '0.5rem'}}>
          <li style={{marginBottom: '0.5rem'}}><b>Logistic Regression:</b> A simpler baseline algorithm. It trains extraordinarily fast with a time complexity of <code style={{color:'#ef4444'}}>O(n * d)</code>, but struggles to catch complex fraud patterns (lower F1 Score).</li>
          <li><b>Random Forest:</b> An ensemble of decision trees. It has a much heavier time complexity of <code style={{color:'#ef4444'}}>O(n * log(n) * d * k)</code>. It takes noticeably longer to train, but its ability to analyze non-linear relationships makes it far superior at actually catching fraud (higher F1 Score).</li>
        </ul>
      </div>

      <div className="explain-section">
        <h3><Zap size={16} /> 3. System Architecture</h3>
        <p>What you are looking at is the full-stack visualization. The <b>Python API</b> handles the heavy math and generates live transaction flows. This <b>React UI</b> hooks into a <i>Server-Sent Events (SSE)</i> stream, instantly coloring transactions red via the Random Forest classifier's output.</p>
      </div>
    </div>
  );
};

export default ExplanationPanel;
