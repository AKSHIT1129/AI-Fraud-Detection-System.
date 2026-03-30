const http = require('http');

let txId = 0;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/metrics' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const metrics = {
      "logistic_regression": {
        "train_time_ms": 124.5,
        "accuracy": 0.9452,
        "precision": 0.82,
        "recall": 0.88,
        "f1": 0.849,
        "complexity": "O(n*d) train, O(d) predict"
      },
      "random_forest": {
        "train_time_ms": 482.1,
        "accuracy": 0.9875,
        "precision": 0.93,
        "recall": 0.95,
        "f1": 0.939,
        "complexity": "O(n*log(n)*d*k) train, O(k*d) predict"
      }
    };
    res.end(JSON.stringify(metrics));
  } 
  else if (req.url === '/stream' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    
    const interval = setInterval(() => {
      txId++;
      const isFraud = Math.random() < 0.1;
      const data = {
        tx_id: `TXN-${String(txId).padStart(6, '0')}`,
        amount: Math.random() * 1000 + 10,
        prediction: isFraud ? 1 : 0,
        confidence: isFraud ? 0.85 + Math.random()*0.14 : 0.9 + Math.random()*0.09,
        prediction_time_ms: 1.2 + Math.random() * 2,
      };
      res.write(`event: transaction\ndata: ${JSON.stringify(data)}\n\n`);
    }, 1500);
    
    req.on('close', () => clearInterval(interval));
  }
  else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(8000, () => {
    console.log("Mock Node Backend running on port 8000");
});
