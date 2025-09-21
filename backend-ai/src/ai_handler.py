import json
import boto3
from typing import Dict, Any
from datetime import datetime, timedelta

# Initialize Bedrock client
try:
    bedrock = boto3.client('bedrock-runtime', region_name='ap-southeast-1')
    BEDROCK_AVAILABLE = True
except Exception:
    BEDROCK_AVAILABLE = False

# Prompt templates
PROMPTS = {
    'IDEA_PROMPT': """Generate 8 creative marketing ideas for a {industry} business named {business_name} in {city}.
Campaign Goal: {goal}
Target Audience: {target_audience}
Budget: ${budget}

For each idea, provide:
- Title (concise, catchy)
- Description (2-3 sentences)
- Recommended platform (Facebook, Instagram, TikTok, Google Ads)

Focus on local relevance, budget-friendly tactics, and authentic engagement.""",

    'CREATIVE_POSTER_PROMPT': """Create 2 poster concepts for {business_name} ({industry}) marketing campaign:
Goal: {goal}
Target: {target_audience}

For each poster, provide a detailed visual description including:
- Main visual elements
- Color scheme
- Text placement
- Brand integration
- Target audience appeal""",

    'VIDEO_SCRIPT_PROMPT': """Write a 30-second video script for {business_name} ({industry}):
Goal: {goal}
Target: {target_audience}
Budget: ${budget}

Include:
- Scene descriptions
- Voiceover text
- Visual cues
- Call-to-action""",

    'PLAN_PROMPT': """Create a 7-14 day marketing plan for {business_name}:
Goal: {goal}
Budget: ${budget}
Working Hours: {working_hours}
Target: {target_audience}

Provide:
1. Budget allocation across platforms (percentages and amounts)
2. Daily posting schedule aligned with working hours
3. Content calendar with specific post times""",

    'COMPETITOR_SYNTH_PROMPT': """Generate 4 realistic competitor ads for {industry} businesses in {city}:
- Business names
- Ad content
- Platform (Facebook/Instagram/Google)
- Estimated budget
- Unique selling propositions

Make them diverse and realistic for the local market.""",

    'COMPETITOR_CRITIQUE_PROMPT': """Analyze this competitor ad and compare with our business:

Competitor: {competitor_name}
Their ad: "{competitor_content}"
Platform: {platform}

Our business: {business_name} ({industry})
Our advantages: {our_advantages}

Provide scores (1-10) for:
- Clarity
- Call-to-action effectiveness
- Relevance to target audience
- Design/visual appeal
- Overall effectiveness

Include detailed critique and improvement suggestions.""",

    'COUNTER_AD_PROMPT': """Generate a counter-ad strategy against this competitor:

Competitor: {competitor_name}
Their message: "{competitor_content}"
Their strength: {competitor_strength}

Our business: {business_name}
Our advantages: {our_advantages}
Our budget: ${budget}

Create:
1. Counter-ad caption (highlight our unique value)
2. Poster concept description
3. 30-second video script

Focus on authentic differentiation.""",

    'CHAT_SYSTEM_PROMPT': """You are a marketing assistant for {business_name}, a {industry} business in {city}.
Provide helpful marketing advice, campaign suggestions, and business growth tips.
Be concise, actionable, and specific to their industry and location."""
}

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Main AI Lambda handler with routing"""
    
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Content-Type': 'application/json'
    }
    
    try:
        method = event['requestContext']['http']['method']
        path = event['requestContext']['http']['path']
        
        if method == 'OPTIONS':
            return {'statusCode': 200, 'headers': headers, 'body': ''}
        
        # Route requests
        if path == '/ideas/generate' and method == 'POST':
            return handle_generate_ideas(event, headers)
        elif path == '/creatives/generate' and method == 'POST':
            return handle_generate_creatives(event, headers)
        elif path == '/plan/generate' and method == 'POST':
            return handle_generate_plan(event, headers)
        elif path == '/competitors/generate' and method == 'GET':
            return handle_generate_competitors(event, headers)
        elif path == '/compare' and method == 'POST':
            return handle_compare_ads(event, headers)
        elif path == '/chat/complete' and method == 'POST':
            return handle_chat_complete(event, headers)
        else:
            return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'success': False, 'error': 'Endpoint not found'})}
            
    except Exception as e:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'success': False, 'error': str(e)})}

def call_bedrock(prompt: str) -> str:
    """Call Bedrock Claude 3 Haiku or return stub response"""
    if not BEDROCK_AVAILABLE:
        return generate_stub_response(prompt)
    
    try:
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 2000,
            "messages": [{"role": "user", "content": prompt}]
        }
        
        response = bedrock.invoke_model(
            modelId="anthropic.claude-3-haiku-20240307-v1:0",
            body=json.dumps(body)
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['content'][0]['text']
        
    except Exception:
        return generate_stub_response(prompt)

def generate_stub_response(prompt: str) -> str:
    """Generate deterministic stub responses when Bedrock is unavailable"""
    if 'marketing ideas' in prompt.lower():
        return """1. Social Media Showcase - Share behind-the-scenes content on Instagram
