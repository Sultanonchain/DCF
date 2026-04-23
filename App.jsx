import React, { useState } from 'react';

// --- CONFIGURATION ---
// You will need a free API key from Financial Modeling Prep or similar to make this "Automatic"
const API_KEY = "YOUR_FREE_API_KEY_HERE"; 

const App = () => {
  const [ticker, setTicker] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateDCF = (metrics) => {
    // Simplified DCF Logic: 
    // (Free Cash Flow * (1 + Growth Rate)) / (WACC - Growth Rate)
    const fcf = metrics.freeCashFlow || 0;
    const growth = 0.05; // 5% default growth
    const wacc = 0.10;   // 10% default discount rate
    
    const intrinsicValue = (fcf * (1 + growth)) / (wacc - growth);
    return (intrinsicValue / metrics.sharesOutstanding).toFixed(2);
  };

  const fetchData = async () => {
    if (!ticker) return;
    setLoading(true);
    setError('');
    
    try {
      // Example API call to fetch Financial Statements
      const response = await fetch(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${ticker.toUpperCase()}?apikey=${API_KEY}`);
      const result = await response.json();
      
      if (result.length > 0) {
        setData(result[0]);
      } else {
        setError('Ticker not found or API limit reached.');
      }
    } catch (err) {
      setError('Failed to fetch data. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6">
      <header className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-indigo-600">IntrinsicValue</h1>
        <p className="mt-2 text-gray-600">Simple, Automated Discounted Cash Flow Analysis</p>
      </header>

      <main className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex space-x-2 mb-8">
          <input 
            type="text" 
            placeholder="Enter Ticker (e.g. AAPL)" 
            className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-indigo-500 outline-none uppercase"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
          <button 
            onClick={fetchData}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Analyze'}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {data && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Current Price</p>
                <p className="text-2xl font-bold">${data.marketCapTTM ? "Loading..." : "N/A"}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-semibold">Estimated Fair Value</p>
                <p className="text-2xl font-bold text-green-700">${calculateDCF(data)}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Key Metrics (TTM)</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>Free Cash Flow Yield:</span> <b>{(data.freeCashFlowYieldTTM * 100).toFixed(2)}%</b></li>
                <li className="flex justify-between"><span>PE Ratio:</span> <b>{data.peRatioTTM.toFixed(2)}</b></li>
                <li className="flex justify-between"><span>Debt to Equity:</span> <b>{data.debtToEquityTTM.toFixed(2)}</b></li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto mt-12 text-center text-xs text-gray-400">
        <p className="uppercase font-bold mb-2 tracking-widest">Disclaimer</p>
        <p>
          This website is for informational purposes only and does NOT constitute financial, investment, or legal advice. 
          The calculations are based on automated data which may be delayed or inaccurate. 
          Always perform your own due diligence before making investment decisions.
        </p>
      </footer>
    </div>
  );
};

export default App;
