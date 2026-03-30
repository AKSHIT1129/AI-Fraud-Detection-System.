import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Server } from 'lucide-react';

const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/metrics')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching metrics", err);
        setLoading(false);
      });
  }, []);

  if (loading || !metrics) {
    return (
      <div className="card" style={{justifyContent: 'center', alignItems: 'center'}}>
        <div className="spinner"></div>
      </div>
    );
  }

  const accuracyData = [
    { name: 'LogReg', Accuracy: metrics.logistic_regression.accuracy * 100 },
    { name: 'RF', Accuracy: metrics.random_forest.accuracy * 100 },
  ];

  const colors = ['#a78bfa', '#3b82f6'];

  return (
    <div className="card" style={{overflowY: 'auto'}}>
      <h2><Server size={20} /> Algorithm Performance</h2>
      
      <div className="metrics-grid">
        <div className="metric-box">
          <div className="metric-title">LogReg F1 Score</div>
          <div className="metric-value">{(metrics.logistic_regression.f1 * 100).toFixed(1)}%</div>
        </div>
        <div className="metric-box">
          <div className="metric-title">RF F1 Score</div>
          <div className="metric-value">{(metrics.random_forest.f1 * 100).toFixed(1)}%</div>
        </div>
      </div>

      <div style={{ height: '180px', width: '100%', marginBottom: '1rem', flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={accuracyData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
            <Tooltip contentStyle={{background: '#1a1d2d', border: '1px solid #3b82f6', color: '#fff'}} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
            <Bar dataKey="Accuracy" radius={[4, 4, 0, 0]}>
              {accuracyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % 2]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="algo-compare">
        <div className="algo-row">
          <span><strong>Logistic Regression</strong> Time Complexity:</span>
          <span style={{color: '#9ca3af', fontSize: '0.9rem'}}>{metrics.logistic_regression.complexity}</span>
        </div>
        <div className="algo-row">
          <span>Actual Training Time (~16k samples):</span>
          <span style={{color: '#ef4444'}}>{metrics.logistic_regression.train_time_ms} ms</span>
        </div>
        
        <div className="algo-row" style={{marginTop:'1rem'}}>
          <span><strong>Random Forest</strong> Time Complexity:</span>
          <span style={{color: '#9ca3af', fontSize: '0.9rem'}}>{metrics.random_forest.complexity}</span>
        </div>
        <div className="algo-row">
          <span>Actual Training Time (~16k samples):</span>
          <span style={{color: '#ef4444'}}>{metrics.random_forest.train_time_ms} ms</span>
        </div>
        <p style={{fontSize: '0.8rem', color: '#9ca3af', marginTop: '1rem', lineHeight: '1.4'}}>
          DAA Note: While Logistic Regression trains in linear time relative to features/samples, Random Forest takes longer due to the ensemble of decision trees. However, RF typically achieves higher accuracy and F1 score on imbalanced complex datasets like fraud detection.
        </p>
      </div>
    </div>
  );
};

export default MetricsDashboard;
