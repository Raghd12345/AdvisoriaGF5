import { Business, Campaign, Idea, Creative, Plan, Competitor, Comparison, ChatMessage, ApiResponse, UploadResponse } from '../types';
import { getIndustryBaseIdeas, adaptTitleForGoal, adaptDescriptionForGoal, selectOptimalPlatform } from './marketingStrategies';

// Mock delay for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const businessApi = {
  async create(business: Omit<Business, 'businessId' | 'createdAt'>): Promise<ApiResponse<Business>> {
    await delay(1000);
    const businessData: Business = {
      ...business,
      businessId: `business-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    return { success: true, data: businessData };
  },
};

export const campaignApi = {
  async create(campaign: Omit<Campaign, 'campaignId' | 'createdAt'>): Promise<ApiResponse<Campaign>> {
    await delay(800);
    const campaignData: Campaign = {
      ...campaign,
      campaignId: `campaign-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    return { success: true, data: campaignData };
  },
};

export const ideasApi = {
  async generate(campaignId: string, businessId: string): Promise<ApiResponse<Idea[]>> {
    await delay(2000);
    
    // Get business context for dynamic generation
    const businessData = JSON.parse(localStorage.getItem('businessData') || '{}');
    const campaignData = JSON.parse(localStorage.getItem('campaignData') || '{}');
    const industry = businessData.industry || 'general';
    const businessName = businessData.name || 'Your Business';
    const city = businessData.city || 'your city';
    const goal = campaignData.goal || 'increase_brand_awareness';
    const audience = campaignData.targetAudience || 'local customers';
    const budget = campaignData.budget || 300;
    
    // Audience analysis for targeting
    const audienceTypes = {
      students: audience.toLowerCase().includes('student') || audience.toLowerCase().includes('young'),
      families: audience.toLowerCase().includes('family') || audience.toLowerCase().includes('parent'),
      professionals: audience.toLowerCase().includes('professional') || audience.toLowerCase().includes('business'),
      seniors: audience.toLowerCase().includes('senior') || audience.toLowerCase().includes('elderly'),
      locals: audience.toLowerCase().includes('local') || audience.toLowerCase().includes('community'),
      tourists: audience.toLowerCase().includes('tourist') || audience.toLowerCase().includes('visitor')
    };
    
    // Generate 10-12 unique marketing ideas based on business context
    const generateContextualIdeas = () => {
      const workingHours = businessData.workingHours || { start: '09:00', end: '17:00' };
      const isEarlyOpen = workingHours.start <= '07:00';
      const isLateOpen = workingHours.end >= '20:00';
      const budgetTier = budget < 300 ? 'low' : budget < 800 ? 'medium' : 'high';
      
      // Dynamic idea generation based on all business inputs
      const generateIdeasForContext = () => {
        const baseIdeas = [];
        
        // Industry + Goal + Context specific ideas
        if (industry === 'bakery') {
          if (goal === 'increase_brand_awareness') {
            baseIdeas.push(
              { platform: 'TikTok', idea: `Behind-the-scenes baking at ${businessName} starting ${workingHours.start} daily in ${city}`, type: 'Video Campaign', reason: 'TikTok perfect for visual baking content, early hours create authenticity' },
              { platform: 'Instagram', idea: `Daily fresh bread showcase with ${businessName} time-lapse videos featuring ${city} ingredients`, type: 'Content Series', reason: 'Instagram Stories ideal for daily content, local ingredients build community connection' },
              { platform: 'Facebook', idea: `${businessName} Customer of the Week contest - free pastry reward for ${audience}`, type: 'Engagement', reason: 'Facebook great for community building and local customer recognition' },
              { platform: 'Google Ads', idea: `Local search ads "fresh bakery ${city}" targeting ${audience} during ${workingHours.start}-10am`, type: 'Paid Advertising', reason: 'Google Ads capture high-intent local searches during morning rush' },
              { platform: 'Instagram', idea: `Partner with ${city} food bloggers for ${businessName} reviews and features`, type: 'Influencer Partnership', reason: 'Instagram influencers drive local awareness and credibility' },
              { platform: 'TikTok', idea: `${businessName} baking tips series - professional secrets from ${city}`, type: 'Educational Content', reason: 'Educational content builds authority and attracts baking enthusiasts' },
              { platform: 'Facebook', idea: `Share ${businessName} customer testimonials and success stories from ${city} locals`, type: 'Social Proof', reason: 'Facebook testimonials build trust with local community' },
              { platform: 'Instagram', idea: `Seasonal ingredient spotlight - ${businessName} sources from ${city} farms`, type: 'Product Focus', reason: 'Instagram perfect for ingredient photography, local sourcing appeals to conscious consumers' },
              { platform: 'Google My Business', idea: `Daily posts with fresh product photos from ${businessName} ${workingHours.start} opening`, type: 'Local SEO', reason: 'GMB posts boost local search visibility during peak hours' },
              { platform: 'Facebook', idea: `Live baking demonstrations at ${businessName} during peak hours (${workingHours.start}-10am)`, type: 'Live Content', reason: 'Facebook Live reaches local audience during morning commute' },
              { platform: 'Instagram', idea: `#BakeWith${businessName.replace(/\s+/g, '')} user-generated content campaign in ${city}`, type: 'UGC Campaign', reason: 'Hashtag campaigns create community engagement and free content' },
              { platform: 'TikTok', idea: `Quick recipe recreations using ${businessName} products - ${city} edition`, type: 'Recipe Content', reason: 'Recipe content drives product sales and showcases versatility' }
            );
          }
        }
        
        // Add more industries and goals dynamically
        if (baseIdeas.length === 0) {
          // Fallback dynamic generation
          const platforms = ['Instagram', 'Facebook', 'TikTok', 'Google Ads', 'Google My Business'];
          const types = ['Content Series', 'Engagement', 'Paid Advertising', 'Social Proof', 'Local SEO'];
          
          for (let i = 0; i < 10; i++) {
            const platform = platforms[i % platforms.length];
            const type = types[i % types.length];
            baseIdeas.push({
              platform,
              idea: `${businessName} ${goal.replace(/_/g, ' ')} strategy ${i + 1} for ${industry} business in ${city} (${workingHours.start}-${workingHours.end})`,
              type,
              reason: `${platform} optimal for ${goal.replace(/_/g, ' ')} with ${budgetTier} budget targeting ${audience}`
            });
          }
        }
        
        return baseIdeas.slice(0, 12);
      };
      
      return generateIdeasForContext();
    };
    
    const contextualIdeas = generateContextualIdeas();
    const mockIdeas: Idea[] = contextualIdeas.map((idea, index) => ({
      id: `idea-${index + 1}`,
      campaignId,
      title: `${idea.type}: ${idea.idea}`,
      description: `Platform: ${idea.platform} | Why: ${idea.reason} | Focus: ${goal.replace(/_/g, ' ')} for ${businessName} in ${city}`,
      platform: idea.platform,
      status: 'pending',
      createdAt: new Date().toISOString()
    }));

    
    return { success: true, data: mockIdeas };
  },
};