2. Local Partnership Campaign - Collaborate with nearby businesses on Facebook
3. Customer Testimonial Series - Feature satisfied customers across platforms
4. Seasonal Promotion Drive - Create timely offers for current season
5. Educational Content Series - Share industry tips on TikTok
6. Community Event Sponsorship - Sponsor local events for brand visibility
7. Referral Reward Program - Incentivize customer referrals
8. Flash Sale Campaign - Create urgency with limited-time offers"""
    
    elif 'poster' in prompt.lower():
        return """Poster 1: Clean, modern design with business logo prominently displayed, warm color scheme, customer testimonial quote, clear call-to-action button.
Poster 2: Vibrant, eye-catching layout showcasing products/services, bold typography, contact information, special offer highlight."""
    
    elif 'video script' in prompt.lower():
        return """FADE IN: Business exterior shot
VOICEOVER: "Discover quality service at [Business Name]"
CUT TO: Team working, customers smiling
VOICEOVER: "Where excellence meets affordability"
TEXT OVERLAY: Contact information
CALL TO ACTION: "Visit us today!"
FADE OUT"""
    
    elif 'marketing plan' in prompt.lower():
        return """Budget Allocation:
- Facebook: 40% ($120)
- Instagram: 30% ($90)
- Google Ads: 20% ($60)
- TikTok: 10% ($30)

Schedule: Post 3x weekly during business hours, focus on engagement during peak times."""
    
    elif 'competitor' in prompt.lower():
        return """Competitor 1: Premium Business Co - "Luxury services at competitive prices" - Facebook - $500 budget
Competitor 2: Local Leader Ltd - "Community-focused solutions" - Instagram - $300 budget
Competitor 3: Quick Service Inc - "Fast, reliable, affordable" - Google Ads - $400 budget
Competitor 4: Expert Solutions - "Professional expertise you can trust" - TikTok - $200 budget"""
    
    else:
        return "I'm here to help with your marketing needs. Please let me know how I can assist you with campaigns, strategies, or business growth."

def handle_generate_ideas(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Generate marketing ideas"""
    try:
        body = json.loads(event['body'])
        
        # Extract business context (would normally come from DynamoDB)
        business_name = body.get('businessName', 'Your Business')
        industry = body.get('industry', 'general')
        city = body.get('city', 'your city')
        goal = body.get('goal', 'increase awareness')
        target_audience = body.get('targetAudience', 'local customers')
        budget = body.get('budget', 300)
        
        prompt = PROMPTS['IDEA_PROMPT'].format(
            industry=industry,
            business_name=business_name,
            city=city,
            goal=goal,
            target_audience=target_audience,
            budget=budget
        )
        
        ai_response = call_bedrock(prompt)
        
        # Parse response into structured ideas
        ideas = []
        lines = ai_response.split('\n')
        current_idea = {}
        
        for i, line in enumerate(lines):
            if line.strip() and (line[0].isdigit() or line.startswith('-')):
                if current_idea:
                    ideas.append({
                        'id': f"idea-{len(ideas)+1}",
                        'campaignId': body.get('campaignId', 'campaign-1'),
                        'title': current_idea.get('title', f'Marketing Idea {len(ideas)+1}'),
                        'description': current_idea.get('description', 'AI-generated marketing strategy'),
                        'platform': current_idea.get('platform', 'Facebook'),
                        'status': 'pending',
                        'createdAt': datetime.utcnow().isoformat()
                    })
                current_idea = {'title': line.strip()}
            elif 'description:' in line.lower() or 'platform:' in line.lower():
                if 'description:' in line.lower():
                    current_idea['description'] = line.split(':', 1)[1].strip()
                elif 'platform:' in line.lower():
                    current_idea['platform'] = line.split(':', 1)[1].strip()
        
        # Ensure we have at least 6 ideas
        while len(ideas) < 6:
            ideas.append({
                'id': f"idea-{len(ideas)+1}",
                'campaignId': body.get('campaignId', 'campaign-1'),
                'title': f'Marketing Strategy {len(ideas)+1}',
                'description': f'Targeted marketing approach for {business_name}',
                'platform': ['Facebook', 'Instagram', 'TikTok', 'Google Ads'][len(ideas) % 4],
                'status': 'pending',
                'createdAt': datetime.utcnow().isoformat()
            })
        
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': ideas[:8]})}
        
    except Exception as e:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'success': False, 'error': str(e)})}

