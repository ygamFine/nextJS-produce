'use client';

import { useState } from 'react';

export default function RebuildIndexPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);
  const [apiKey, setApiKey] = useState('');
  
  const handleRebuild = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(`/api/rebuild-index?key=${apiKey}`);
      const data = await response.json();
      
      setResult(data);
    } catch (error) {
      setResult({ error: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Rebuild Search Index</h1>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="apiKey">
            API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter API key"
          />
        </div>
        
        <button
          onClick={handleRebuild}
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {isLoading ? 'Rebuilding...' : 'Rebuild Index'}
        </button>
        
        {result && (
          <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
            {result.success ? (
              <p className="text-green-700">Index rebuilt successfully!</p>
            ) : (
              <p className="text-red-700">Error: {result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 