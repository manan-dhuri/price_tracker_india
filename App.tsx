import React, { useState } from 'react';
import { analyzeProduct } from './services/geminiService';
import { AppState, SearchResult } from './types';
import { Spinner } from './components/Spinner';
import PriceChart from './components/PriceChart';
import { MetricCard } from './components/MetricCard';
import { SourceLinks } from './components/SourceLinks';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setState(AppState.LOADING);
    setErrorMsg(null);
    setResult(null);

    try {
      const data = await analyzeProduct(query);
      setResult(data);
      setState(AppState.SUCCESS);
    } catch (err: any) {
      setState(AppState.ERROR);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  // Helper to determine text color based on verdict
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'BUY_NOW': return 'bg-green-100 text-green-800 border-green-200';
      case 'WAIT': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 5.25h16.5a.75.75 0 01.75.75v.75m0 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3V6.75a.75.75 0 01.75-.75M6 6.75h10.5a.75.75 0 01.75.75v.75a3 3 0 01-3 3h-9a3 3 0 01-3-3v-.75a.75.75 0 01.75-.75zM6 6.75v15m0-15v.75m0 0v.75m0 0h10.5m-10.5 0V6.75" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">PriceWise<span className="text-blue-600">India</span></h1>
          </div>
          {/* Nav removed to avoid confusion with broken links */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Hero / Search */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Track history. Buy smart.
          </h2>
          <p className="text-slate-600 text-lg mb-8">
            Paste a product link or name to analyze its price history across reliable Indian stores like Amazon, Flipkart, and more.
          </p>
          
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base"
              placeholder="e.g. Sony WH-1000XM5 or paste a product link"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={state === AppState.LOADING}
            />
            <button
              type="submit"
              disabled={state === AppState.LOADING}
              className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-medium transition-colors disabled:bg-blue-400"
            >
              {state === AppState.LOADING ? <Spinner /> : 'Analyze'}
            </button>
          </form>

          <div className="mt-4 flex justify-center gap-4 text-sm text-slate-500">
            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>12-Month History</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Reliable Sources</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Buying Advice</span>
          </div>
        </div>

        {/* Error State */}
        {state === AppState.ERROR && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mt-0.5 flex-shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Results */}
        {state === AppState.SUCCESS && result && (
          <div className="animate-fade-in-up">
            
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{result.analysis.productName}</h2>
                <div className="flex flex-wrap gap-2">
                   {result.analysis.reliableSources.map((source, i) => (
                     <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                       {source}
                     </span>
                   ))}
                </div>
              </div>
              <div className={`flex flex-col items-center justify-center px-6 py-3 rounded-xl border text-center min-w-[140px] ${getVerdictColor(result.analysis.verdict)}`}>
                <span className="text-xs font-bold uppercase tracking-wider opacity-75">Verdict</span>
                <span className="text-lg font-bold mt-0.5">{result.analysis.verdict.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard 
                label="Current Price" 
                value={result.analysis.currentPrice} 
                highlight 
              />
              <MetricCard 
                label="Lowest Price (1Y)" 
                value={result.analysis.lowestPrice} 
                subValue={
                   result.analysis.currentPrice <= result.analysis.lowestPrice * 1.05 
                   ? 'Close to All-Time Low!' 
                   : `${Math.round(((result.analysis.currentPrice - result.analysis.lowestPrice) / result.analysis.lowestPrice) * 100)}% higher than low`
                }
                trend={result.analysis.currentPrice <= result.analysis.lowestPrice * 1.05 ? 'down' : 'up'}
              />
              <MetricCard 
                label="Highest Price (1Y)" 
                value={result.analysis.highestPrice} 
              />
            </div>

            {/* Main Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left: Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Price History (12 Months)</h3>
                <p className="text-sm text-slate-500 mb-4">Historical trend based on aggregated data from major Indian retailers.</p>
                <PriceChart data={result.analysis.history} />
              </div>

              {/* Right: Insights */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Best Time Card */}
                <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-indigo-900">Best Time to Buy</h3>
                  </div>
                  <p className="text-indigo-800 font-medium mb-2">{result.analysis.bestTime}</p>
                </div>

                {/* Analysis Text */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900 mb-3">AI Analysis</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {result.analysis.analysisText}
                  </p>
                </div>

              </div>
            </div>

            {/* Sources Footer */}
            <div className="mt-8 mb-12">
              <SourceLinks chunks={result.groundingChunks} />
              <p className="text-xs text-slate-400 mt-4 text-center">
                Disclaimer: Prices are estimated based on historical search data and may vary by retailer, location, and ongoing bank offers. Always verify on the seller's website.
              </p>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;