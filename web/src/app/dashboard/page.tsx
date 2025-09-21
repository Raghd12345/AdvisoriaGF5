'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth');
      return;
    }
    setUser(JSON.parse(userData));
    setIsVisible(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <div className={`flex justify-between items-center mb-12 transition-all duration-1000 ${isVisible ? 'slide-in-up' : 'opacity-0 translate-y-10'}`}>
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Welcome back, {user.name}
            </h1>
            <p className="text-white/80 text-lg">
              Ready to create powerful marketing campaigns?
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            Sign Out
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className={`card interactive-hover transition-all duration-1000 delay-200 ${isVisible ? 'slide-in-left' : 'opacity-0 -translate-x-10'}`}>
            <div className="text-center">
              <div className="text-5xl mb-6">🧠</div>
              <h3 className="text-2xl font-bold gradient-text-dark mb-4">AI Marketing Consultant</h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Generate campaigns, strategies, and creative content tailored to your business
              </p>
              <Link href="/signup" className="btn btn-primary inline-block">
                Start New Campaign
              </Link>
            </div>
          </div>
          
          <div className={`card interactive-hover transition-all duration-1000 delay-400 ${isVisible ? 'slide-in-right' : 'opacity-0 translate-x-10'}`}>
            <div className="text-center">
              <div className="text-5xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold gradient-text-dark mb-4">Competitor Intelligence</h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Analyze competitor strategies and generate winning counter-campaigns
              </p>
              <Link href="/competition" className="btn btn-secondary inline-block">
                Analyze Market
              </Link>
            </div>
          </div>
        </div>

        <div className={`grid md:grid-cols-3 gap-6 transition-all duration-1000 delay-600 ${isVisible ? 'slide-in-up' : 'opacity-0 translate-y-10'}`}>
          <div className="card text-center interactive-hover">
            <div className="text-3xl mb-3">📊</div>
            <div className="text-2xl font-bold gradient-text-dark mb-1">2-3 min</div>
            <div className="text-gray-600">Setup Time</div>
          </div>
          <div className="card text-center interactive-hover">
            <div className="text-3xl mb-3">💡</div>
            <div className="text-2xl font-bold gradient-text-dark mb-1">8+</div>
            <div className="text-gray-600">AI Ideas</div>
          </div>
          <div className="card text-center interactive-hover">
            <div className="text-3xl mb-3">📅</div>
            <div className="text-2xl font-bold gradient-text-dark mb-1">14 Days</div>
            <div className="text-gray-600">Campaign Plan</div>
          </div>
        </div>
      </div>
    </div>
  );
}