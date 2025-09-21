'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { campaignApi } from '../../../lib/api';

export default function NewCampaignPage() {
  const router = useRouter();
  const [businessId, setBusinessId] = useState('');
  const [formData, setFormData] = useState({
    goal: '',
    targetAudience: '',
    budget: 300
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedBusinessId = localStorage.getItem('businessId');
    if (!storedBusinessId) {
      router.push('/signup');
      return;
    }
    setBusinessId(storedBusinessId);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const campaignData = {
        ...formData,
        businessId,
        status: 'draft' as const
      };
      
      const result = await campaignApi.create(campaignData);
      if (result.success && result.data) {
        localStorage.setItem('campaignId', result.data.campaignId);
        localStorage.setItem('campaignData', JSON.stringify(result.data));
        router.push('/ideas');
      } else {
        alert('Failed to create campaign');
      }
    } catch (error) {
      alert('Error creating campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? Number(value) : value
    }));
  };

  if (!businessId) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Campaign</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Goal *
          </label>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select your primary goal</option>
            <option value="increase_brand_awareness">🎯 Increase Brand Awareness</option>
            <option value="generate_leads">📈 Generate Leads</option>
            <option value="increase_sales">💰 Increase Sales</option>
            <option value="drive_website_traffic">🌐 Drive Website Traffic</option>
            <option value="reputation_management">⭐ Reputation Management</option>
            <option value="market_expansion">🚀 Market Expansion</option>
            <option value="customer_engagement">💬 Customer Engagement</option>
            <option value="customer_retention">🔄 Customer Retention</option>
            <option value="launch_new_product">🆕 Launch New Product/Service</option>
            <option value="competitive_positioning">🏆 Competitive Positioning</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Audience *
          </label>
          <textarea
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Young professionals aged 25-40, families with children, local residents"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget (USD) *
          </label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min="50"
            max="10000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Recommended minimum: $100 for effective reach
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating Campaign...' : 'Generate Marketing Ideas'}
        </button>
      </form>
    </div>
  );
}