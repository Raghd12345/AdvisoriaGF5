export interface Business {
  businessId: string;
  name: string;
  logo?: string;
  industry: string;
  country: string;
  city: string;
  zipCode: string;
  workingHours: {
    start: string;
    end: string;
  };
  createdAt: string;
}

export interface Campaign {
  campaignId: string;
  businessId: string;
  goal: string;
  targetAudience: string;
  budget: number;
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
}

export interface Idea {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  platform: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Creative {
  id: string;
  campaignId: string;
  captions: string[];
  posterPrompts: {
    description: string;
    imageUrl: string;
  }[];
  videoScript: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  campaignId: string;
  budgetAllocation: {
    platform: string;
    amount: number;
    percentage: number;
  }[];
  schedule: {
    date: string;
    posts: {
      platform: string;
      content: string;
      time: string;
    }[];
  }[];
  createdAt: string;
}

export interface Competitor {
  id: string;
  businessId: string;
  name: string;
  industry: string;
  adContent: string;
  platform: string;
  location: string;
  estimatedBudget: number;
  imageUrl?: string;
  createdAt: string;
}

export interface Comparison {
  comparisonId: string;
  businessId: string;
  campaignId: string;
  competitorId: string;
  scores: {
    clarity: number;
    cta: number;
    relevance: number;
    design: number;
    overall: number;
  };
  critique: string;
  counterAd: {
    caption: string;
    posterPrompt: string;
    videoScript: string;
  };
  createdAt: string;
}

export interface ChatSession {
  sessionId: string;
  businessId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  sessionId: string;
  ts: number;
  role: 'user' | 'assistant';
  content: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadResponse {
  uploadUrl: string;
  key: string;
}