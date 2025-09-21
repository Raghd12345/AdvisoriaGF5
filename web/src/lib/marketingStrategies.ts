// Comprehensive marketing strategies by goal and industry
export const getIndustryBaseIdeas = (industry: string) => {
  const strategies = {
    bakery: [
      { title: 'Fresh Daily Showcase', desc: 'behind-the-scenes baking process', category: 'content', type: 'awareness' },
      { title: 'Custom Celebration Cakes', desc: 'personalized cake design service', category: 'service', type: 'sales' },
      { title: 'Baking Workshop Series', desc: 'educational baking classes', category: 'education', type: 'engagement' },
      { title: 'Coffee Shop Partnerships', desc: 'wholesale supply relationships', category: 'partnership', type: 'expansion' },
      { title: 'Seasonal Ingredient Stories', desc: 'local sourcing transparency', category: 'storytelling', type: 'reputation' },
      { title: 'Customer Recipe Contest', desc: 'user-generated content campaign', category: 'ugc', type: 'engagement' },
      { title: 'Early Bird Delivery', desc: 'morning delivery service', category: 'service', type: 'convenience' },
      { title: 'Loyalty Rewards Program', desc: 'repeat customer incentives', category: 'loyalty', type: 'retention' }
    ],
    restaurant: [
      { title: 'Chef Signature Showcase', desc: 'chef expertise and signature dishes', category: 'content', type: 'awareness' },
      { title: 'Happy Hour Experience', desc: 'after-work dining specials', category: 'promotion', type: 'sales' },
      { title: 'Cooking Masterclass', desc: 'interactive cooking workshops', category: 'education', type: 'engagement' },
      { title: 'Food Blogger Partnerships', desc: 'influencer collaboration program', category: 'partnership', type: 'awareness' },
      { title: 'Seasonal Menu Launch', desc: 'limited-time seasonal offerings', category: 'product', type: 'sales' },
      { title: 'Dining Experience Contest', desc: 'customer photo sharing campaign', category: 'ugc', type: 'engagement' },
      { title: 'Corporate Catering', desc: 'business-to-business catering service', category: 'service', type: 'expansion' },
      { title: 'VIP Member Program', desc: 'exclusive dining experiences', category: 'loyalty', type: 'retention' }
    ],
    retail: [
      { title: 'Style Transformation', desc: 'before/after styling sessions', category: 'content', type: 'awareness' },
      { title: 'Personal Shopping Service', desc: 'one-on-one styling consultation', category: 'service', type: 'sales' },
      { title: 'Fashion Workshop Series', desc: 'styling tips and fashion education', category: 'education', type: 'engagement' },
      { title: 'Local Event Partnerships', desc: 'fashion show collaborations', category: 'partnership', type: 'awareness' },
      { title: 'Seasonal Collection Launch', desc: 'new collection introduction', category: 'product', type: 'sales' },
      { title: 'Style Challenge Contest', desc: 'customer outfit sharing', category: 'ugc', type: 'engagement' },
      { title: 'Corporate Wardrobe Service', desc: 'business professional styling', category: 'service', type: 'expansion' },
      { title: 'Fashion Insider Program', desc: 'early access and exclusive deals', category: 'loyalty', type: 'retention' }
    ],
    salon: [
      { title: 'Transformation Showcase', desc: 'dramatic before/after reveals', category: 'content', type: 'awareness' },
      { title: 'Bridal Beauty Packages', desc: 'comprehensive wedding services', category: 'service', type: 'sales' },
      { title: 'Beauty Masterclass', desc: 'professional beauty techniques', category: 'education', type: 'engagement' },
      { title: 'Wedding Vendor Network', desc: 'bridal industry partnerships', category: 'partnership', type: 'expansion' },
      { title: 'Seasonal Beauty Trends', desc: 'trending looks and treatments', category: 'content', type: 'awareness' },
      { title: 'Beauty Challenge Series', desc: 'customer transformation stories', category: 'ugc', type: 'engagement' },
      { title: 'Corporate Wellness Program', desc: 'employee beauty and wellness', category: 'service', type: 'expansion' },
      { title: 'Beauty VIP Club', desc: 'exclusive treatments and discounts', category: 'loyalty', type: 'retention' }
    ]
  };
  
  return strategies[industry as keyof typeof strategies] || strategies.bakery;
};

