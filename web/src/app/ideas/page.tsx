'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Navigation } from '../../components/Navigation';
import { safeFetch } from '../../lib/fetchers';
import { config } from '../../lib/config';
import { Idea } from '../../types';

export default function IdeasPage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvedCount, setApprovedCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadIdeas();
    setIsVisible(true);
  }, []);

  const loadIdeas = async () => {
    try {
      const result = await safeFetch<{success: boolean, data: Idea[]}>(
        `${config.aiApi}/ideas/generate`,
        '/mock/ideas.json'
      );
      
      if (result.success && result.data) {
        setIdeas(result.data);
      }
    } catch (error) {
      console.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (ideaId: string) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId ? { ...idea, status: 'approved' as const } : idea
    ));
    setApprovedCount(prev => prev + 1);
  };

  const handleReject = (ideaId: string) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId ? { ...idea, status: 'rejected' as const } : idea
    ));
  };

  const handleGenerateCreatives = () => {
    const approvedIdeas = ideas.filter(idea => idea.status === 'approved');
    if (approvedIdeas.length >= 2) {
      localStorage.setItem('approvedIdeas', JSON.stringify(approvedIdeas.map(i => i.id)));
      router.push('/creatives');
    }
  };

  const getPlatformEmoji = (platform: string) => {
    const emojis: Record<string, string> = {
      'Facebook': '👥',
      'Instagram': '📷',
      'TikTok': '🎥',
      'Google Ads': '🔍',
    };
    return emojis[platform] || '📱';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🧠</div>
          <h2 className="text-2xl font-bold gradient-text mb-4">Generating Ideas...</h2>
          <div className="flex space-x-1 justify-center">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: `${i * 0.2}s`}} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className={`max-w-7xl mx-auto transition-all duration-600 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-center mb-4">
            <h1 className="text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                💡 Marketing Ideas
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-red-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-white/80 text-lg mb-6">
            AI-generated strategies tailored for your business
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Progress</span>
              <span>{approvedCount}/2 approved</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-success-from to-success-to h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((approvedCount / 2) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {ideas.map((idea, index) => (
              <div
                key={idea.id}
                className="animate-slide-up hover:-translate-y-1 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className={`h-full transition-all duration-300 ${
                  idea.status === 'approved' ? 'ring-2 ring-green-400 bg-green-50/50' :
                  idea.status === 'rejected' ? 'ring-2 ring-red-400 bg-red-50/50' : ''
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {idea.title}
                    </h3>
                    <Badge variant="primary" emoji={getPlatformEmoji(idea.platform)}>
                      {idea.platform}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {idea.description}
                  </p>
                  
                  {idea.status === 'pending' && (
                    <div className="flex space-x-2 animate-slide-up">
                      <Button
                        onClick={() => handleApprove(idea.id)}
                        variant="success"
                        className="flex-1"
                      >
                        ✓ Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(idea.id)}
                        variant="danger"
                        className="flex-1"
                      >
                        ✗ Reject
                      </Button>
                    </div>
                  )}
                  
                  {idea.status === 'approved' && (
                    <div className="text-green-600 font-medium flex items-center justify-center py-2 animate-slide-up">
                      <span className="text-2xl mr-2">✨</span>
                      Approved!
                    </div>
                  )}
                  
                  {idea.status === 'rejected' && (
                    <div className="text-red-600 font-medium flex items-center justify-center py-2 animate-slide-up">
                      <span className="text-2xl mr-2">🚫</span>
                      Rejected
                    </div>
                  )}
                </Card>
              </div>
            ))}
        </div>

        <Navigation 
          currentPage="ideas"
          nextLabel={approvedCount >= 2 ? `Generate Creatives (${approvedCount} approved)` : `Need ${2 - approvedCount} more approvals`}
          nextDisabled={approvedCount < 2}
          onNext={approvedCount >= 2 ? handleGenerateCreatives : undefined}
        />
      </div>
    </div>
  );
}