# SME Marketing Assistant - AI API

AWS SAM application providing AI-powered marketing features using Amazon Bedrock.

## Setup

1. Enable Bedrock model access:
   - Go to AWS Console > Bedrock > Model access
   - Enable Claude 3 Haiku model

2. Build and deploy:
```bash
sam build
sam deploy --guided --region ap-southeast-1
```

3. Note the API URL from outputs for frontend configuration.

## Features

- Marketing ideas generation
- Creative content creation
- Marketing plan generation
- Competitor analysis
- Counter-ad strategies
- AI chatbot conversations
- Fallback to deterministic responses when Bedrock unavailable

## Endpoints

- `POST /ideas/generate` - Generate marketing ideas
- `POST /creatives/generate` - Generate captions, posters, video scripts
- `POST /plan/generate` - Generate marketing plans
- `GET /competitors/generate` - Generate synthetic competitors
- `POST /compare` - Analyze and compare ads
- `POST /chat/complete` - Chatbot conversations

## Testing

```bash
# Test ideas generation
curl -X POST https://your-ai-api-url/ideas/generate \
  -H "Content-Type: application/json" \
  -d '{"campaignId":"test","businessId":"test"}'

# Test chat
curl -X POST https://your-ai-api-url/chat/complete \
  -H "Content-Type: application/json" \
  -d '{"businessId":"test","sessionId":"test","messages":[{"role":"user","content":"Hello"}]}'

# Test competitors
curl "https://your-ai-api-url/competitors/generate?businessId=test&industry=retail&city=NewYork"
```

## Bedrock Integration

Uses Claude 3 Haiku model for:
- Natural language generation
- Creative content creation
- Strategic analysis
- Conversational AI

Falls back to deterministic responses when Bedrock is unavailable.