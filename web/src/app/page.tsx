'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { Particles } from '../components/Particles';
import { MouseSpotlight } from '../components/MouseSpotlight';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { config } from '../lib/config';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);



  return (
    <div className="relative min-h-screen">
      <Particles />
      <MouseSpotlight />
      
      {/* Demo Mode Banner */}
      {config.useMocks && (
        <div className="fixed top-4 right-4 z-50 glass px-4 py-2 rounded-lg text-white text-sm">
          🎭 Demo Mode (Mock Data)
        </div>
      )}

      <div className={`relative z-20 text-center px-4 py-20 transition-all duration-1000 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16 animate-slide-up animate-stagger-1">
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              <span className="gradient-text block">Advisoria</span>
              <span className="text-white block">AI Marketing</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light max-w-3xl mx-auto">
              Transform your business with AI-powered marketing strategies that deliver real results
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 animate-slide-up animate-stagger-2">
            <Card className="text-center group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🧠</div>
              <h3 className="text-xl font-bold gradient-text mb-3">AI Marketing Consultant</h3>
              <p className="text-gray-600 mb-6">
                Generate campaigns, strategies, and creative content tailored to your business
              </p>
              <Link href="/signup">
                <Button variant="primary" glow shine className="w-full">
                  Get Started ✨
                </Button>
              </Link>
            </Card>
            
            <Card className="text-center group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
              <h3 className="text-xl font-bold gradient-text mb-3">Competitor Intelligence</h3>
              <p className="text-gray-600 mb-6">
                Analyze competitor strategies and generate winning counter-campaigns
              </p>
              <Link href="/competition">
                <Button variant="secondary" className="w-full">
                  Analyze Market 🔍
                </Button>
              </Link>
            </Card>
            
            <Card className="text-center group md:col-span-2 lg:col-span-1">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">💬</div>
              <h3 className="text-xl font-bold gradient-text mb-3">AI Chat Assistant</h3>
              <p className="text-gray-600 mb-6">
                Get instant marketing advice and strategy recommendations
              </p>
              <Link href="/chat">
                <Button variant="success" className="w-full">
                  Start Chatting 💭
                </Button>
              </Link>
            </Card>
          </div>

          {/* Animated Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 animate-slide-up animate-stagger-3">
            <Card className="text-center">
              <div className="text-4xl font-black gradient-text mb-2">
                <AnimatedCounter end={2.5} suffix=" min" decimals={1} />
              </div>
              <div className="text-gray-600">Setup Time</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-4xl font-black gradient-text mb-2">
                <AnimatedCounter end={8} suffix="+" />
              </div>
              <div className="text-gray-600">AI-Generated Ideas</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-4xl font-black gradient-text mb-2">
                <AnimatedCounter end={14} suffix=" Days" />
              </div>
              <div className="text-gray-600">Marketing Calendar</div>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center animate-slide-up animate-stagger-4">
            <p className="text-white/70 text-lg mb-8">
              Join thousands of businesses transforming their marketing with AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button variant="primary" size="lg" glow shine className="animate-pulse-glow">
                  🚀 Start Your Journey
                </Button>
              </Link>
              <Link href="/competition">
                <Button variant="ghost" size="lg">
                  🎯 Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}