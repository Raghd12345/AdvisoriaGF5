'use client';

import { useState, useEffect } from 'react';
import { competitorsApi } from '../../lib/api';
import { Competitor, Comparison } from '../../types';

export default function CompetitionPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadCompetitors();
  }, []);

  const loadCompetitors = async () => {
    try {
      const businessId = localStorage.getItem('businessId') || 'demo';
      const businessData = JSON.parse(localStorage.getItem('businessData') || '{}');
      
      const result = await competitorsApi.generate(
        businessId, 
        businessData.industry || 'general', 
        businessData.city || 'local area'
      );
      
      if (result.success && result.data) {
        setCompetitors(result.data);
      }
    } catch (error) {
      console.error('Failed to load competitors');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (competitorId: string) => {
    setAnalyzing(true);
    try {
      const businessId = localStorage.getItem('businessId') || 'demo';
      const campaignId = localStorage.getItem('campaignId') || 'campaign-1';
      
      const result = await competitorsApi.compare(businessId, campaignId, competitorId);
      if (result.success && result.data) {
        setComparison(result.data);
      }
    } catch (error) {
      alert('Failed to analyze competitor');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading competitor analysis...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4">
          <span className="bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            🎯 Competitor Analysis
          </span>
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-red-400 to-purple-600 mx-auto rounded-full"></div>
        <p className="text-white/80 text-lg mt-4">Analyze the competition and create winning strategies</p>
      </div>

      {/* Competitors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {competitors.map((competitor) => (
          <div key={competitor.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <div className="h-32 rounded-lg overflow-hidden mb-4 relative group">
                {competitor.imageUrl ? (
                  <img 
                    src={competitor.imageUrl} 
                    alt={`${competitor.name} ad preview`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-full flex items-center justify-center">
                    <span className="text-gray-500">📊 Ad Preview</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium">View Details</span>
                </div>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{competitor.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{competitor.adContent}</p>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {competitor.platform}
              </span>
              <span className="text-sm text-gray-500">
                ~${competitor.estimatedBudget}
              </span>
            </div>
            
            <button
              onClick={() => handleAnalyze(competitor.id)}
              disabled={analyzing}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {analyzing ? 'Analyzing...' : 'Analyze vs Our Ad'}
            </button>
          </div>
        ))}
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Analysis Results</h2>
          
          {/* Scores */}
          <div className="grid md:grid-cols-5 gap-4 mb-6">
            {Object.entries(comparison.scores).map(([metric, score]) => (
              <div key={metric} className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {score.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 capitalize">{metric}</div>
              </div>
            ))}
          </div>

          {/* Critique */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Expert Analysis</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{comparison.critique}</p>
          </div>

          {/* Counter Ad */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Recommended Counter-Strategy</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Caption</h4>
                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                  {comparison.counterAd.caption}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Poster Concept</h4>
                <p className="text-gray-700 bg-green-50 p-3 rounded-lg">
                  {comparison.counterAd.posterPrompt}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Video Script</h4>
                <pre className="text-gray-700 bg-yellow-50 p-3 rounded-lg whitespace-pre-wrap text-sm">
                  {comparison.counterAd.videoScript}
                </pre>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
                Approve Counter-Strategy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}