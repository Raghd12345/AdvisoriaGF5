'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { creativesApi } from '../../lib/api';
import { ImageWithFallback } from '../../components/ImageWithFallback';
import { Navigation } from '../../components/Navigation';
import { Creative } from '../../types';

export default function CreativesPage() {
  const router = useRouter();
  const [creative, setCreative] = useState<Creative | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCreatives();
  }, []);

  const loadCreatives = async () => {
    try {
      const campaignId = localStorage.getItem('campaignId') || 'campaign-1';
      const businessId = localStorage.getItem('businessId') || 'demo';
      const approvedIdeas = JSON.parse(localStorage.getItem('approvedIdeas') || '[]');
      
      const result = await creativesApi.generate(campaignId, businessId, approvedIdeas);
      if (result.success && result.data) {
        setCreative(result.data);
      }
    } catch (error) {
      console.error('Failed to load creatives');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return <div className="text-center py-8">Generating creatives...</div>;
  }

  if (!creative) {
    return <div className="text-center py-8">Failed to load creatives</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4">
          <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            ✨ Generated Creatives
          </span>
        </h1>
        <div className="w-28 h-1 bg-gradient-to-r from-green-400 to-purple-600 mx-auto rounded-full"></div>
        <p className="text-white/80 text-lg mt-4">AI-powered content ready for your campaigns</p>
      </div>

      {/* Captions Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Social Media Captions</h2>
        <div className="grid gap-4">
          {creative.captions.map((caption: string, index: number) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">Caption {index + 1}</h3>
                <button 
                  onClick={() => copyToClipboard(caption)}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                >
                  Copy
                </button>
              </div>
              <p className="text-gray-700">{caption}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Poster Prompts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Poster Concepts</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {creative.posterPrompts.map((prompt: any, index: number) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md group">
              <h3 className="font-medium text-gray-900 mb-4">{prompt.title}</h3>
              <div className="relative overflow-hidden rounded-lg mb-4 h-48 group-hover:scale-105 transition-transform duration-300">
                <ImageWithFallback
                  src={prompt.imageUrl || prompt.preview_url}
                  alt={`${prompt.title} poster template`}
                  className="w-full h-full"
                  onError={() => console.warn(`Poster thumbnail failed: ${prompt.title}`)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-medium">🎨 Template #{prompt.template_id}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{prompt.description}</p>
              <div className="space-y-2">
                <button 
                  onClick={() => copyToClipboard(prompt.description)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full transition-colors duration-200"
                >
                  📋 Use Template
                </button>
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full transition-colors duration-200"
                  onClick={() => {
                    const customText = window.prompt('Add custom text overlay (e.g., "DJ Physics Saturday 9PM - Book tickets at RM20")');
                    if (customText) {
                      copyToClipboard(`${prompt.description}\n\nCustom overlay: ${customText}`);
                    }
                  }}
                >
                  ✨ Add Custom Text
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Script Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Video Script</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium text-gray-900">30-Second Video Script</h3>
              <p className="text-sm text-gray-600">Professional video content</p>
            </div>
            <button 
              onClick={() => copyToClipboard(creative.videoScript)}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
            >
              Copy Script
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {creative.videoScript}
            </pre>
          </div>
        </div>
      </div>

      <Navigation 
        currentPage="creatives"
        nextLabel="View Marketing Plan"
        backLabel="Back to Ideas"
      />
    </div>
  );
}