'use client';

import { useState, useEffect } from 'react';
import { planApi } from '../../lib/api';
import { Plan } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function PlanPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const campaignId = localStorage.getItem('campaignId') || 'campaign-1';
      const businessId = localStorage.getItem('businessId') || 'demo';
      
      const result = await planApi.generate(campaignId, businessId);
      if (result.success && result.data) {
        setPlan(result.data);
      }
    } catch (error) {
      console.error('Failed to load plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Generating marketing plan...</div>;
  }

  if (!plan) {
    return <div className="text-center py-8">Failed to load marketing plan</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            📈 Marketing Plan
          </span>
        </h1>
        <div className="w-28 h-1 bg-gradient-to-r from-cyan-400 to-indigo-600 mx-auto rounded-full"></div>
        <p className="text-white/80 text-lg mt-4">Your complete 14-day marketing strategy</p>
      </div>

      {/* Budget Allocation */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Budget Allocation</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={plan.budgetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ platform, percentage }) => `${platform} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {plan.budgetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Budget']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Breakdown</h2>
          <div className="space-y-3">
            {plan.budgetAllocation.map((allocation, index) => (
              <div key={allocation.platform} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded mr-3"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{allocation.platform}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${allocation.amount}</div>
                  <div className="text-sm text-gray-500">{allocation.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 mt-4">
            <div className="flex justify-between font-semibold">
              <span>Total Budget</span>
              <span>${plan.budgetAllocation.reduce((sum, a) => sum + a.amount, 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posting Schedule */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">14-Day Posting Schedule</h2>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 min-w-full">
            {plan.schedule.map((day, index) => (
              <div key={day.date} className="border rounded-lg p-3 min-h-32">
                <div className="font-medium text-sm text-gray-900 mb-2">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="space-y-2">
                  {day.posts.map((post, postIndex) => (
                    <div key={postIndex} className="text-xs">
                      <div className="font-medium text-blue-600">{post.platform}</div>
                      <div className="text-gray-600 truncate">{post.content}</div>
                      <div className="text-gray-500">{post.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {plan.schedule.reduce((sum, day) => sum + day.posts.length, 0)}
          </div>
          <div className="text-gray-600">Total Posts</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {plan.budgetAllocation.length}
          </div>
          <div className="text-gray-600">Platforms</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-2">
            14
          </div>
          <div className="text-gray-600">Days Coverage</div>
        </div>
      </div>
    </div>
  );
}