def handle_generate_creatives(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Generate creative content"""
    try:
        body = json.loads(event['body'])
        
        business_name = body.get('businessName', 'Your Business')
        industry = body.get('industry', 'general')
        goal = body.get('goal', 'increase awareness')
        target_audience = body.get('targetAudience', 'local customers')
        
        # Generate captions
        captions = [
            f"🚀 Experience excellence at {business_name}! Quality service that makes a difference. Visit us today! #{business_name.replace(' ', '')} #Quality",
            f"✨ Special offer at {business_name}! Don't miss out on our amazing deals. Perfect for {target_audience}! #SpecialOffer #{business_name.replace(' ', '')}",
            f"👥 Behind the scenes at {business_name}: Meet our dedicated team and see the passion in every project! #BehindTheScenes #{business_name.replace(' ', '')}"
        ]
        
        # Generate poster prompts
        poster_prompt = PROMPTS['CREATIVE_POSTER_PROMPT'].format(
            business_name=business_name,
            industry=industry,
            goal=goal,
            target_audience=target_audience
        )
        poster_response = call_bedrock(poster_prompt)
        
        poster_prompts = [
            f"Professional {industry} business storefront with '{business_name}' signage, modern interior, customers engaged, quality service atmosphere",
            f"Happy customers using {business_name} services, satisfaction theme, professional environment, {industry} setting"
        ]
        
        # Generate video script
        video_prompt = PROMPTS['VIDEO_SCRIPT_PROMPT'].format(
            business_name=business_name,
            industry=industry,
            goal=goal,
            target_audience=target_audience,
            budget=body.get('budget', 300)
        )
        video_script = call_bedrock(video_prompt)
        
        creative = {
            'id': f"creative-{datetime.now().timestamp()}",
            'campaignId': body.get('campaignId', 'campaign-1'),
            'captions': captions,
            'posterPrompts': poster_prompts,
            'videoScript': video_script,
            'createdAt': datetime.utcnow().isoformat()
        }
        
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': creative})}
        
    except Exception as e:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'success': False, 'error': str(e)})}

def handle_generate_plan(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Generate marketing plan"""
    try:
        body = json.loads(event['body'])
        
        business_name = body.get('businessName', 'Your Business')
        goal = body.get('goal', 'increase awareness')
        budget = body.get('budget', 300)
        working_hours = body.get('workingHours', {'start': '09:00', 'end': '17:00'})
        target_audience = body.get('targetAudience', 'local customers')
        
        # Generate budget allocation
        budget_allocation = [
            {'platform': 'Facebook', 'amount': int(budget * 0.4), 'percentage': 40},
            {'platform': 'Instagram', 'amount': int(budget * 0.3), 'percentage': 30},
            {'platform': 'Google Ads', 'amount': int(budget * 0.2), 'percentage': 20},
            {'platform': 'TikTok', 'amount': int(budget * 0.1), 'percentage': 10}
        ]
        
        # Generate 14-day schedule
        start_date = datetime.now()
        schedule = []
        
        for i in range(14):
            current_date = start_date + timedelta(days=i)
            posts = []
            
            # Add posts based on day pattern
            if i % 2 == 0:  # Even days
                posts.append({
                    'platform': 'Facebook',
                    'content': f'Quality service at {business_name}',
                    'time': '10:00'
                })
            if i % 3 == 0:  # Every 3rd day
                posts.append({
                    'platform': 'Instagram',
                    'content': f'Behind the scenes at {business_name}',
                    'time': '14:00'
                })
            
            schedule.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'posts': posts
            })
        
        plan = {
            'id': f"plan-{datetime.now().timestamp()}",
            'campaignId': body.get('campaignId', 'campaign-1'),
            'budgetAllocation': budget_allocation,
            'schedule': schedule,
            'createdAt': datetime.utcnow().isoformat()
        }
        
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': plan})}
        
    except Exception as e:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'success': False, 'error': str(e)})}