export const creativesApi = {
  async generate(campaignId: string, businessId: string, approvedIdeas: string[]): Promise<ApiResponse<Creative>> {
    await delay(1500);
    
    const businessData = JSON.parse(localStorage.getItem('businessData') || '{}');
    const campaignData = JSON.parse(localStorage.getItem('campaignData') || '{}');
    const businessName = businessData.name || 'Your Business';
    const industry = businessData.industry || 'general';
    const city = businessData.city || 'your city';
    const goal = campaignData.goal || 'increase_brand_awareness';
    const audience = campaignData.targetAudience || 'customers';
    
    // Generate 10 Canva-style poster templates per industry
    const generatePosterTemplates = () => {
      const templates = {
        bakery: [
          { template_id: 1, title: 'Grand Opening', preview_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=600&fit=crop&auto=format' },
          { template_id: 2, title: 'Weekend Promo', preview_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=600&fit=crop&auto=format' },
          { template_id: 3, title: 'Fresh Daily', preview_url: 'https://images.unsplash.com/photo-1555507036-ab794f4ade2a?w=400&h=600&fit=crop&auto=format' },
          { template_id: 4, title: 'Custom Cakes', preview_url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=600&fit=crop&auto=format' },
          { template_id: 5, title: 'Morning Special', preview_url: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=400&h=600&fit=crop&auto=format' },
          { template_id: 6, title: 'Artisan Bread', preview_url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=600&fit=crop&auto=format' },
          { template_id: 7, title: 'Birthday Cakes', preview_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=600&fit=crop&auto=format' },
          { template_id: 8, title: 'Pastry Selection', preview_url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=600&fit=crop&auto=format' },
          { template_id: 9, title: 'Coffee & Pastries', preview_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=600&fit=crop&auto=format' },
          { template_id: 10, title: 'Holiday Special', preview_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop&auto=format' }
        ],
        restaurant: [
          { template_id: 1, title: 'Fine Dining', preview_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=600&fit=crop&auto=format' },
          { template_id: 2, title: 'Chef Special', preview_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop&auto=format' },
          { template_id: 3, title: 'Happy Hour', preview_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=600&fit=crop&auto=format' },
          { template_id: 4, title: 'Weekend Brunch', preview_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=600&fit=crop&auto=format' },
          { template_id: 5, title: 'Date Night', preview_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=600&fit=crop&auto=format' },
          { template_id: 6, title: 'Family Dinner', preview_url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&h=600&fit=crop&auto=format' },
          { template_id: 7, title: 'Seasonal Menu', preview_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=600&fit=crop&auto=format' },
          { template_id: 8, title: 'Wine Pairing', preview_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop&auto=format' },
          { template_id: 9, title: 'Private Events', preview_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=600&fit=crop&auto=format' },
          { template_id: 10, title: 'Takeout Special', preview_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=600&fit=crop&auto=format' }
        ],
        retail: [
          { template_id: 1, title: 'New Collection', preview_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&auto=format' },
          { template_id: 2, title: 'Fashion Sale', preview_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop&auto=format' },
          { template_id: 3, title: 'Style Guide', preview_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop&auto=format' },
          { template_id: 4, title: 'Seasonal Trends', preview_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop&auto=format' },
          { template_id: 5, title: 'Personal Styling', preview_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop&auto=format' },
          { template_id: 6, title: 'Accessories Focus', preview_url: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=600&fit=crop&auto=format' },
          { template_id: 7, title: 'Wardrobe Essentials', preview_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop&auto=format' },
          { template_id: 8, title: 'Student Discount', preview_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=600&fit=crop&auto=format' },
          { template_id: 9, title: 'VIP Preview', preview_url: 'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?w=400&h=600&fit=crop&auto=format' },
          { template_id: 10, title: 'Clearance Event', preview_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=600&fit=crop&auto=format' }
        ],
        salon: [
          { template_id: 1, title: 'Hair Transformation', preview_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=600&fit=crop&auto=format' },
          { template_id: 2, title: 'Bridal Package', preview_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=600&fit=crop&auto=format' },
          { template_id: 3, title: 'Color Specialist', preview_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=600&fit=crop&auto=format' },
          { template_id: 4, title: 'Luxury Treatment', preview_url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=600&fit=crop&auto=format' },
          { template_id: 5, title: 'Men\'s Grooming', preview_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=600&fit=crop&auto=format' },
          { template_id: 6, title: 'Spa Day', preview_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=600&fit=crop&auto=format' },
          { template_id: 7, title: 'Quick Cuts', preview_url: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=600&fit=crop&auto=format' },
          { template_id: 8, title: 'Hair Care Tips', preview_url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=600&fit=crop&auto=format' },
          { template_id: 9, title: 'Special Occasion', preview_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=600&fit=crop&auto=format' },
          { template_id: 10, title: 'Consultation Free', preview_url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=600&fit=crop&auto=format' }
        ]
      };
      
      return templates[industry as keyof typeof templates] || templates.bakery;
    };
    
    // Generate platform-specific captions based on goal and industry
    const generatePlatformCaptions = () => {
      const captions = [];
      
      // Facebook Ad Copy
      if (goal === 'increase_brand_awareness') {
        captions.push({
          platform: 'Facebook',
          caption: `🌟 Introducing ${businessName} to ${city}! We're your local ${industry} experts serving ${audience}. 📍 Located in ${city} • Open ${businessData.workingHours?.start || '9am'}-${businessData.workingHours?.end || '5pm'} • Quality guaranteed! 👆 Like our page for daily updates and special offers. #${businessName.replace(/\s+/g, '')} #${city.replace(/\s+/g, '')}${industry.charAt(0).toUpperCase() + industry.slice(1)}`
        });
      } else if (goal === 'generate_leads') {
        captions.push({
          platform: 'Facebook',
          caption: `📞 FREE Consultation at ${businessName}! 🎯 Perfect for ${audience} in ${city} looking for quality ${industry} services. 📅 Book your appointment today - limited slots available! 📍 Visit us or call now. Don't miss this exclusive offer! #FreeConsultation #${businessName.replace(/\s+/g, '')} #${city.replace(/\s+/g, '')}`
        });
      }
      
      // TikTok Hook
      captions.push({
        platform: 'TikTok',
        caption: `POV: You found the best ${industry} in ${city} 😍 @${businessName.replace(/\s+/g, '').toLowerCase()} hits different 🔥 Who else is obsessed? 🙋‍♀️ #${city.replace(/\s+/g, '')}${industry.charAt(0).toUpperCase() + industry.slice(1)} #${businessName.replace(/\s+/g, '')} #fyp #viral`
      });
      
      // LinkedIn Professional Post
      captions.push({
        platform: 'LinkedIn',
        caption: `Excited to serve the ${city} business community! ${businessName} specializes in ${industry} services for ${audience}. Our commitment to excellence and local expertise sets us apart. Connect with us to learn how we can support your needs. #${city}Business #${industry.charAt(0).toUpperCase() + industry.slice(1)}Services #LocalExpertise`
      });
      
      // Instagram Story/Post
      captions.push({
        platform: 'Instagram',
        caption: `✨ ${businessName} • ${city} ✨\n\n${industry === 'bakery' ? '🥖 Fresh daily' : industry === 'restaurant' ? '🍽️ Exceptional dining' : industry === 'retail' ? '🛍️ Style that speaks' : '💇‍♀️ Beauty redefined'}\n\n📍 ${city}\n🕰️ ${businessData.workingHours?.start || '9am'} - ${businessData.workingHours?.end || '5pm'}\n\n#${businessName.replace(/\s+/g, '')} #${city.replace(/\s+/g, '')} #${industry}`
      });
      
      return captions;
    };
    
    const mockCreative: Creative = {
      id: `creative-${Date.now()}`,
      campaignId,
      captions: generatePlatformCaptions().map(c => c.caption),
      posterPrompts: generatePosterTemplates().map(template => ({
        ...template,
        description: `${template.title} poster template for ${businessName} - ${industry} business in ${city}`,
        imageUrl: template.preview_url
      })),
      videoScript: `FADE IN: ${businessName} storefront in ${city}\\n\\nVOICEOVER: 'At ${businessName}, we believe in ${goal.replace(/_/g, ' ')}...'\\n\\nCUT TO: Happy customers experiencing your service\\n\\nVOICEOVER: 'Join ${audience} who trust ${businessName} for quality ${industry} services.'\\n\\nTEXT OVERLAY: '${businessName} - ${city}'\\n\\nCALL TO ACTION: 'Visit us today!'\\n\\nFADE OUT`,
      createdAt: new Date().toISOString()
    };
    
    return { success: true, data: mockCreative };
  },
};

export const planApi = {
  async generate(campaignId: string, businessId: string): Promise<ApiResponse<Plan>> {
    await delay(1200);
    
    const businessData = JSON.parse(localStorage.getItem('businessData') || '{}');
    const campaignData = JSON.parse(localStorage.getItem('campaignData') || '{}');
    const businessName = businessData.name || 'Your Business';
    const industry = businessData.industry || 'general';
    const city = businessData.city || 'your city';
    const budget = campaignData.budget || 1000;
    const audience = campaignData.targetAudience || 'local customers';
    const goal = campaignData.goal || 'increase_brand_awareness';
    
    // Goal-driven budget allocation
    const getBudgetAllocation = () => {
      const allocations = {
        increase_brand_awareness: [
          { platform: 'Instagram', amount: Math.round(budget * 0.4), percentage: 40 },
          { platform: 'Facebook', amount: Math.round(budget * 0.3), percentage: 30 },
          { platform: 'TikTok', amount: Math.round(budget * 0.2), percentage: 20 },
          { platform: 'Google Ads', amount: Math.round(budget * 0.1), percentage: 10 }
        ],
        generate_leads: [
          { platform: 'Facebook', amount: Math.round(budget * 0.4), percentage: 40 },
          { platform: 'Google Ads', amount: Math.round(budget * 0.3), percentage: 30 },
          { platform: 'Instagram', amount: Math.round(budget * 0.2), percentage: 20 },
          { platform: 'LinkedIn', amount: Math.round(budget * 0.1), percentage: 10 }
        ],
        increase_sales: [
          { platform: 'Facebook', amount: Math.round(budget * 0.35), percentage: 35 },
          { platform: 'Google Ads', amount: Math.round(budget * 0.35), percentage: 35 },
          { platform: 'Instagram', amount: Math.round(budget * 0.2), percentage: 20 },
          { platform: 'Email', amount: Math.round(budget * 0.1), percentage: 10 }
        ]
      };
      
      return allocations[goal as keyof typeof allocations] || allocations.increase_brand_awareness;
    };
    
    // Generate proportional posts based on budget allocation
    const generateSchedule = () => {
      const allocation = getBudgetAllocation();
      const totalBudget = allocation.reduce((sum, item) => sum + item.amount, 0);
      
      return Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        const posts = [];
        
        // Distribute posts proportionally based on budget
        allocation.forEach((item, index) => {
          const postFrequency = Math.round((item.percentage / 100) * 7); // Posts per week
          if (i % Math.max(1, Math.floor(7 / postFrequency)) === index % 3) {
            const timeSlots = {
              'Facebook': '10:00',
              'Instagram': '12:00', 
              'TikTok': '18:00',
              'Google Ads': '09:00',
              'LinkedIn': '08:00',
              'Email': '16:00'
            };
            
            posts.push({
              platform: item.platform,
              content: `${businessName} ${goal.replace(/_/g, ' ')} content for ${item.platform} - Day ${i + 1} targeting ${audience} in ${city}`,
              time: timeSlots[item.platform as keyof typeof timeSlots] || '12:00'
            });
          }
        });
        
        return {
          date: date.toISOString().split('T')[0],
          posts
        };
      });
    };
    
    const mockPlan: Plan = {
      id: `plan-${Date.now()}`,
      campaignId,
      budgetAllocation: getBudgetAllocation(),
      schedule: generateSchedule(),
      createdAt: new Date().toISOString()
    };
    
    return { success: true, data: mockPlan };
  },
};

export const competitorsApi = {
  async generate(businessId: string, industry: string, city: string): Promise<ApiResponse<Competitor[]>> {
    await delay(1800);
    
    const businessData = JSON.parse(localStorage.getItem('businessData') || '{}');
    const campaignData = JSON.parse(localStorage.getItem('campaignData') || '{}');
    const budget = campaignData.budget || 1000;
    
    // Industry-specific competitor generation
    const getIndustryCompetitors = () => {
      const competitorTemplates = {
        bakery: [
          {
            name: `${city} Artisan Bakery`,
            adContent: `Fresh artisan breads and pastries daily in ${city}! Family recipes passed down for generations. Visit us for authentic baking experience. Open early for fresh breakfast treats!`,
            imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 1.2)
          },
          {
            name: `Sweet Dreams Cakes ${city}`,
            adContent: `Custom celebration cakes in ${city}! Weddings, birthdays, corporate events - we create edible masterpieces. Book your consultation today for unforgettable celebrations!`,
            imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 0.8)
          },
          {
            name: `Morning Glory Bakehouse`,
            adContent: `${city}'s favorite morning destination! Fresh coffee, warm pastries, and friendly service since 2015. Perfect for busy professionals and families. Delivery available!`,
            imageUrl: 'https://images.unsplash.com/photo-1555507036-ab794f4ade2a?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 1.5)
          },
          {
            name: `Golden Crust Bakery`,
            adContent: `Premium baked goods in ${city}! Organic ingredients, traditional methods, modern flavors. Catering services for offices and events. Taste the difference quality makes!`,
            imageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 0.9)
          }
        ],
        restaurant: [
          {
            name: `${city} Fine Dining`,
            adContent: `Exceptional culinary experience in ${city}! Award-winning chef, locally sourced ingredients, intimate atmosphere. Reservations recommended for unforgettable dining.`,
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 1.8)
          },
          {
            name: `Fusion Kitchen ${city}`,
            adContent: `Modern fusion cuisine in ${city}! Creative dishes, craft cocktails, vibrant atmosphere. Perfect for date nights and celebrations. Happy hour 5-7 PM daily!`,
            imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 1.3)
          },
          {
            name: `Family Table Restaurant`,
            adContent: `${city}'s favorite family restaurant! Generous portions, affordable prices, kids eat free Sundays. Comfort food that brings families together since 2010.`,
            imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 0.7)
          },
          {
            name: `Urban Bistro ${city}`,
            adContent: `Trendy bistro in downtown ${city}! Fresh seasonal menu, craft beer selection, live music weekends. Book your table for the ultimate urban dining experience!`,
            imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 1.1)
          }
        ],
        retail: [
          {
            name: `${city} Fashion House`,
            adContent: `Latest fashion trends in ${city}! Designer collections, personal styling, exclusive pieces. Transform your wardrobe with our expert fashion consultants.`,
            imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 1.4)
          },
          {
            name: `Style Studio ${city}`,
            adContent: `Affordable fashion for everyone in ${city}! Trendy pieces, student discounts, seasonal sales. Look great without breaking the bank. New arrivals weekly!`,
            imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 0.6)
          },
          {
            name: `Boutique Elegance`,
            adContent: `Luxury boutique in ${city}! Curated collections, premium brands, VIP shopping experience. Exclusive pieces for discerning fashion lovers.`,
            imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 2.0)
          },
          {
            name: `Trendy Threads ${city}`,
            adContent: `Fast fashion in ${city}! Latest trends, quick delivery, social media worthy outfits. Follow us for daily style inspiration and flash sales!`,
            imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 0.8)
          }
        ],
        salon: [
          {
            name: `${city} Beauty Lounge`,
            adContent: `Premium beauty services in ${city}! Hair, nails, skincare, makeup. Expert stylists, luxury products, relaxing atmosphere. Book your transformation today!`,
            imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 1.6)
          },
          {
            name: `Glamour Studio ${city}`,
            adContent: `Bridal beauty specialists in ${city}! Complete wedding packages, trial sessions, on-location services. Make your special day absolutely perfect!`,
            imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 1.2)
          },
          {
            name: `Quick Cuts ${city}`,
            adContent: `Fast, affordable hair services in ${city}! No appointment needed, student discounts, quick turnaround. Quality cuts at unbeatable prices!`,
            imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 0.5)
          },
          {
            name: `Elite Hair & Beauty`,
            adContent: `Luxury salon experience in ${city}! Celebrity stylists, premium treatments, VIP service. Transform your look with ${city}'s most exclusive salon!`,
            imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=300&fit=crop&auto=format',
            budget: Math.round(budget * 2.2)
          }
        ]
      };
      
      return competitorTemplates[industry as keyof typeof competitorTemplates] || competitorTemplates.bakery;
    };
    
    const competitorData = getIndustryCompetitors();
    const platforms = ['Facebook', 'Instagram', 'Google Ads', 'TikTok'];
    
    const mockCompetitors: Competitor[] = competitorData.map((comp, index) => ({
      id: `comp-${index + 1}`,
      businessId,
      name: comp.name,
      industry,
      adContent: comp.adContent,
      platform: platforms[index % platforms.length],
      location: city,
      estimatedBudget: comp.budget,
      imageUrl: comp.imageUrl,
      createdAt: new Date().toISOString()
    }));
    
    return { success: true, data: mockCompetitors };
  },

  async compare(businessId: string, campaignId: string, competitorId: string): Promise<ApiResponse<Comparison>> {
    await delay(2000);
    
    const businessData = JSON.parse(localStorage.getItem('businessData') || '{}');
    const businessName = businessData.name || 'Your Business';
    const industry = businessData.industry || 'general';
    const city = businessData.city || 'your city';
    
    // Get competitor data for specific analysis
    const competitors = JSON.parse(localStorage.getItem('competitorData') || '[]');
    const competitor = competitors.find((c: any) => c.id === competitorId) || { name: 'Competitor', adContent: 'Generic ad content' };
    
    // Industry-specific analysis
    const getCompetitorAnalysis = () => {
      const analyses = {
        bakery: {
          strengths: ['Strong call-to-action', 'High-quality food photography', 'Clear value proposition'],
          weaknesses: ['Generic caption', 'No local cultural reference', 'Missing urgency elements'],
          competitiveness_score: Math.floor(Math.random() * 30) + 60, // 60-90
          counter_ad: {
            caption: `🥖 Freshly baked pastries daily in ${city} – Taste the difference with ${businessName}! Authentic recipes, local ingredients, unbeatable freshness. Visit us today! #Fresh${businessName.replace(/\s+/g, '')} #${city.replace(/\s+/g, '')}Bakery #AuthenticTaste`,
            poster_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=600&fit=crop&auto=format'
          }
        },
        restaurant: {
          strengths: ['Appetizing food imagery', 'Clear dining atmosphere', 'Professional presentation'],
          weaknesses: ['Lacks personality', 'No chef story', 'Generic location reference'],
          competitiveness_score: Math.floor(Math.random() * 25) + 65,
          counter_ad: {
            caption: `🍽️ Experience authentic flavors at ${businessName} in ${city}! Our chef’s signature dishes tell a story of passion and tradition. Book your table for an unforgettable dining experience! #Authentic${businessName.replace(/\s+/g, '')} #${city.replace(/\s+/g, '')}Dining`,
            poster_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=600&fit=crop&auto=format'
          }
        },
        retail: {
          strengths: ['Trendy visual appeal', 'Clear product showcase', 'Modern branding'],
          weaknesses: ['No personal styling mention', 'Generic fashion advice', 'Missing local connection'],
          competitiveness_score: Math.floor(Math.random() * 28) + 62,
          counter_ad: {
            caption: `✨ Discover your unique style at ${businessName} in ${city}! Personal styling consultations, curated collections, and fashion that speaks to YOU. Transform your wardrobe today! #Style${businessName.replace(/\s+/g, '')} #${city.replace(/\s+/g, '')}Fashion`,
            poster_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&auto=format'
          }
        },
        salon: {
          strengths: ['Dramatic transformation visuals', 'Professional equipment showcase', 'Clean aesthetic'],
          weaknesses: ['No stylist personality', 'Generic beauty advice', 'Missing consultation offer'],
          competitiveness_score: Math.floor(Math.random() * 32) + 58,
          counter_ad: {
            caption: `💇♀️ Transform your look at ${businessName} in ${city}! Expert stylists, premium products, personalized consultations. Your beauty journey starts here! Book now! #Transform${businessName.replace(/\s+/g, '')} #${city.replace(/\s+/g, '')}Beauty`,
            poster_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=600&fit=crop&auto=format'
          }
        }
      };
      
      return analyses[industry as keyof typeof analyses] || analyses.bakery;
    };
    
    const analysis = getCompetitorAnalysis();
    
    const mockComparison: Comparison = {
      comparisonId: `comparison-${Date.now()}`,
      businessId,
      campaignId,
      competitorId,
      scores: {
        clarity: Math.floor(Math.random() * 3) + 7, // 7-10
        cta: Math.floor(Math.random() * 4) + 6, // 6-10
        relevance: Math.floor(Math.random() * 2) + 8, // 8-10
        design: Math.floor(Math.random() * 3) + 7, // 7-10
        overall: analysis.competitiveness_score / 10
      },
      critique: `${competitor.name}'s ad analysis: Strengths include ${analysis.strengths.join(', ').toLowerCase()}. However, weaknesses are ${analysis.weaknesses.join(', ').toLowerCase()}. For ${businessName} in ${city}, focus on your local expertise and personalized service to differentiate from generic competitors.`,
      counterAd: {
        caption: analysis.counter_ad.caption,
        posterPrompt: `${businessName} branded poster with ${city} local elements, warm professional lighting, authentic customer interactions, premium ${industry} atmosphere, clear call-to-action`,
        videoScript: `OPEN: ${businessName} storefront in ${city}. VOICEOVER: "While others offer generic service..." CUT TO: Personalized attention at ${businessName}. "...we deliver authentic ${industry} expertise." MONTAGE: Happy local customers. END: "${businessName} - Your local ${industry} experts in ${city}."`
      },
      createdAt: new Date().toISOString()
    };
    
    return { success: true, data: mockComparison };
  },
};

export const chatApi = {
  async complete(businessId: string, sessionId: string, messages: ChatMessage[]): Promise<ApiResponse<{ text: string }>> {
    await delay(800); // Reduced to under 3 seconds
    
    const businessData = JSON.parse(localStorage.getItem('businessData') || '{}');
    const campaignData = JSON.parse(localStorage.getItem('campaignData') || '{}');
    const businessName = businessData.name || 'your business';
    const industry = businessData.industry || 'business';
    const city = businessData.city || 'your area';
    const goal = campaignData.goal || 'grow business';
    const budget = campaignData.budget || 500;
    
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    const messageCount = messages.length;
    
    // Actionable responses based on goal and context
    const responses = {
      greeting: [
        `👋 Welcome to Advisoria, your AI-powered marketing assistant! I'm here to help ${businessName} with campaign strategies, content ideas, competitor analysis, and budget planning specifically for your ${industry} business in ${city}. What would you like to work on?`,
        `✨ Welcome to Advisoria! Ready to boost ${businessName}'s marketing? I have fresh ideas for your ${industry} business. What's your biggest marketing challenge right now?`,
        `🚀 Hi there! Welcome to Advisoria - let's make ${businessName} the talk of ${city}! I'm here to help with marketing strategies tailored to your ${industry}. How can I assist you today?`
      ],
      campaign: [
        `📊 For ${businessName} to ${goal.replace(/_/g, ' ')}, here are 3 actionable strategies: 1) Post daily behind-the-scenes content on Instagram Stories showing your ${industry} process, 2) Run Facebook ads targeting ${city} residents within 5km radius with RM${Math.round(budget*0.4)} budget, 3) Partner with 2 complementary local businesses for cross-promotion. Which interests you most?`,
        `🎯 Perfect! To ${goal.replace(/_/g, ' ')} for ${businessName}, try these proven tactics: 1) Create weekly educational TikTok videos about ${industry} tips (builds authority), 2) Offer referral discounts - existing customers get 10% off for bringing friends, 3) Host monthly community events at your ${city} location. Want me to detail any of these?`,
        `✨ Smart goal! For ${businessName} to ${goal.replace(/_/g, ' ')} in ${city}, implement: 1) Google My Business optimization with daily posts and customer photos, 2) Instagram Reels showcasing your ${industry} expertise (post 3x/week), 3) Email newsletter with exclusive ${city} customer offers. Which should we start with?`
      ],
      budget: [
        `💰 For ${businessName}'s RM${budget} budget to ${goal.replace(/_/g, ' ')}, I recommend: 1) RM${Math.round(budget*0.4)} for Facebook ads targeting ${city} locals, 2) RM${Math.round(budget*0.3)} for Instagram content creation and promotion, 3) RM${Math.round(budget*0.3)} for Google Ads during peak hours. This targets your ${industry} audience effectively!`,
        `📈 Smart budgeting for ${businessName}: Allocate RM${Math.round(budget*0.6)} to digital ads (Facebook + Google), RM${Math.round(budget*0.25)} to content creation tools, RM${Math.round(budget*0.15)} to local partnerships. This mix works great for ${industry} businesses in ${city}!`,
        `🎯 Budget optimization tip: Since you want to ${goal.replace(/_/g, ' ')}, invest 50% in targeted local ads, 30% in content creation, 20% in customer retention programs. ${industry} businesses see 3:1 ROI with this approach!`
      ]
    };
    
    let responseCategory = 'campaign';
    if (lastMessage.includes('hello') || lastMessage.includes('hi') || messageCount <= 2) {
      responseCategory = 'greeting';
    } else if (lastMessage.includes('budget') || lastMessage.includes('cost') || lastMessage.includes('money')) {
      responseCategory = 'budget';
    }
    
    const categoryResponses = responses[responseCategory as keyof typeof responses];
    const response = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    
    return { success: true, data: { text: response } };
  },
};

export const uploadApi = {
  async getPresignedUrl(fileName: string, fileType: string): Promise<ApiResponse<UploadResponse>> {
    await delay(500);
    return {
      success: true,
      data: {
        uploadUrl: `https://mock-upload-url.com/${fileName}`,
        key: `uploads/${Date.now()}_${fileName}`
      }
    };
  },
};

export const storageApi = {
  async getItems(): Promise<ApiResponse<any[]>> {
    await delay(300);
    return { success: true, data: [] };
  },

  async createItem(item: any): Promise<ApiResponse<any>> {
    await delay(400);
    return { success: true, data: { ...item, id: `item-${Date.now()}` } };
  },
};