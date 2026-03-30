import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

const TransactionStream = () => {
  const [streamData, setStreamData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/stream');

    eventSource.onopen = () => setIsConnected(true);
    eventSource.onerror = () => setIsConnected(false);

    eventSource.addEventListener('transaction', (event) => {
      const tx = JSON.parse(event.data);
      setStreamData(prev => [tx, ...prev].slice(0, 50));
    });

    return () => eventSource.close();
  }, []);

  return (
    <div className="card">
      <h2>
        <Activity size={20} color={isConnected ? '#10b981' : '#ef4444'} /> 
        Live Transactions
        {!isConnected && <span style={{fontSize: '0.8rem', color: '#ef4444', marginLeft: 'auto'}}>Disconnected</span>}
      </h2>
      <div className="stream-list">
        {streamData.length === 0 && <div style={{textAlign: 'center', color: '#9ca3af', padding: '2rem'}}>Awaiting transactions...</div>}
        {streamData.map((tx) => (
          <div key={tx.tx_id} className={`stream-item ${tx.prediction === 1 ? 'fraud' : ''}`}>
            <div className="tx-info">
              <span className="tx-id">{tx.tx_id}</span>
              <span className="tx-amount">${tx.amount.toFixed(2)}</span>
            </div>
            <div className="tx-meta">
              <span className={`badge ${tx.prediction === 1 ? 'fraud' : 'safe'}`}>
                {tx.prediction === 1 ? 'Fraud Detected' : 'Safe'}
              </span>
              <span className="latency">{tx.prediction_time_ms.toFixed(2)}ms (RF) {Math.round(tx.confidence*100)}% conf</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionStream;