export const adaptTitleForGoal = (baseTitle: string, goal: string, audienceTypes: any) => {
  const goalAdaptations = {
    increase_brand_awareness: {
      prefix: audienceTypes.students ? '🎓 Student-Focused' : audienceTypes.families ? '👨‍👩‍👧‍👦 Family' : audienceTypes.professionals ? '💼 Professional' : '🌟 Community',
      suffix: 'Spotlight'
    },
    generate_leads: {
      prefix: '📈 Lead-Generating',
      suffix: 'Campaign'
    },
    increase_sales: {
      prefix: '💰 Revenue-Boosting',
      suffix: 'Promotion'
    },
    drive_website_traffic: {
      prefix: '🌐 Traffic-Driving',
      suffix: 'Strategy'
    },
    reputation_management: {
      prefix: '⭐ Trust-Building',
      suffix: 'Initiative'
    },
    market_expansion: {
      prefix: '🚀 Market-Expanding',
      suffix: 'Program'
    },
    customer_engagement: {
      prefix: '💬 Engagement-Focused',
      suffix: 'Experience'
    },
    customer_retention: {
      prefix: '🔄 Loyalty-Building',
      suffix: 'Program'
    },
    launch_new_product: {
      prefix: '🎉 Launch',
      suffix: 'Campaign'
    },
    competitive_positioning: {
      prefix: '🏆 Competitive',
      suffix: 'Advantage'
    }
  };
  
  const adaptation = goalAdaptations[goal as keyof typeof goalAdaptations] || goalAdaptations.increase_brand_awareness;
  return `${adaptation.prefix} ${baseTitle} ${adaptation.suffix}`;
};

export const adaptDescriptionForGoal = (baseDesc: string, goal: string, audienceTypes: any, businessName: string, city: string, budget: number) => {
  const audienceInsight = audienceTypes.students ? 'student-friendly pricing and social media focus' :
                         audienceTypes.families ? 'family packages and weekend availability' :
                         audienceTypes.professionals ? 'convenience and premium quality' :
                         audienceTypes.seniors ? 'personalized service and traditional values' :
                         audienceTypes.tourists ? 'unique local experience and easy booking' :
                         'community-focused approach';
  
  const goalStrategies = {
    increase_brand_awareness: `Build ${businessName}'s visibility in ${city} through ${baseDesc}. Focus on ${audienceInsight} to maximize reach. Budget allocation: 60% content creation, 40% promotion.`,
    generate_leads: `Capture qualified leads for ${businessName} using ${baseDesc} as lead magnet. Target ${audienceInsight} with clear CTAs. Expected: 50+ leads with RM${budget} budget.`,
    increase_sales: `Drive direct sales for ${businessName} through ${baseDesc} with compelling offers. Leverage ${audienceInsight} for conversion optimization. ROI target: 3:1.`,
    drive_website_traffic: `Increase ${businessName}'s online traffic via ${baseDesc} content strategy. Optimize for ${audienceInsight} to boost engagement. Target: 200% traffic increase.`,
    reputation_management: `Enhance ${businessName}'s reputation in ${city} through ${baseDesc} showcasing quality. Build trust with ${audienceInsight} approach.`,
    market_expansion: `Expand ${businessName}'s market reach using ${baseDesc} to attract new segments. Focus on ${audienceInsight} for growth opportunities.`,
    customer_engagement: `Boost ${businessName}'s community engagement through interactive ${baseDesc}. Create meaningful connections using ${audienceInsight}.`,
    customer_retention: `Increase ${businessName}'s customer loyalty via ${baseDesc} rewards and experiences. Retain customers through ${audienceInsight}.`,
    launch_new_product: `Successfully launch ${businessName}'s new offering using ${baseDesc} as introduction strategy. Generate excitement with ${audienceInsight}.`,
    competitive_positioning: `Position ${businessName} ahead of ${city} competitors through unique ${baseDesc}. Differentiate using ${audienceInsight} advantages.`
  };
  
  return goalStrategies[goal as keyof typeof goalStrategies] || goalStrategies.increase_brand_awareness;
};

export const selectOptimalPlatform = (goal: string, audienceTypes: any, category: string) => {
  // Platform selection based on goal + audience + content type
  if (audienceTypes.students) {
    return goal === 'increase_brand_awareness' ? 'TikTok' : 
           goal === 'generate_leads' ? 'Instagram' : 
           goal === 'customer_engagement' ? 'TikTok' : 'Instagram';
  }
  
  if (audienceTypes.professionals) {
    return goal === 'generate_leads' ? 'LinkedIn' :
           goal === 'drive_website_traffic' ? 'Google Ads' :
           goal === 'reputation_management' ? 'LinkedIn' : 'Facebook';
  }
  
  if (audienceTypes.families) {
    return goal === 'increase_sales' ? 'Facebook' :
           goal === 'customer_engagement' ? 'Facebook' :
           goal === 'reputation_management' ? 'Google Reviews' : 'Facebook';
  }
  
  // Default platform selection by goal
  const platformByGoal = {
    increase_brand_awareness: 'Instagram',
    generate_leads: 'Facebook',
    increase_sales: 'Facebook',
    drive_website_traffic: 'Google Ads',
    reputation_management: 'Google Reviews',
    market_expansion: 'Instagram',
    customer_engagement: 'Instagram',
    customer_retention: 'Email',
    launch_new_product: 'Instagram',
    competitive_positioning: 'LinkedIn'
  };
  
  return platformByGoal[goal as keyof typeof platformByGoal] || 'Instagram';
};