def handle_generate_competitors(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Generate synthetic competitor ads"""
    try:
        params = event.get('queryStringParameters', {})
        business_id = params.get('businessId', 'demo')
        industry = params.get('industry', 'general')
        city = params.get('city', 'local area')
        
        prompt = PROMPTS['COMPETITOR_SYNTH_PROMPT'].format(
            industry=industry,
            city=city
        )
        
        ai_response = call_bedrock(prompt)
        
        # Parse into structured competitors
        competitors = [
            {
                'id': f'comp-{i+1}',
                'businessId': business_id,
                'name': f'Competitor {i+1}',
                'industry': industry,
                'adContent': f'Professional {industry} services in {city}. Quality and reliability guaranteed.',
                'platform': ['Facebook', 'Instagram', 'Google Ads', 'TikTok'][i % 4],
                'location': city,
                'estimatedBudget': [500, 300, 400, 200][i % 4],
                'createdAt': datetime.utcnow().isoformat()
            }
            for i in range(4)
        ]
        
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': competitors})}
        
    except Exception as e:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'success': False, 'error': str(e)})}

def handle_compare_ads(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Compare ads and generate counter-strategy"""
    try:
        body = json.loads(event['body'])
        
        business_id = body.get('businessId', 'demo')
        campaign_id = body.get('campaignId', 'campaign-1')
        competitor_id = body.get('competitorId', 'comp-1')
        
        # Mock comparison data
        comparison = {
            'comparisonId': f"comparison-{datetime.now().timestamp()}",
            'businessId': business_id,
            'campaignId': campaign_id,
            'competitorId': competitor_id,
            'scores': {
                'clarity': 8.5,
                'cta': 7.0,
                'relevance': 9.0,
                'design': 8.0,
                'overall': 8.1
            },
            'critique': 'Your ad has excellent local relevance and clear messaging. The authentic approach is strong. However, the call-to-action could be more urgent. The community-focused approach is your key differentiator.',
            'counterAd': {
                'caption': '🌟 While others talk premium, we deliver VALUE daily! Community-focused for years, serving locals with dedication. Experience our authentic approach - quality service, fair prices. Free consultation today! #AuthenticService #CommunityFirst',
                'posterPrompt': 'Warm, inviting business interior, team working together, satisfied customers, affordable pricing displayed, professional lighting',
                'videoScript': 'OPEN: Early morning - Team preparing for the day. VOICEOVER: "While others charge premium prices..." CUT TO: Fair pricing. "...we believe great service should be accessible." MONTAGE: Happy diverse customers. END: "Your Business - Real service, real value, real community."'
            },
            'createdAt': datetime.utcnow().isoformat()
        }
        
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': comparison})}
        
    except Exception as e:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'success': False, 'error': str(e)})}

def handle_chat_complete(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Handle chatbot conversation"""
    try:
        body = json.loads(event['body'])
        
        business_id = body.get('businessId', 'demo')
        session_id = body.get('sessionId', 'session-1')
        messages = body.get('messages', [])
        
        # Get last user message
        user_message = messages[-1]['content'] if messages else "Hello"
        
        # Generate response
        response_text = call_bedrock(f"As a marketing assistant, respond to: {user_message}")
        
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
            'success': True,
            'data': {'text': response_text}
        })}
        
    except Exception as e:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'success': False, 'error': str(e)})}