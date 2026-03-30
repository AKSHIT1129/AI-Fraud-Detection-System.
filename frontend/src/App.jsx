import React from 'react';
import TransactionStream from './components/TransactionStream';
import MetricsDashboard from './components/MetricsDashboard';
import ExplanationPanel from './components/ExplanationPanel';

function App() {
  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="header-text">
          <h1>FraudGuard AI System</h1>
          <p>Design & Analysis of Algorithms Project Demo — Fraud Detection</p>
        </div>
        <div style={{textAlign: 'right'}}>
          <span className="badge safe">Live Model Processing Engine: ACTIVE</span>
        </div>
      </div>
      
      <div className="main-content layout-three-col">
        <ExplanationPanel />
        <TransactionStream />
        <MetricsDashboard />
      </div>
    </div>
  );
}

export default App;
